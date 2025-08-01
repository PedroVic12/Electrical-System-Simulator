import os
from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QListWidget, QTextEdit, QSplitter
)
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtCore import QUrl, Signal
import os
#import Plotly.graph_objects as go   


class MainView(QMainWindow):
    start_simulation_requested = Signal()

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Framework de Simulação Integrado")
        self.setGeometry(100, 100, 1400, 900)

        splitter = QSplitter()
        self.setCentralWidget(splitter)

        # --- Painel de Controle (Esquerda) ---
        control_panel = QWidget()
        control_layout = QVBoxLayout(control_panel)
        
        title_label = QLabel("Painel de Controle")
        title_label.setObjectName("title")
        control_layout.addWidget(title_label)

        control_layout.addWidget(QLabel("Log da Execução:"))
        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        control_layout.addWidget(self.log_output)
        
        self.run_button = QPushButton("▶️ Iniciar Simulação")
        control_layout.addWidget(self.run_button)
        
        splitter.addWidget(control_panel)

        # --- Painel de Resultados (Direita) ---
        results_panel = QWidget()
        results_layout = QVBoxLayout(results_panel)
        
        results_title = QLabel("Visualizador de Resultados")
        results_title.setObjectName("title")
        results_layout.addWidget(results_title)
        
        results_splitter = QSplitter(results_panel)
        results_layout.addWidget(results_splitter)
        
        self.results_list_widget = QListWidget()
        self.web_view = QWebEngineView()
        
        results_splitter.addWidget(self.results_list_widget)
        results_splitter.addWidget(self.web_view)
        results_splitter.setSizes([300, 1100])

        splitter.addWidget(results_panel)
        splitter.setSizes([400, 1000])

        self.run_button.clicked.connect(self.start_simulation_requested.emit)
        self.results_list_widget.itemClicked.connect(self.on_result_selected)

    def on_result_selected(self, item):
        file_path = os.path.abspath(os.path.join("resultados_html", item.text()))
        if os.path.exists(file_path):
            self.web_view.setUrl(QUrl.fromLocalFile(file_path))

    def update_log(self, message):
        self.log_output.append(message)

    def update_results_list(self, results_folder):
        self.results_list_widget.clear()
        if os.path.exists(results_folder):
            files = [f for f in os.listdir(results_folder) if f.endswith(".html")]
            self.results_list_widget.addItems(sorted(files))

    def set_simulation_running(self, is_running):
        if is_running:
            self.run_button.setText("Executando...")
            self.run_button.setEnabled(False)
        else:
            self.run_button.setText("▶️ Iniciar Simulação")
            self.run_button.setEnabled(True)