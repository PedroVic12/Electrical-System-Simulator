import reflex as rx
from reflex.style import set_color_mode, color_mode


def dark_mode_toggle() -> rx.Component:
    """Toggle de tema usando o sistema nativo do Reflex"""
    return rx.segmented_control.root(
        rx.segmented_control.item(
            rx.icon(tag="monitor", size=20),
            value="system",
        ),
        rx.segmented_control.item(
            rx.icon(tag="sun", size=20),
            value="light",
        ),
        rx.segmented_control.item(
            rx.icon(tag="moon", size=20),
            value="dark",
        ),
        on_change=set_color_mode,
        variant="classic",
        radius="large",
        value=color_mode,
    )


def simple_theme_toggle() -> rx.Component:
    """Toggle simples de tema (light/dark)"""
    return rx.button(
        rx.cond(
            color_mode == "dark",
            rx.icon(tag="sun", size=20),
            rx.icon(tag="moon", size=20),
        ),
        on_click=set_color_mode,
        variant="ghost",
        size="3",
        margin_right="2",
        class_name="btn-animate",
    ) 