import sys, os

def create_component(name):
    template = f"""
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com"></script>
    <script src="https://unpkg.com"></script>
    <script src="https://unpkg.com"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div id="root"></div>
    <script type="text/babel">
        class {name} extends React.Component {{
            render() {{
                return (
                    <div class="p-8 text-center">
                        <h1 class="text-3xl font-bold text-blue-600">Componente {name}</h1>
                        <button class="mt-4 px-4 py-2 bg-black text-white rounded">Clique Aqui</button>
                    </div>
                );
            }}
        }}
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<{name} />);
    </script>
</body>
</html>"""
    with open(f"{name}.html", "w") as f:
        f.write(template)
    print(f"✅ Componente {name}.html criado com sucesso!")

if __name__ == "__main__":
    # Uso no terminal: python rayquaza.py create JanelaPrincipal
    if sys.argv[1] == "create":
        create_component(sys.argv[2])
