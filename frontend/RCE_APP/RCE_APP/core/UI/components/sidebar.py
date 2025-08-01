import reflex as rx
from reflex.style import set_color_mode, color_mode
from ....backend.appState import AppState, DrawerState
from .theme_toggle import simple_theme_toggle


# Define pages as a list of tuples for easier management
# (icon, label, page_name)
PAGES = [
    ("⚡", "Framework RCE", "framework_rce"),
    ("📊", "Simulação IEEE", "simulacao_ieee"),
    ("🗓️", "Agendamento", "agendamento"),
]

# Define color schemes
COLOR_SCHEMES = [
    ("blue", "🔵 Azul"),
    ("green", "🟢 Verde"),
    ("purple", "🟣 Roxo"),
    ("orange", "🟠 Laranja"),
    ("red", "🔴 Vermelho"),
]


def sidebar_button(icon: str, text: str, page: str) -> rx.Component:
    """A helper function to create a styled sidebar button."""
    return rx.button(
        rx.hstack(
            rx.text(icon, margin_right="0.5em"), 
            rx.text(text), 
            align="center"
        ),
        on_click=lambda: AppState.set_page(page),
        width="100%",
        justify_content="start",
        variant="ghost",
        _hover={"background_color": "rgba(0, 0, 0, 0.1)"},
        margin_bottom="0.5em",
        class_name="btn-animate",
    )


def color_scheme_button(color: str, label: str) -> rx.Component:
    """Botão para selecionar paleta de cores"""
    return rx.button(
        rx.hstack(
            rx.text(label.split()[0]),  # Emoji
            rx.text(label.split()[1]),  # Nome
            align="center"
        ),
        on_click=lambda: AppState.set_color_scheme(color),
        width="100%",
        justify_content="start",
        variant="ghost",
        _hover={"background_color": "rgba(0, 0, 0, 0.1)"},
        margin_bottom="0.5em",
        class_name="btn-animate",
        color_scheme=color,
    )


def drawer_content():
    """Conteúdo do drawer nativo"""
    return rx.drawer.content(
        rx.vstack(
            # Header com botão de fechar
            rx.hstack(
                rx.text("🧭 Menu Dashboard", font_size="5", font_weight="bold"),
                rx.spacer(),
                rx.drawer.close(
                    rx.button(
                        "✕",
                        variant="ghost",
                        size="2",
                        _hover={"background_color": "rgba(255, 0, 0, 0.1)"},
                        class_name="btn-animate",
                    )
                ),
                width="100%",
                margin_bottom="4",
            ),
            rx.divider(),
            
            # Botões de navegação
            rx.vstack(
                rx.text("📄 Páginas", font_size="3", font_weight="bold", margin_bottom="2"),
                rx.foreach(PAGES, lambda page: sidebar_button(page[0], page[1], page[2])),
                spacing="2",
                width="100%",
                margin_bottom="4",
            ),
            
            # Controles de tema
            rx.vstack(
                rx.text("🎨 Personalização", font_size="3", font_weight="bold", margin_bottom="2"),
                
                # Toggle de tema usando sistema nativo
                rx.hstack(
                    rx.text("🌙", font_size="3"),
                    simple_theme_toggle(),
                    rx.text("☀️", font_size="3"),
                    width="100%",
                    justify_content="space-between",
                    margin_bottom="2",
                ),
                
                # Paletas de cores
                rx.text("Paleta de Cores:", font_size="2", margin_bottom="1"),
                rx.vstack(
                    rx.foreach(COLOR_SCHEMES, lambda scheme: color_scheme_button(scheme[0], scheme[1])),
                    spacing="1",
                    width="100%",
                ),
                
                spacing="2",
                width="100%",
                margin_bottom="4",
            ),
            
            rx.spacer(),
            
            # Footer
            rx.vstack(
                rx.text("UFF RCE", font_size="2", color="gray.500"),
                rx.text("v1.0.0", font_size="1", color="gray.400"),
                spacing="1",
                align="center",
            ),
            padding="6",
            width="100%",
            height="100%",
            align="start",
            spacing="4",
        ),
        height="100%",
        width="280px",
        padding="0",
    )


def sidebar():
    """Sidebar usando drawer nativo do Reflex"""
    return rx.drawer.root(
        # Trigger button (visível apenas em mobile/tablet)
        rx.drawer.trigger(
            rx.button(
                "☰",
                variant="ghost",
                size="4",
                display=["block", "block", "none"],  # Só mostra em telas pequenas
                margin_right="4",
                class_name="btn-animate",
            )
        ),
        # Overlay
        rx.drawer.overlay(),
        # Portal com conteúdo
        rx.drawer.portal(drawer_content()),
        # Configurações do drawer
        open=DrawerState.is_open,
        direction="left",
        modal=True,  # Modal para melhor UX
    )