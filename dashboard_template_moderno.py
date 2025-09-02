import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, List, Any, Optional, Union
from abc import ABC, abstractmethod
import numpy as np


class DataLoader:
    """Classe responsável por carregar e validar dados"""
    
    def __init__(self, data_source: Union[str, pd.DataFrame]):
        self.data_source = data_source
        self.df = None
        
    def load_data(self) -> pd.DataFrame:
        """Carrega dados de diferentes fontes"""
        try:
            if isinstance(self.data_source, str):
                # URL ou caminho de arquivo
                if self.data_source.startswith('http'):
                    self.df = pd.read_csv(self.data_source)
                else:
                    # Assumir que é um caminho local
                    self.df = pd.read_csv(self.data_source)
            elif isinstance(self.data_source, pd.DataFrame):
                self.df = self.data_source.copy()
            else:
                raise ValueError("Fonte de dados deve ser uma URL, caminho de arquivo ou DataFrame")
                
            self._validate_data()
            return self.df
            
        except Exception as e:
            st.error(f"Erro ao carregar dados: {str(e)}")
            return pd.DataFrame()
    
    def _validate_data(self):
        """Valida se os dados foram carregados corretamente"""
        if self.df is None or self.df.empty:
            raise ValueError("Dataset está vazio")
        
        st.sidebar.success(f"✅ Dataset carregado: {self.df.shape[0]} registros, {self.df.shape[1]} colunas")


class FilterManager:
    """Gerenciador de filtros dinâmicos para qualquer dataset"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
        self.categorical_columns = df.select_dtypes(include=['object', 'category']).columns.tolist()
        self.datetime_columns = df.select_dtypes(include=['datetime64']).columns.tolist()
    
    def create_filters(self) -> Dict[str, Any]:
        """Cria filtros dinâmicos baseados no tipo de dados"""
        st.sidebar.header("🔍 Filtros Dinâmicos")
        filters = {}
        
        # Filtros categóricos
        for col in self.categorical_columns:
            if self.df[col].nunique() <= 50:  # Só criar filtro se tiver até 50 valores únicos
                unique_values = sorted(self.df[col].dropna().unique())
                selected = st.sidebar.multiselect(
                    f"{col.replace('_', ' ').title()}",
                    unique_values,
                    default=unique_values
                )
                filters[col] = selected
        
        # Filtros numéricos (sliders)
        for col in self.numeric_columns:
            if self.df[col].nunique() > 2:  # Só criar slider se não for binário
                min_val = float(self.df[col].min())
                max_val = float(self.df[col].max())
                selected_range = st.sidebar.slider(
                    f"{col.replace('_', ' ').title()}",
                    min_value=min_val,
                    max_value=max_val,
                    value=(min_val, max_val)
                )
                filters[f"{col}_range"] = selected_range
        
        return filters
    
    def apply_filters(self, filters: Dict[str, Any]) -> pd.DataFrame:
        """Aplica os filtros selecionados"""
        df_filtered = self.df.copy()
        
        for key, values in filters.items():
            if not values:
                continue
                
            if key.endswith('_range'):
                # Filtro numérico
                col_name = key.replace('_range', '')
                if col_name in df_filtered.columns:
                    min_val, max_val = values
                    df_filtered = df_filtered[
                        (df_filtered[col_name] >= min_val) & 
                        (df_filtered[col_name] <= max_val)
                    ]
            else:
                # Filtro categórico
                if key in df_filtered.columns:
                    df_filtered = df_filtered[df_filtered[key].isin(values)]
        
        return df_filtered


class MetricsCalculator:
    """Calculadora de métricas genéricas"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
        self.categorical_columns = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    def calculate_basic_metrics(self) -> Dict[str, Any]:
        """Calcula métricas básicas do dataset"""
        metrics = {
            'total_records': len(self.df),
            'total_columns': len(self.df.columns)
        }
        
        # Métricas para colunas numéricas
        if self.numeric_columns:
            main_numeric = self.numeric_columns[0]  # Usar primeira coluna numérica como principal
            metrics.update({
                f'{main_numeric}_mean': self.df[main_numeric].mean(),
                f'{main_numeric}_median': self.df[main_numeric].median(),
                f'{main_numeric}_max': self.df[main_numeric].max(),
                f'{main_numeric}_min': self.df[main_numeric].min()
            })
        
        # Métrica para colunas categóricas
        if self.categorical_columns:
            main_categorical = self.categorical_columns[0]
            most_frequent = self.df[main_categorical].mode()
            metrics[f'most_frequent_{main_categorical}'] = most_frequent[0] if len(most_frequent) > 0 else "N/A"
        
        return metrics
    
    def display_metrics(self):
        """Exibe métricas em formato de cards"""
        metrics = self.calculate_basic_metrics()
        
        st.subheader("📊 Métricas Gerais")
        
        # Criar colunas dinamicamente
        num_metrics = len(metrics)
        cols = st.columns(min(num_metrics, 5))
        
        for i, (key, value) in enumerate(metrics.items()):
            with cols[i % 5]:
                # Formatação baseada no tipo de valor
                if isinstance(value, (int, float)):
                    if key.endswith(('_mean', '_median', '_max', '_min')):
                        formatted_value = f"{value:,.2f}"
                    else:
                        formatted_value = f"{value:,}"
                else:
                    formatted_value = str(value)
                
                st.metric(
                    label=key.replace('_', ' ').title(),
                    value=formatted_value
                )


class ChartGenerator:
    """Gerador de gráficos dinâmicos"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
        self.categorical_columns = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    def create_histogram(self, column: str, title: str = None) -> Optional[go.Figure]:
        """Cria histograma para coluna numérica"""
        if column not in self.numeric_columns:
            return None
        
        fig = px.histogram(
            self.df,
            x=column,
            title=title or f"Distribuição de {column.replace('_', ' ').title()}",
            nbins=30
        )
        fig.update_layout(title_x=0.1)
        return fig
    
    def create_bar_chart(self, column: str, value_column: str = None, title: str = None) -> Optional[go.Figure]:
        """Cria gráfico de barras para coluna categórica"""
        if column not in self.categorical_columns:
            return None
        
        if value_column and value_column in self.numeric_columns:
            # Gráfico de barras agregado
            data = self.df.groupby(column)[value_column].mean().sort_values(ascending=False).head(10)
            fig = px.bar(
                x=data.values,
                y=data.index,
                orientation='h',
                title=title or f"Top 10 {column.replace('_', ' ').title()} por {value_column.replace('_', ' ').title()}"
            )
        else:
            # Gráfico de contagem
            data = self.df[column].value_counts().head(10)
            fig = px.bar(
                x=data.index,
                y=data.values,
                title=title or f"Contagem por {column.replace('_', ' ').title()}"
            )
        
        fig.update_layout(title_x=0.1)
        return fig
    
    def create_pie_chart(self, column: str, title: str = None) -> Optional[go.Figure]:
        """Cria gráfico de pizza para coluna categórica"""
        if column not in self.categorical_columns:
            return None
        
        data = self.df[column].value_counts()
        fig = px.pie(
            values=data.values,
            names=data.index,
            title=title or f"Distribuição de {column.replace('_', ' ').title()}",
            hole=0.4
        )
        fig.update_layout(title_x=0.1)
        return fig
    
    def create_scatter_plot(self, x_col: str, y_col: str, color_col: str = None, title: str = None) -> Optional[go.Figure]:
        """Cria gráfico de dispersão"""
        if x_col not in self.numeric_columns or y_col not in self.numeric_columns:
            return None
        
        fig = px.scatter(
            self.df,
            x=x_col,
            y=y_col,
            color=color_col if color_col in self.df.columns else None,
            title=title or f"{x_col.replace('_', ' ').title()} vs {y_col.replace('_', ' ').title()}"
        )
        fig.update_layout(title_x=0.1)
        return fig


class DashboardTemplate:
    """Template de dashboard genérico para qualquer dataset"""
    
    def __init__(self, data_source: Union[str, pd.DataFrame], title: str = "Dashboard de Análise de Dados"):
        self.title = title
        self.data_loader = DataLoader(data_source)
        self.df = None
        self.df_filtered = None
        self.filter_manager = None
        self.metrics_calculator = None
        self.chart_generator = None
        
        self._setup()
    
    def _setup(self):
        """Configuração inicial do dashboard"""
        st.set_page_config(
            page_title=self.title,
            page_icon="📊",
            layout="wide"
        )
        
        # Carregar dados
        self.df = self.data_loader.load_data()
        if not self.df.empty:
            self.filter_manager = FilterManager(self.df)
            self.metrics_calculator = MetricsCalculator(self.df)
            self.chart_generator = ChartGenerator(self.df)
            self.df_filtered = self.df
    
    def create_sidebar(self) -> Dict[str, Any]:
        """Cria a barra lateral com filtros"""
        if self.filter_manager is None:
            return {}
        
        # Informações do dataset
        st.sidebar.header("📋 Informações do Dataset")
        st.sidebar.info(f"**Linhas:** {len(self.df)}\n**Colunas:** {len(self.df.columns)}")
        
        # Criar filtros
        filters = self.filter_manager.create_filters()
        
        # Botão para resetar filtros
        if st.sidebar.button("🔄 Resetar Filtros"):
            st.rerun()
        
        return filters
    
    def apply_filters(self, filters: Dict[str, Any]):
        """Aplica filtros aos dados"""
        if self.filter_manager is not None:
            self.df_filtered = self.filter_manager.apply_filters(filters)
            
            # Atualizar calculadoras com dados filtrados
            self.metrics_calculator = MetricsCalculator(self.df_filtered)
            self.chart_generator = ChartGenerator(self.df_filtered)
    
    def display_main_content(self):
        """Exibe o conteúdo principal do dashboard"""
        st.title(self.title)
        st.markdown("Dashboard genérico que se adapta automaticamente ao seu dataset.")
        
        if self.df is None or self.df.empty:
            st.error("Nenhum dado disponível para análise.")
            return
        
        # Métricas
        if self.metrics_calculator:
            self.metrics_calculator.display_metrics()
        
        st.markdown("---")
        
        # Gráficos
        self.display_charts()
        
        st.markdown("---")
        
        # Tabela de dados
        self.display_data_table()
    
    def display_charts(self):
        """Exibe gráficos automaticamente baseados nos dados"""
        if not self.chart_generator:
            return
        
        st.subheader("📈 Análises Visuais")
        
        numeric_cols = self.chart_generator.numeric_columns
        categorical_cols = self.chart_generator.categorical_columns
        
        # Layout de gráficos
        col1, col2 = st.columns(2)
        
        with col1:
            # Histograma da primeira coluna numérica
            if numeric_cols:
                fig_hist = self.chart_generator.create_histogram(numeric_cols[0])
                if fig_hist:
                    st.plotly_chart(fig_hist, use_container_width=True)
        
        with col2:
            # Gráfico de barras da primeira coluna categórica
            if categorical_cols:
                fig_bar = self.chart_generator.create_bar_chart(categorical_cols[0])
                if fig_bar:
                    st.plotly_chart(fig_bar, use_container_width=True)
        
        # Segunda linha de gráficos
        col3, col4 = st.columns(2)
        
        with col3:
            # Gráfico de pizza se houver coluna categórica
            if categorical_cols and len(categorical_cols) > 1:
                fig_pie = self.chart_generator.create_pie_chart(categorical_cols[1])
                if fig_pie:
                    st.plotly_chart(fig_pie, use_container_width=True)
            elif categorical_cols:
                fig_pie = self.chart_generator.create_pie_chart(categorical_cols[0])
                if fig_pie:
                    st.plotly_chart(fig_pie, use_container_width=True)
        
        with col4:
            # Gráfico de dispersão se houver pelo menos 2 colunas numéricas
            if len(numeric_cols) >= 2:
                color_col = categorical_cols[0] if categorical_cols else None
                fig_scatter = self.chart_generator.create_scatter_plot(
                    numeric_cols[0], 
                    numeric_cols[1], 
                    color_col
                )
                if fig_scatter:
                    st.plotly_chart(fig_scatter, use_container_width=True)
    
    def display_data_table(self):
        """Exibe tabela de dados com opções de paginação"""
        st.subheader("🗂️ Visualização dos Dados")
        
        col1, col2, col3 = st.columns([2, 1, 1])
        
        with col2:
            rows_to_show = st.selectbox("Linhas por página:", [10, 25, 50, 100], index=1)
        
        with col3:
            show_all = st.checkbox("Mostrar todas as colunas")
        
        # Preparar dados para exibição
        display_df = self.df_filtered.copy()
        
        if not show_all and len(display_df.columns) > 10:
            # Mostrar apenas as primeiras 10 colunas
            display_df = display_df.iloc[:, :10]
            st.info("Mostrando apenas as primeiras 10 colunas. Marque 'Mostrar todas as colunas' para ver mais.")
        
        # Exibir tabela
        st.dataframe(
            display_df.head(rows_to_show),
            use_container_width=True
        )
        
        # Informações adicionais
        st.info(f"Mostrando {min(rows_to_show, len(self.df_filtered))} de {len(self.df_filtered)} registros filtrados")
    
    def run(self):
        """Executa o dashboard completo"""
        if self.df is None or self.df.empty:
            st.error("Não foi possível carregar os dados. Verifique a fonte de dados.")
            return
        
        # Criar sidebar e obter filtros
        filters = self.create_sidebar()
        
        # Aplicar filtros
        self.apply_filters(filters)
        
        # Exibir conteúdo principal
        self.display_main_content()


# Função de conveniência para criar dashboard rapidamente
def create_dashboard(data_source: Union[str, pd.DataFrame], title: str = "Meu Dashboard"):
    """
    Função de conveniência para criar um dashboard rapidamente
    
    Args:
        data_source: URL, caminho do arquivo ou DataFrame
        title: Título do dashboard
    """
    dashboard = DashboardTemplate(data_source, title)
    dashboard.run()


# Exemplo de uso
if __name__ == "__main__":
    # Exemplo com seus dados
    data_url = "https://raw.githubusercontent.com/PedroVic12/Repopulation-With-Elite-Set/refs/heads/main/resultados%20-%20Artigo%20PIBIC/2025-09-01_resultados.csv"
    
    create_dashboard(
        data_source=data_url,
        title="Dashboard de Análise - Resultados PIBIC"
    )