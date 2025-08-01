import reflex as rx

config = rx.Config(
    app_name="RCE_APP",
    title="UFF RCE WebApp",
    description="Framework RCE para análise de sistemas elétricos",
    plugins=[
        rx.plugins.SitemapPlugin(),
        rx.plugins.TailwindV4Plugin(),
    ],
    # Incluir CSS personalizado
    stylesheets=[
        "/custom.css",
    ],
    # Configurações adicionais
    frontend_packages=[
        "react-icons",
    ],
)