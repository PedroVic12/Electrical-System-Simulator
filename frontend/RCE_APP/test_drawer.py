import reflex as rx

class TestDrawerState(rx.State):
    is_open: bool = False

    @rx.event
    def toggle_drawer(self):
        self.is_open = not self.is_open

def test_drawer():
    return rx.box(
        rx.drawer.root(
            rx.drawer.trigger(
                rx.button("Open Drawer", color_scheme="blue")
            ),
            rx.drawer.overlay(),
            rx.drawer.portal(
                rx.drawer.content(
                    rx.vstack(
                        rx.text("Test Drawer Content"),
                        rx.drawer.close(
                            rx.button("Close", color_scheme="red")
                        ),
                        spacing="4",
                    ),
                    height="100%",
                    width="300px",
                    padding="2em",
                )
            ),
            open=TestDrawerState.is_open,
            direction="left",
            modal=True,
        ),
        rx.button(
            "Toggle Drawer",
            on_click=TestDrawerState.toggle_drawer,
            color_scheme="green",
            margin_top="2em",
        ),
        padding="2em",
    )

app = rx.App()
app.add_page(test_drawer, title="Test Drawer", route="/test") 