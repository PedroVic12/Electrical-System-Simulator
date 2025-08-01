import reflex as rx
from reflex.style import color_mode
from .core.UI.pages.framework_rce import framework_rce
from .core.UI.components.sidebar import sidebar
from .core.UI.components.theme_toggle import simple_theme_toggle
from .backend.appState import AppState, DrawerState


def index():
    return rx.box(
        # Sidebar com drawer nativo
        sidebar(),
        
        # Conteúdo principal
        rx.box(
            # Header com botão de menu e controles
            rx.hstack(
                # Botão de menu para mobile/tablet (drawer trigger)
                rx.button(
                    "☰",
                    on_click=DrawerState.toggle_drawer,
                    variant="ghost",
                    size="4",
                    display=["block", "block", "none"],  # Só mostra em telas pequenas
                    margin_right="4",
                ),
                rx.heading("UFF RCE WebApp", size="5"),
                rx.spacer(),
                
                # Controles de tema no header
                rx.hstack(
                    simple_theme_toggle(),
                    rx.badge(
                        "Online",
                        color_scheme=AppState.color_scheme,
                        variant="soft",
                    ),
                    spacing="2",
                ),
                width="100%",
                padding="4 8",
                border_bottom="1px solid",
                border_color="gray.200",
                background_color="white",
                position="sticky",
                top="0",
                z_index="100",
            ),
            
            # Conteúdo da página
            rx.box(
                rx.cond(
                    AppState.page == "framework_rce",
                    framework_rce(),
                    rx.container(
                        rx.vstack(
                            rx.heading("404 - Página não encontrada", size="5"),
                            rx.text("A página solicitada não existe."),
                            rx.button(
                                "Voltar ao início",
                                on_click=lambda: AppState.set_page("framework_rce"),
                                color_scheme=AppState.color_scheme,
                            ),
                            align="center",
                            spacing="8",
                        ),
                        padding="8",
                    ),
                ),
                padding="8",
                min_height="calc(100vh - 80px)",  # Altura total menos o header
                background_color="gray.50",
            ),
            
            # Estilos responsivos - agora sem margin_left fixo pois o drawer é nativo
            width="100%",
        ),
        
        # Estilos gerais
        width="100%",
        min_height="100vh",
        background_color="gray.50",
    )


app = rx.App()
app.add_page(index, title="UFF RCE WebApp", route="/")
#app.compile()
