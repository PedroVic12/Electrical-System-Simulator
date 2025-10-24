
import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import numpy as np

class TimeSeriesModel:
    def __init__(self, model_name="amazon/chronos-t5-small"):
        """
        Inicializa o Modelo, carregando o tokenizador e o modelo pré-treinado.
        """
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    def load_data(self, file_path):
        """
        Carrega os dados de um arquivo CSV usando pandas.
        Assume que o CSV tem colunas 'data' e 'carga_mwmed'.
        """
        try:
            df = pd.read_csv(file_path)
            df['data'] = pd.to_datetime(df['data'])
            df = df.set_index('data')
            # Chronos funciona melhor com dados regulares, então vamos reamostrar para frequência diária
            df = df.resample('D').mean().fillna(method='ffill')
            return df['carga_mwmed']
        except FileNotFoundError:
            # Retorna dados de exemplo se o arquivo não for encontrado
            print("Arquivo de dados não encontrado. Usando dados de exemplo.")
            dates = pd.to_datetime(pd.date_range(start="2023-01-01", periods=100, freq='D'))
            data = np.random.randint(50000, 75000, size=100)
            return pd.Series(data, index=dates, name="carga_mwmed")

    def make_prediction(self, context_series, prediction_length):
        """
        Realiza a previsão usando o modelo Chronos.
        """
        # Prepara os inputs para o modelo
        context_tensor = torch.tensor(context_series.values)
        inputs = self.tokenizer(
            [context_tensor],
            return_tensors="pt",
            padding=True
        )

        # Gera a previsão
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=prediction_length,
            num_beams=4,
        )

        # Decodifica a previsão
        forecast_str = self.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
        forecast_values = [float(v) for v in forecast_str.split()]

        # Cria um índice de datas para a previsão
        last_date = context_series.index[-1]
        forecast_index = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=prediction_length, freq='D')

        return pd.Series(forecast_values, index=forecast_index, name="previsao")

