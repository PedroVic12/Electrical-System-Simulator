
from model import TimeSeriesModel
from view import DashboardView
import streamlit as st

class AppController:
    def __init__(self):
        # Inicializa o Model e a View
        # Usamos o cache do Streamlit para carregar o modelo de IA apenas uma vez
        @st.cache_resource
        def load_model():
            return TimeSeriesModel()
        
        self.model = load_model()
        self.view = DashboardView()

    def run(self):
        """
        Executa a lógica principal da aplicação.
        """
        # 1. Renderiza a barra lateral e obtém as entradas do usuário
        prediction_days, run_button = self.view.render_sidebar()

        # 2. Carrega os dados (usando o caminho do arquivo de exemplo)
        # A função no modelo usará dados de exemplo se o arquivo não existir
        file_path = 'dados_carga_exemplo.csv'
        historical_data = self.model.load_data(file_path)

        forecast_data = None
        # 3. Verifica se o botão de previsão foi pressionado
        if run_button:
            # Pega o contexto mais recente para a previsão
            # Chronos pode usar um contexto de até ~512 pontos
            context_length = 512
            prediction_context = historical_data.iloc[-context_length:]

            # Pede ao modelo para fazer a previsão
            with st.spinner(f'Gerando previsão para {prediction_days} dias...'):
                forecast_data = self.model.make_prediction(prediction_context, prediction_days)
        
        # 4. Renderiza o conteúdo principal (gráfico e tabela)
        self.view.render_main_content(historical_data, forecast_data)

if __name__ == "__main__":
    app = AppController()
    app.run()
