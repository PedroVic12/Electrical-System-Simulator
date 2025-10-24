
import streamlit as st
import pandas as pd
import plotly.graph_objects as go

class DashboardView:
    def __init__(self):
        st.set_page_config(layout="wide")
        st.title("Dashboard de Previsão de Séries Temporais com Chronos-T5")

    def render_sidebar(self, default_prediction_days=30):
        """
        Renderiza a barra lateral com os controles do usuário.
        Retorna o número de dias para previsão.
        """
        st.sidebar.header("Configurações")
        prediction_days = st.sidebar.number_input(
            "Número de dias para prever", 
            min_value=1, 
            max_value=365, 
            value=default_prediction_days
        )
        run_button = st.sidebar.button("Gerar Previsão")
        return prediction_days, run_button

    def render_main_content(self, historical_data: pd.Series, forecast_data: pd.Series = None):
        """
        Renderiza o conteúdo principal, incluindo o gráfico e a tabela de dados.
        """
        st.header("Visualização dos Dados")

        # Cria o gráfico
        fig = go.Figure()

        # Adiciona os dados históricos ao gráfico
        fig.add_trace(go.Scatter(
            x=historical_data.index,
            y=historical_data.values,
            mode='lines',
            name='Dados Históricos'
        ))

        # Adiciona a previsão ao gráfico, se disponível
        if forecast_data is not None:
            fig.add_trace(go.Scatter(
                x=forecast_data.index,
                y=forecast_data.values,
                mode='lines',
                name='Previsão',
                line=dict(dash='dash')
            ))
        
        st.plotly_chart(fig, use_container_width=True)

        # Exibe a tabela com os dados da previsão
        if forecast_data is not None:
            st.header("Valores Previstos")
            st.dataframe(forecast_data)
