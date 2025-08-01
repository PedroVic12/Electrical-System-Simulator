import sys
from PySide6.QtWidgets import QApplication
from PySide6.QtWebEngineCore import QWebEngineProfile
from view import MainView
from model import SimulationModel
from controller import SimulationController

# pip install PySide6 PySide6-Addons plotly

if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    # Desativa o cache do WebEngine para garantir que os gráficos sempre recarreguem
    QWebEngineProfile.defaultProfile().setHttpCacheType(QWebEngineProfile.HttpCacheType.NoCache)

    try:
        with open("modern_style.qss", "r") as f:
            app.setStyleSheet(f.read())
    except FileNotFoundError:
        print("Arquivo de estilo 'modern_style.qss' não encontrado.")

    view = MainView()
    model = SimulationModel()
    controller = SimulationController(model=model, view=view)

    view.show()
    sys.exit(app.exec())