from PySide6.QtWidgets import QApplication, QWidget, QTreeWidget, QTreeWidgetItem, QVBoxLayout
from PySide6.QtGui import QIcon
import sys

class MenuArvore(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Menu em Árvore - Jarvis UI")
        self.setGeometry(200, 200, 400, 400)

        layout = QVBoxLayout()
        self.tree = QTreeWidget()
        self.tree.setHeaderHidden(True)

        # Nó raiz principal
        root = QTreeWidgetItem(["Lousa"])
        self.tree.addTopLevelItem(root)

        # Subníveis principais
        adicionar = QTreeWidgetItem(["Adicionar fotos e arquivos"])
        criar = QTreeWidgetItem(["Criar imagem"])
        pensar = QTreeWidgetItem(["Pensando"])
        investigar = QTreeWidgetItem(["Investigar"])
        estudar = QTreeWidgetItem(["Estudar e aprender"])
        mais = QTreeWidgetItem(["Mais"])

        root.addChildren([adicionar, criar, pensar, investigar, estudar, mais])

        # Subníveis de "Mais"
        busca_web = QTreeWidgetItem(["Busca na Web"])
        mais.addChild(busca_web)

        self.tree.expandAll()
        layout.addWidget(self.tree)
        self.setLayout(layout)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    janela = MenuArvore()
    janela.show()
    sys.exit(app.exec())
