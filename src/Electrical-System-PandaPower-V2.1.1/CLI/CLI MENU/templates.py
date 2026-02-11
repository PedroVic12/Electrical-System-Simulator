# --- TEMPLATES ---
TEMPLATES = {
    "pyside6": {
        "1": ("Window", "from PySide6.QtWidgets import QMainWindow\nclass {name}Window(QMainWindow):\n    def __init__(self): super().__init__(); self.setWindowTitle('{name}')"),
        "2": ("Button", "from PySide6.QtWidgets import QPushButton\nclass {name}Btn(QPushButton):\n    def __init__(self): super().__init__('{name}')"),
        "3": ("Input", "from PySide6.QtWidgets import QLineEdit\nclass {name}Input(QLineEdit):\n    def __init__(self): super().__init__(); self.setPlaceholderText('{name}')"),
        "4": ("Table", "from PySide6.QtWidgets import QTableWidget\nclass {name}Table(QTableWidget):\n    def __init__(self): super().__init__(5, 3)"),
        "5": ("Dialog", "from PySide6.QtWidgets import QDialog\nclass {name}Dialog(QDialog):\n    def __init__(self): super().__init__()"),
        "6": ("Card", "from PySide6.QtWidgets import QFrame\nclass {name}Card(QFrame):\n    def __init__(self): super().__init__()"),
        "7": ("Controller", "# Controller para {name}\nclass {name}Controller:\n    def __init__(self, view, model):\n        self.view = view\n        self.model = model")
    },
    "react": {
        "1": ("Component", "class {name} extends React.Component {{ render() {{ return <div>{name}</div> }} }}"),
        "2": ("Navbar", "class {name}Nav extends React.Component {{ render() {{ return <nav className='p-4 bg-black text-white'>{name}</nav> }} }}"),
        "3": ("Button", "class {name}Btn extends React.Component {{ render() {{ return <button className='bg-blue-500 p-2'>{name}</button> }} }}"),
        "4": ("Form", "class {name}Form extends React.Component {{ render() {{ return <form className='p-4 border'><input placeholder='{name}'/></form> }} }}"),
        "5": ("Modal", "class {name}Modal extends React.Component {{ render() {{ return <div className='modal'>{name}</div> }} }}"),
        "6": ("Card", "class {name}Card extends React.Component {{ render() {{ return <div className='shadow-lg p-4'>{name}</div> }} }}"),
        "7": ("Model", "// Model para {name}\nexport const {name}Model = {{ id: null, name: '{name}' }};")
    }
}
