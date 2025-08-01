import reflex as rx
import pandapower as pp
import numpy as np
import random
from deap import base, creator, tools, algorithms
from ....backend.appState import AppState
from ....core.models.rede_eletrica import RedeEletricaPandaPower

class FrameworkRCEState(rx.State):
    """Controller de state específico para a página Framework RCE"""
    generations: int = 10
    population_size: int = 20
    mutation_prob: float = 0.2
    crossover_prob: float = 0.5
    best_result: str = ""
    is_running: bool = False
    progress: int = 0
    selected_case: str = "ieee_14"  # ieee_14, ieee_30, custom
    optimization_logs: list = []
    # Removido rede_eletrica do state pois não é serializável
    # Será criado quando necessário

    def set_generations(self, value: str):
        """Define o número de gerações"""
        try:
            self.generations = int(value)
        except ValueError:
            pass

    def set_population_size(self, value: str):
        """Define o tamanho da população"""
        try:
            self.population_size = int(value)
        except ValueError:
            pass

    def set_mutation_prob(self, value: str):
        """Define a probabilidade de mutação"""
        try:
            self.mutation_prob = float(value)
        except ValueError:
            pass

    def set_crossover_prob(self, value: str):
        """Define a probabilidade de crossover"""
        try:
            self.crossover_prob = float(value)
        except ValueError:
            pass

    def set_selected_case(self, case: str):
        """Define o caso de teste selecionado"""
        self.selected_case = case
        # A rede elétrica será criada quando necessário, não armazenada no state

    def create_ieee_14_bus(self):
        """Cria rede IEEE 14-bus usando RedeEletricaPandaPower"""
        # Criar rede elétrica quando necessário
        rede_eletrica = RedeEletricaPandaPower("14", debug=True)
        return rede_eletrica.net

    def create_ieee_30_bus(self):
        """Cria rede IEEE 30-bus usando RedeEletricaPandaPower"""
        # Criar rede elétrica quando necessário
        rede_eletrica = RedeEletricaPandaPower("30", debug=True)
        return rede_eletrica.net

    def run_optimization(self):
        """Executa a otimização usando RedeEletricaPandaPower"""
        self.is_running = True
        self.progress = 0
        self.optimization_logs = []
        self.best_result = "Iniciando otimização..."
        
        try:
            # Criar rede baseada no caso selecionado
            if self.selected_case == "ieee_14":
                rede_eletrica = RedeEletricaPandaPower("14", debug=True)
                net = rede_eletrica.net
                case_name = rede_eletrica.nome_rede
                
                # Executar fluxo de potência inicial
                if rede_eletrica.executar_fluxo_de_potencia():
                    self.optimization_logs.append("✅ Fluxo de potência executado com sucesso")
                else:
                    self.optimization_logs.append("❌ Falha no fluxo de potência")
                    return
                    
            elif self.selected_case == "ieee_30":
                rede_eletrica = RedeEletricaPandaPower("30", debug=True)
                net = rede_eletrica.net
                case_name = rede_eletrica.nome_rede
                
                # Executar fluxo de potência inicial
                if rede_eletrica.executar_fluxo_de_potencia():
                    self.optimization_logs.append("✅ Fluxo de potência executado com sucesso")
                else:
                    self.optimization_logs.append("❌ Falha no fluxo de potência")
                    return
            else:
                # Rede simples para exemplo
                net = pp.create_empty_network()
                bus1 = pp.create_bus(net, vn_kv=20.)
                bus2 = pp.create_bus(net, vn_kv=0.4)
                pp.create_ext_grid(net, bus1)
                pp.create_line(net, bus1, bus2, length_km=1.0,
                               std_type="NAYY 4x50 SE")
                pp.create_load(net, bus2, p_mw=0.1, q_mvar=0.05)
                case_name = "Rede Simples"

            self.optimization_logs.append(f"📊 Parâmetros: Gerações={self.generations}, População={self.population_size}")
            self.optimization_logs.append(f"🎲 Mutação={self.mutation_prob}, Crossover={self.crossover_prob}")

            creator.create("FitnessMin", base.Fitness, weights=(-1.0,))
            creator.create("Individual", list, fitness=creator.FitnessMin)

            toolbox = base.Toolbox()
            
            # Definir genes baseados no caso
            if self.selected_case in ["ieee_14", "ieee_30"]:
                # Otimizar cargas das barras de carga
                load_buses = [bus for bus in net.load.bus.values]
                toolbox.register("attr_float", random.uniform, 0.5, 2.0)  # Fator de carga
                toolbox.register("individual", tools.initRepeat,
                                 creator.Individual, toolbox.attr_float, n=len(load_buses))
            else:
                # Rede simples - otimizar apenas uma carga
                toolbox.register("attr_float", random.uniform, 0.05, 0.15)
                toolbox.register("individual", tools.initRepeat,
                                 creator.Individual, toolbox.attr_float, n=1)

            toolbox.register("population", tools.initRepeat, list, toolbox.individual)

            def eval_func(individual):
                try:
                    if self.selected_case in ["ieee_14", "ieee_30"]:
                        # Aplicar fatores de carga
                        for i, load_idx in enumerate(net.load.index):
                            factor = individual[i]
                            net.load.p_mw.at[load_idx] *= factor
                            net.load.q_mvar.at[load_idx] *= factor
                    else:
                        # Rede simples
                        load_p = individual[0]
                        net.load.p_mw.at[0] = load_p
                    
                    pp.runpp(net)
                    
                    # Calcular função objetivo (minimizar perdas + manter tensões)
                    losses = net.res_line.pl_mw.sum()
                    voltage_deviation = abs(net.res_bus.vm_pu - 1.0).sum()
                    
                    return (losses + voltage_deviation * 10,)
                    
                except Exception as e:
                    return (1000.0,)  # Penalidade alta para casos inválidos

            toolbox.register("evaluate", eval_func)
            toolbox.register("mate", tools.cxBlend, alpha=0.1)
            toolbox.register("mutate", tools.mutGaussian, mu=0, sigma=0.1, indpb=0.2)
            toolbox.register("select", tools.selTournament, tournsize=3)

            pop = toolbox.population(n=self.population_size)
            
            # Simulação do progresso com logs detalhados
            for gen in range(self.generations):
                self.optimization_logs.append(f"🔄 Geração {gen + 1}/{self.generations}")
                
                algorithms.eaSimple(pop, toolbox,
                                    cxpb=self.crossover_prob,
                                    mutpb=self.mutation_prob,
                                    ngen=1,
                                    verbose=False)
                
                # Avaliar melhor indivíduo da geração
                best_ind = tools.selBest(pop, 1)[0]
                fitness = best_ind.fitness.values[0]
                
                self.optimization_logs.append(f"  📈 Melhor fitness: {fitness:.4f}")
                
                self.progress = int((gen + 1) / self.generations * 100)

            # Resultado final
            best_ind = tools.selBest(pop, 1)[0]
            
            # Executar análise final com melhor solução
            if self.selected_case in ["ieee_14", "ieee_30"]:
                for i, load_idx in enumerate(net.load.index):
                    factor = best_ind[i]
                    net.load.p_mw.at[load_idx] *= factor
                    net.load.q_mvar.at[load_idx] *= factor
            else:
                load_p = best_ind[0]
                net.load.p_mw.at[0] = load_p
            
            pp.runpp(net)
            
            losses = net.res_line.pl_mw.sum()
            voltage_deviation = abs(net.res_bus.vm_pu - 1.0).sum()
            
            self.optimization_logs.append(f"✅ Otimização concluída!")
            self.optimization_logs.append(f"📊 Perdas totais: {losses:.4f} MW")
            self.optimization_logs.append(f"⚡ Desvio de tensão: {voltage_deviation:.4f} pu")
            
            if self.selected_case in ["ieee_14", "ieee_30"]:
                self.best_result = f"✅ Otimização {case_name} concluída!\n\n📊 Perdas: {losses:.4f} MW\n⚡ Desvio tensão: {voltage_deviation:.4f} pu\n🎯 Fitness: {best_ind.fitness.values[0]:.4f}"
            else:
                self.best_result = f"✅ Otimização concluída!\n\nMelhor carga: {best_ind[0]:.4f} MW\nTensão: {net.res_bus.vm_pu.at[1]:.4f} pu"
            
        except Exception as e:
            self.optimization_logs.append(f"❌ Erro na otimização: {str(e)}")
            self.best_result = f"❌ Erro na otimização: {str(e)}"
        
        finally:
            self.is_running = False
            self.progress = 100

def framework_rce():
    return rx.container(
        rx.vstack(
            # Header
            rx.hstack(
                rx.heading("Framework RCE ⚡", size="5"),
                rx.spacer(),
                rx.badge(
                    "Beta",
                    color_scheme=AppState.color_scheme,
                    variant="soft",
                ),
                width="100%",
                margin_bottom="8",
            ),
            
            # Seleção de caso de teste
            rx.card(
                rx.vstack(
                    rx.heading("📋 Caso de Teste", size="4", margin_bottom="4"),
                    rx.hstack(
                        rx.button(
                            "IEEE 14-Bus",
                            on_click=lambda: FrameworkRCEState.set_selected_case("ieee_14"),
                            color_scheme=rx.cond(
                                FrameworkRCEState.selected_case == "ieee_14",
                                AppState.color_scheme,
                                "gray"
                            ),
                            variant=rx.cond(
                                FrameworkRCEState.selected_case == "ieee_14",
                                "solid",
                                "outline"
                            ),
                        ),
                        rx.button(
                            "IEEE 30-Bus",
                            on_click=lambda: FrameworkRCEState.set_selected_case("ieee_30"),
                            color_scheme=rx.cond(
                                FrameworkRCEState.selected_case == "ieee_30",
                                AppState.color_scheme,
                                "gray"
                            ),
                            variant=rx.cond(
                                FrameworkRCEState.selected_case == "ieee_30",
                                "solid",
                                "outline"
                            ),
                        ),
                        rx.button(
                            "Rede Simples",
                            on_click=lambda: FrameworkRCEState.set_selected_case("custom"),
                            color_scheme=rx.cond(
                                FrameworkRCEState.selected_case == "custom",
                                AppState.color_scheme,
                                "gray"
                            ),
                            variant=rx.cond(
                                FrameworkRCEState.selected_case == "custom",
                                "solid",
                                "outline"
                            ),
                        ),
                        spacing="4",
                        width="100%",
                    ),
                    spacing="4",
                ),
                padding="6",
                class_name="card-hover",
                margin_bottom="8",
            ),
            
            # Cards de configuração
            rx.hstack(
                rx.vstack(
                    rx.heading("🔧 Configurações", size="4", margin_bottom="4"),
                    rx.card(
                        rx.vstack(
                            rx.text("Gerações:", font_weight="bold"),
                            rx.input(
                                placeholder="10",
                                value=FrameworkRCEState.generations,
                                on_change=FrameworkRCEState.set_generations,
                                type_="number",
                            ),
                            rx.text("Tamanho da população:", font_weight="bold"),
                            rx.input(
                                placeholder="20",
                                value=FrameworkRCEState.population_size,
                                on_change=FrameworkRCEState.set_population_size,
                                type_="number",
                            ),
                            spacing="4",
                        ),
                        padding="6",
                        class_name="card-hover",
                    ),
                    width="50%",
                ),
                rx.vstack(
                    rx.heading("🎯 Probabilidades", size="4", margin_bottom="4"),
                    rx.card(
                        rx.vstack(
                            rx.text("Probabilidade de mutação:", font_weight="bold"),
                            rx.input(
                                placeholder="0.2",
                                value=FrameworkRCEState.mutation_prob,
                                on_change=FrameworkRCEState.set_mutation_prob,
                                type_="number",
                                step="0.1",
                            ),
                            rx.text("Probabilidade de crossover:", font_weight="bold"),
                            rx.input(
                                placeholder="0.5",
                                value=FrameworkRCEState.crossover_prob,
                                on_change=FrameworkRCEState.set_crossover_prob,
                                type_="number",
                                step="0.1",
                            ),
                            spacing="4",
                        ),
                        padding="6",
                        class_name="card-hover",
                    ),
                    width="50%",
                ),
                width="100%",
                spacing="8",
                margin_bottom="8",
            ),
            
            # Botão de execução
            rx.card(
                rx.vstack(
                    rx.button(
                        rx.hstack(
                            rx.cond(
                                FrameworkRCEState.is_running,
                                rx.spinner(size="2"),
                                rx.text("▶️")
                            ),
                            rx.text(
                                rx.cond(
                                    FrameworkRCEState.is_running,
                                    "Executando...",
                                    "Rodar Otimização"
                                )
                            ),
                        ),
                        on_click=FrameworkRCEState.run_optimization,
                        is_disabled=FrameworkRCEState.is_running,
                        color_scheme=AppState.color_scheme,
                        size="4",
                        width="100%",
                        class_name="btn-animate",
                    ),
                    rx.cond(
                        FrameworkRCEState.is_running,
                        rx.progress(
                            value=FrameworkRCEState.progress,
                            width="100%",
                            color_scheme=AppState.color_scheme,
                            class_name="progress-animate",
                        ),
                        rx.box(),
                    ),
                    spacing="4",
                ),
                padding="6",
                margin_bottom="8",
                class_name="card-hover",
            ),
            
            # Logs da otimização
            rx.cond(
                FrameworkRCEState.optimization_logs,
                rx.card(
                    rx.vstack(
                        rx.heading("📝 Logs da Otimização", size="4"),
                        rx.vstack(
                            rx.foreach(
                                FrameworkRCEState.optimization_logs,
                                lambda log: rx.text(log, font_family="monospace", font_size="2")
                            ),
                            spacing="2",
                            max_height="200px",
                            overflow="auto",
                        ),
                        spacing="4",
                    ),
                    padding="6",
                    class_name="card-hover",
                ),
                rx.box(),
            ),
            
            # Resultados
            rx.cond(
                FrameworkRCEState.best_result != "",
                rx.card(
                    rx.vstack(
                        rx.heading("📊 Resultados", size="4"),
                        rx.text(
                            FrameworkRCEState.best_result,
                            white_space="pre-line",
                            font_family="monospace",
                        ),
                        spacing="4",
                    ),
                    padding="6",
                    class_name="card-hover",
                ),
                rx.box(),
            ),
            
            spacing="4",
            width="100%",
        ),
        width="100%",
        padding="8",
        max_width="1200px",
    )


