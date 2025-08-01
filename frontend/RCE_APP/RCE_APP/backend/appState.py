import reflex as rx
from reflex.style import set_color_mode, color_mode

class AppState(rx.State):
    page: str = "framework_rce"
    sidebar_open: bool = True  # Controla se a sidebar está aberta ou fechada
    color_scheme: str = "blue"  # Paleta de cores: "blue", "green", "purple", "orange", "red"

    def set_page(self, page_name: str):
        self.page = page_name

    def toggle_sidebar(self):
        """Alterna o estado da sidebar (abrir/fechar)"""
        self.sidebar_open = not self.sidebar_open

    def close_sidebar(self):
        """Fecha a sidebar"""
        self.sidebar_open = False

    def open_sidebar(self):
        """Abre a sidebar"""
        self.sidebar_open = True

    def set_color_scheme(self, scheme: str):
        """Define a paleta de cores"""
        self.color_scheme = scheme


class DrawerState(rx.State):
    """Estado específico para controlar o drawer nativo"""
    is_open: bool = False

    @rx.event
    def toggle_drawer(self):
        """Alterna o estado do drawer"""
        self.is_open = not self.is_open

    def close_drawer(self):
        """Fecha o drawer"""
        self.is_open = False
