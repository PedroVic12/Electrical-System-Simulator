import os
import json
import time
import plotly.graph_objects as go
from PySide6.QtCore import QObject, Signal

class SimulationModel(QObject):
    progress_updated = Signal(str)
    simulation_finished = Signal(int)

    def __init__(self):
        super().__init__()
        self.config_path = "config.json"
        self.results_folder = "resultados_html"
        self.config_data = self.load_config()

    def load_config(self):
        if not os.path.exists(self.config_path):
            default_config = {"execucoes": 20, "taxa_mutacao": 0.1}
            with open(self.config_path, 'w') as f:
                json.dump(default_config, f, indent=4)
            return default_config
        with open(self.config_path, 'r') as f:
            return json.load(f)

    def run_simulation_process(self):
        try:
            if not os.path.exists(self.results_folder):
                os.makedirs(self.results_folder)

            num_execucoes = self.config_data.get("execucoes", 1)
            self.progress_updated.emit(f"Iniciando simulação com {num_execucoes} execuções...")

            for i in range(1, num_execucoes + 1):
                self.progress_updated.emit(f"Processando execução {i}/{num_execucoes}...")
                time.sleep(1.5)

                fig = go.Figure(go.Scatter(x=[0, 1, 2, 3], y=[i, i*1.2, i*0.8, i*1.5], mode='lines+markers'))
                fig.update_layout(
                    title_text=f'Resultado da Execução {i}',
                    template='plotly_dark' # Usando um template escuro do Plotly
                )

                file_path = os.path.join(self.results_folder, f'resultado_exec_{i}.html')
                fig.write_html(file_path, include_plotlyjs='cdn')
                self.progress_updated.emit(f"-> Resultado salvo: {os.path.basename(file_path)}")
            
            self.progress_updated.emit("Simulação concluída com sucesso.")
            self.simulation_finished.emit(0)

        except Exception as e:
            self.progress_updated.emit(f"ERRO na simulação: {e}")
            self.simulation_finished.emit(1)