import sys
import os
import subprocess
from PySide6.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget, QLabel
from PySide6.QtCore import Qt

# --- CONFIGURAÇÃO ---
# Caminho para o script que roda a simulação pesada
# Ele aponta para o run_framework.py dentro da sua pasta src
SCRIPT_TO_RUN = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "run_framework.py")

# Estilo QSS para um visual moderno
STYLESHEET = """
QWidget {
    background-color: #2E3440; /* Nord Polar Night */
    color: #D8DEE9; /* Nord Snow Storm */
    font-family: "Segoe UI", Arial, sans-serif;
}
QLabel#title {
    font-size: 22px;
    font-weight: bold;
    color: #88C0D0; /* Nord Frost */
    padding-bottom: 10px;
}
QLabel#info {
    font-size: 14px;
    color: #E5E9F0;
    padding-bottom: 20px;
}
QPushButton {
    background-color: #5E81AC; /* Nord Frost */
    color: #ECEFF4;
    font-size: 16px;
    font-weight: bold;
    padding: 15px;
    border-radius: 5px;
    border: none;
}
QPushButton:hover {
    background-color: #81A1C1;
}
"""

class LauncherWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("RCE Framework Launcher")
        self.setFixedSize(450, 220)

        self.central_widget = QWidget()
        self.layout = QVBoxLayout(self.central_widget)
        self.layout.setAlignment(Qt.AlignmentFlag.AlignTop)

        title = QLabel("Repopulation-With-Elite-Set")
        title.setObjectName("title")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)

        info = QLabel("Clique para iniciar as simulações do DEAP e Pandapower.\nO processo rodará em um terminal separado.")
        info.setObjectName("info")
        info.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.run_button = QPushButton("🚀 INICIAR FRAMEWORK")
        self.run_button.clicked.connect(self.run_script)

        self.layout.addWidget(title)
        self.layout.addWidget(info)
        self.layout.addWidget(self.run_button)

        self.setCentralWidget(self.central_widget)

    def run_script(self):
        """Inicia o script run_framework.py em um novo processo."""
        print(f"Iniciando o script: {SCRIPT_TO_RUN}")
        try:
            # Garante que o script existe antes de tentar rodar
            if not os.path.exists(SCRIPT_TO_RUN):
                # Se não encontrar, podemos tentar mostrar um erro na UI
                # mas por enquanto, um print é suficiente.
                print(f"ERRO: Script não encontrado em '{SCRIPT_TO_RUN}'")
                return

            # Inicia o script em uma nova janela de console
            if os.name == 'nt': # Windows
                subprocess.Popen([sys.executable, SCRIPT_TO_RUN], creationflags=subprocess.CREATE_NEW_CONSOLE)
            else: # Linux/macOS
                # Pode precisar de um terminal wrapper para abrir uma nova janela
                # Ex: ['xterm', '-e', sys.executable, SCRIPT_TO_RUN]
                subprocess.Popen([sys.executable, SCRIPT_TO_RUN])
            
            self.close() # Fecha o lançador após o sucesso

        except Exception as e:
            print(f"Erro ao iniciar o script: {e}")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyleSheet(STYLESHEET)
    window = LauncherWindow()
    window.show()
    sys.exit(app.exec())
