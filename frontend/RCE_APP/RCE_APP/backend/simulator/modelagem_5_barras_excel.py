import pandapower as pp
import pandapower.networks as pn

def create_simple_5_bus_network():
    """
    Cria e retorna uma rede elétrica simples de 5 barras no PandaPower.
    A rede consiste em:
    - 1 barra SWING (referência)
    - 2 barras PV (com geradores)
    - 2 barras PQ (com cargas)
    - Linhas de transmissão conectando as barras.
    """
    net = pp.create_empty_network()

    # 1. Criar Barras (Buses)
    # create_bus(net, name, vn_kv, type)
    # vn_kv: Tensão nominal em kV
    # type: 'b' (barra), 'n' (nó), 's' (subestação) - 'b' é o padrão para nós de rede
    b1 = pp.create_bus(net, name="Barra 1 (Swing)", vn_kv=110, type="b")
    b2 = pp.create_bus(net, name="Barra 2 (PV)", vn_kv=110, type="b")
    b3 = pp.create_bus(net, name="Barra 3 (PV)", vn_kv=110, type="b")
    b4 = pp.create_bus(net, name="Barra 4 (PQ)", vn_kv=110, type="b")
    b5 = pp.create_bus(net, name="Barra 5 (PQ)", vn_kv=110, type="b")

    # 2. Criar Geradores (Generators)
    # create_gen(net, bus, p_mw, vm_pu, name)
    # p_mw: Potência ativa gerada em MW
    # vm_pu: Tensão de referência em p.u. (para barras PV e Swing)
    # Uma barra SWING precisa de um gerador para definir a referência de ângulo e tensão
    pp.create_gen(net, b1, p_mw=0, vm_pu=1.02, name="Gerador Swing (B1)") # p_mw=0 para swing, ele ajusta
    pp.create_gen(net, b2, p_mw=50, vm_pu=1.01, name="Gerador 2 (B2)")
    pp.create_gen(net, b3, p_mw=70, vm_pu=1.00, name="Gerador 3 (B3)")

    # 3. Criar Cargas (Loads)
    # create_load(net, bus, p_mw, q_mvar, name)
    # p_mw: Potência ativa consumida em MW
    # q_mvar: Potência reativa consumida em Mvar
    pp.create_load(net, b4, p_mw=80, q_mvar=30, name="Carga 4 (B4)")
    pp.create_load(net, b5, p_mw=40, q_mvar=15, name="Carga 5 (B5)")

    # 4. Criar Linhas (Lines)
    # create_line(net, from_bus, to_bus, length_km, std_type, name)
    # std_type: Tipo de linha padrão (ex: '100-AL1/24-ST1A 110.0')
    # PandaPower tem tipos padrão que definem R, X, C da linha
    pp.create_line(net, b1, b2, length_km=20, std_type="100-AL1/24-ST1A 110.0", name="Linha 1-2")
    pp.create_line(net, b1, b3, length_km=25, std_type="100-AL1/24-ST1A 110.0", name="Linha 1-3")
    pp.create_line(net, b2, b4, length_km=30, std_type="100-AL1/24-ST1A 110.0", name="Linha 2-4")
    pp.create_line(net, b3, b5, length_km=35, std_type="100-AL1/24-ST1A 110.0", name="Linha 3-5")
    pp.create_line(net, b4, b5, length_km=15, std_type="100-AL1/24-ST1A 110.0", name="Linha 4-5")

    return net

if __name__ == "__main__":
    # Criar a rede
    my_network = create_simple_5_bus_network()

    # Rodar o fluxo de potência
    pp.runpp(my_network)

    # Imprimir resultados
    print("--- Resultados do Fluxo de Potência (Rede de 5 Barras) ---")
    print("\nResultados das Barras:")
    print(my_network.res_bus)
    print("\nResultados das Linhas:")
    print(my_network.res_line)
    print("\nResultados dos Geradores:")
    print(my_network.res_gen)

    # Você pode inspecionar a estrutura da rede
    print("\nEstrutura da Rede (Barras):")
    print(my_network.bus)
    print("\nEstrutura da Rede (Linhas):")
    print(my_network.line)
