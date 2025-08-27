import sys
import traceback
from pathlib import Path
import pandas as pd
import pandapower as pp
import pandapower.networks as pn
import pandapower.plotting as plot
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QComboBox, QListWidget, QListWidgetItem, QPushButton,
    QTabWidget, QTableWidget, QTableWidgetItem, QHeaderView,
    QGroupBox, QSplitter, QTextEdit, QMessageBox, QFrame, QStackedLayout,
    QFileDialog, QDialog, QDialogButtonBox, QCheckBox
)
from PySide6.QtCore import Qt, Signal, QTimer
from PySide6.QtGui import QFont, QColor

from styles import AppStyles



# Desativa o modo interativo do Matplotlib para evitar pop-ups
plt.ioff()

# NOTE: QWebEngineView is required for Plotly charts. 
# You may need to install it separately:
# pip install PySide6-WebEngine
try:
    from PySide6.QtWebEngineWidgets import QWebEngineView
    import plotly.graph_objects as go
    import plotly.io as pio
    PLOTLY_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False

# =========================== MODEL ===========================
class PowerSystemModel:
    """
    Model - Encapsulates the logic for power system analysis using Pandapower.
    Handles loading, simulating, and modifying the electrical network.
    """
    
    def __init__(self, network_name="case14"):
        """Initializes the model with a default network."""
        self.network_name = network_name
        self.net = self.load_network(network_name)

    def load_network(self, network_name):
        """Loads a standard test network from the pandapower library."""
        self.network_name = network_name
        try:
            if network_name == "case14":
                self.net = pn.case14()
            elif network_name == "case30":
                self.net = pn.case_ieee30()
            elif network_name == "case57":
                self.net = pn.case57()
            elif network_name == "case118":
                self.net = pn.case118()
            elif network_name == "New Network":
                self.net = pp.create_empty_network(name="New Network")
            else:
                self.net = pn.case14()
            
            if self.net and ('coords' not in self.net.bus_geodata.columns or self.net.bus_geodata.empty):
                 plot.create_generic_coordinates(self.net)

            if self.net:
                self.net.name = network_name
            return self.net
        except Exception:
            return pp.create_empty_network()

    def reset_network_state(self):
        """Resets the network to its original state."""
        if self.net:
            if not self.net.line.empty:
                self.net.line['in_service'] = True
            if not self.net.trafo.empty and 'in_service' in self.net.trafo:
                self.net.trafo['in_service'] = True

    def run_power_flow(self):
        """Executes the power flow calculation."""
        try:
            # Ensure network is valid before running
            if self.net is None:
                return False, "Rede não carregada."
                
            # Reset results if they exist
            if hasattr(self.net, 'res_bus'):
                delattr(self.net, 'res_bus')
                


            print("Calculos de avalia cenarios")

            print("Calculo violações de contigencias")

            print("")    
            # Run power flow with detailed error handling
            pp.runpp(
                self.net, 
                algorithm='nr',
                numba=False,
                numba_tolerance=1e-6,
                max_iteration=250,
                init='dc',
                enforce_q_lims=True,
                tolerance_mva=1e-8,
                trafo_model='t',
                trafo_loading='current',
                calculate_voltage_angles=True
            )
            print("Executando FLUXO DE POTENCIA!")
            # Check if results exist
            if not hasattr(self.net, 'res_bus') or self.net.res_bus.empty:
                return False, "Cálculo concluído, mas sem resultados."
                
            return True, "Fluxo de potência CONVERGENTE!"
            
        except pp.LoadflowNotConverged as e:
            return False, f"Fluxo de Potência NÃO CONVERGENTE: {str(e)}"
        except Exception as e:
            traceback.print_exc()
            return False, f"Erro no fluxo de potência: {str(e)}"

    def apply_contingencies(self, contingencies):
        """Applies a list of contingencies to the network."""
        self.reset_network_state()
        for c_type, c_id in contingencies:
            if c_type == 'line' and c_id in self.net.line.index:
                self.net.line.loc[c_id, 'in_service'] = False
            elif c_type == 'trafo' and c_id in self.net.trafo.index:
                self.net.trafo.loc[c_id, 'in_service'] = False

class ResultsRepository:
    """Repository for fetching and formatting simulation results."""
    
    def __init__(self, net):
        if net is None or not hasattr(net, 'res_bus') or net.res_bus.empty:
            raise ValueError("A rede não foi simulada ou não contém resultados.")
        self.net = net

    def get_kpis(self):
        """Calculates and returns key performance indicators (KPIs)."""
        over_mask = (self.net.res_bus.vm_pu > self.net.bus.max_vm_pu)
        under_mask = (self.net.res_bus.vm_pu < self.net.bus.min_vm_pu)
        voltage_violations = (over_mask | under_mask).sum()
        line_overloads = (self.net.res_line.loading_percent > 100).sum()
        trafo_overloads = 0
        if hasattr(self.net, 'res_trafo') and not self.net.res_trafo.empty:
            trafo_overloads = (self.net.res_trafo.loading_percent > 100).sum()

        # Build overvoltage bus list with names and values
        over_buses = []
        try:
            bus_names = self.net.bus.name if 'name' in self.net.bus.columns else self.net.bus.index.astype(str)
        except Exception:
            bus_names = self.net.bus.index.astype(str)
        for idx in self.net.bus.index[over_mask]:
            name = str(bus_names.loc[idx]) if idx in bus_names.index else str(idx)
            vm = float(self.net.res_bus.vm_pu.loc[idx])
            over_buses.append(f"{name} ({vm:.3f} pu)")

        return {
            "total_load_mw": self.net.res_load.p_mw.sum(),
            "total_gen_mw": self.net.res_gen.p_mw.sum() + abs(self.net.res_bus.p_mw[self.net.ext_grid.bus[0]]),
            "voltage_violations": int(voltage_violations),
            "overloads": int(line_overloads + trafo_overloads),
            "overvoltage_count": int(over_mask.sum()),
            "overvoltage_buses": over_buses,
        }

    def get_bus_voltage_data(self):
        df = self.net.res_bus[['vm_pu']].copy().round(4)
        return df.reset_index().rename(columns={'index': 'Barra', 'vm_pu': 'Tensão (p.u.)'})

    def get_line_loading_data(self):
        df = self.net.res_line[['loading_percent']].copy().round(2)
        return df.reset_index().rename(columns={'index': 'Linha', 'loading_percent': 'Carregamento (%)'})

    def get_trafo_loading_data(self):
        if not hasattr(self.net, 'res_trafo') or self.net.res_trafo.empty:
            return pd.DataFrame(columns=['Transformador', 'Carregamento (%)'])
        df = self.net.res_trafo[['loading_percent']].copy().round(2)
        return df.reset_index().rename(columns={'index': 'Transformador', 'loading_percent': 'Carregamento (%)'})

    def get_line_power_flow_data(self):
        """Returns active and reactive power flow for lines."""
        df = self.net.res_line[['p_from_mw', 'q_from_mvar']].copy().round(3)
        return df.reset_index().rename(columns={'index': 'Linha', 'p_from_mw': 'Potência Ativa (MW)', 'q_from_mvar': 'Potência Reativa (MVAr)'})

# =========================== VIEW ===========================
class NetworkCanvas(FigureCanvas):
    """Matplotlib canvas for plotting the power grid."""
    
    def __init__(self, parent=None, width=8, height=8, dpi=100):
        self.fig = Figure(figsize=(width, height), dpi=dpi, tight_layout=True)
        super().__init__(self.fig)
        self.ax = self.fig.add_subplot(111)
        self.current_theme = 'dark'
        self.net = None

    def plot_network(self, net):
        """Plots the network, highlighting out-of-service elements and adding a legend."""
        self.net = net
        self.ax.clear()
        self.fig.set_facecolor("#f0f2f6")
        self.ax.set_facecolor("#f0f2f6")
        title_color, legend_text_color = '#333', '#333'

        try:
            if not net or net.bus.empty:
                self.ax.text(0.5, 0.5, "Nenhuma rede carregada ou rede vazia.", ha='center', va='center', color=title_color)
                self.draw()
                return

            title = f"Diagrama da Rede: {net.name.upper()}"

            # --- Determine Bus Colors ---
            gen_buses = set(net.gen.bus) if not net.gen.empty else set()
            load_buses = set(net.load.bus) if not net.load.empty else set()

            bus_colors = []
            for bus_idx in net.bus.index:
                is_gen = bus_idx in gen_buses
                is_load = bus_idx in load_buses
                if is_gen and is_load: bus_colors.append("purple")
                elif is_gen: bus_colors.append("green")
                elif is_load: bus_colors.append("orange")
                else: bus_colors.append("blue")

            # --- Create Collections ---
            bc = plot.create_bus_collection(net, buses=net.bus.index, size=0.05, color=bus_colors, zorder=10)
            self.ax.add_collection(bc)

            if hasattr(net, 'bus_geodata') and not net.bus_geodata.empty:
                for i, bus in net.bus_geodata.iterrows():
                    self.ax.text(bus.x, bus.y + 0.02, str(i), fontsize=8, weight='bold', ha='center', va='bottom', color='navy', zorder=11)

            # --- Prepare Legend Handles ---
            bus_handles = [
                Line2D([0], [0], marker='o', color='w', label='Barra (Transfer)', markerfacecolor='blue', markersize=8),
                Line2D([0], [0], marker='o', color='w', label='Barra (Geração)', markerfacecolor='green', markersize=8),
                Line2D([0], [0], marker='o', color='w', label='Barra (Carga)', markerfacecolor='orange', markersize=8),
                Line2D([0], [0], marker='o', color='w', label='Barra (Geração/Carga)', markerfacecolor='purple', markersize=8)
            ]
            line_handles = []

            if not net.line.empty:
                line_vns = net.bus.loc[net.line.from_bus, 'vn_kv'].values
                vn_kv_unique = sorted(pd.unique(line_vns))
                cmap = plt.get_cmap('viridis', len(vn_kv_unique) + 1)
                colors = {v: cmap(i) for i, v in enumerate(vn_kv_unique)}

                for v_kv, color in colors.items():
                    lines_at_v = net.line.index[line_vns == v_kv]
                    in_service_lines = net.line.index[net.line.in_service & (net.line.index.isin(lines_at_v))]
                    if not in_service_lines.empty:
                        lc = plot.create_line_collection(net, lines=in_service_lines, color=color, use_bus_geodata=True, linewidths=1.5)
                        self.ax.add_collection(lc)
                    line_handles.append(Line2D([0], [0], color=color, lw=2, label=f'{v_kv:.1f} kV'))

                oos_lines = net.line.index[~net.line.in_service]
                if not oos_lines.empty:
                    lc_oos = plot.create_line_collection(net, lines=oos_lines, color="r", linestyle="--", linewidths=1.5)
                    self.ax.add_collection(lc_oos)
                    if not any(h.get_label() == 'Fora de Serviço' for h in line_handles):
                         line_handles.append(Line2D([0], [0], color='r', linestyle='--', lw=2, label='Fora de Serviço'))

            if not net.trafo.empty:
                in_service_trafos = net.trafo.index[net.trafo.in_service]
                oos_trafos = net.trafo.index[~net.trafo.in_service]
                if not in_service_trafos.empty:
                    tc = plot.create_trafo_collection(net, trafos=in_service_trafos, color='k', zorder=5)
                    for collection in tc if isinstance(tc, (list, tuple)) else [tc]:
                        if collection: self.ax.add_collection(collection)
                if not oos_trafos.empty:
                    tc_oos = plot.create_trafo_collection(net, trafos=oos_trafos, color='r', linestyle="--", zorder=5)
                    for collection in tc_oos if isinstance(tc_oos, (list, tuple)) else [tc_oos]:
                        if collection: self.ax.add_collection(collection)
                    if not any(h.get_label() == 'Fora de Serviço' for h in line_handles):
                        line_handles.append(Line2D([0], [0], color='r', linestyle='--', lw=2, label='Fora de Serviço'))

            self.ax.set_title(title, fontsize=14, weight='bold', color=title_color)
            
            # --- Create  Legend ---
            legend_elements = []
            if bus_handles:
                legend_elements.append(Line2D([0], [0], marker='None', color='None', label='Info Barras'))
                legend_elements.extend(bus_handles)
            
            if line_handles:
                if legend_elements: # Add a spacer
                    legend_elements.append(Line2D([0], [0], marker='None', color='None', label=''))
                legend_elements.append(Line2D([0], [0], marker='None', color='None', label='Info Linhas'))
                legend_elements.extend(line_handles)

            if legend_elements:
                legend = self.ax.legend(handles=legend_elements, title="Legenda", labelcolor=legend_text_color)
                legend.get_frame().set_facecolor('#ffffff')
                legend.get_frame().set_edgecolor('#cccccc')
                # Make titles bold
                for text in legend.get_texts():
                    if text.get_text() in ['Info Barras', 'Info Linhas']:
                        text.set_fontweight('bold')
            
            self.ax.autoscale_view()
            self.ax.set_xticks([])
            self.ax.set_yticks([])
            self.ax.set_aspect('auto')

        except Exception as e:
            print("--- ERRO AO PLOTAR A REDE ---")
            traceback.print_exc()
            print("-----------------------------")
            self.ax.text(0.5, 0.5, f"Erro ao plotar a rede:\n{e}", ha='center', va='center', color=title_color)
        
        self.draw()
        plt.close('all')

    def update_theme_colors(self, theme):
        self.current_theme = theme
        self.plot_network(self.net)

class MetricsWidget(QWidget):
    """Widget to display KPIs in styled cards."""
    
    def __init__(self):
        super().__init__()
        # Theme-aware, easily editable color map
        self.theme = 'dark'
        self.colors = {
            'light': {
                'card_bg': '#ffffff', 'card_border': '#ddd', 'card_text': '#555', 'value_default': '#000',
                'gen_value': '#2e7d32',   # green
                'load_value': '#b08900',  # amber/dark yellow
                'alert_bg': '#ffebee', 'alert_border': '#c62828', 'alert_value': '#c62828'
            },
            'dark': {
                'card_bg': '#343a40', 'card_border': '#495057', 'card_text': '#f8f9fa', 'value_default': '#f8f9fa',
                'gen_value': '#66bb6a',   # green
                'load_value': '#ffca28',  # yellow
                'alert_bg': '#4a1f1f', 'alert_border': '#ef5350', 'alert_value': '#ef5350'
            }
        }
        self.last_kpis = {}
        self.setup_ui()

    def setup_ui(self):
        layout = QHBoxLayout(self)
        layout.setSpacing(15)
        layout.setContentsMargins(0,0,0,0)
        self.metric_cards = {}
        titles = {
            "load": "Carga Total Sistema Elétrico (MW)",
            "gen": "Geração Total (MW)",
            "voltage": "Violações de Tensão",
            "overload": "Sobrecargas (Geradores)",
            "overvoltage": "Sobretensões (Barras)",
        }
        for key, title in titles.items():
            card = self._create_metric_card(title, "0.00")
            layout.addWidget(card)
            self.metric_cards[key] = card
        # Apply initial theme styles
        self._apply_theme_styles()

    def _create_metric_card(self, title, value):
        card = QGroupBox(title)
        layout = QVBoxLayout(card)
        value_label = QLabel(value)
        value_label.setObjectName("value_label")
        layout.addWidget(value_label)
        layout.addStretch()
        return card

    def update_metrics(self, kpis):
        # keep last values for reapplying styles on theme change
        self.last_kpis = dict(kpis)
        values = {
            "load": f"{kpis['total_load_mw']:.2f}",
            "gen": f"{kpis['total_gen_mw']:.2f}",
            "voltage": f"{kpis['voltage_violations']}",
            "overload": f"{kpis['overloads']}",
            "overvoltage": str(kpis.get('overvoltage_count', 0)),
        }
        for key, value in values.items():
            value_label = self.metric_cards[key].findChild(QLabel, "value_label")
            if value_label: value_label.setText(str(value))
        # Set tooltip listing overvoltage buses
        ov_card = self.metric_cards.get('overvoltage')
        if ov_card is not None:
            buses = kpis.get('overvoltage_buses', [])
            tooltip = "\n".join(buses) if buses else "Sem sobretensões"
            ov_card.setToolTip(tooltip)
        # Apply color logic after updating values
        self._apply_theme_styles()

    def update_theme_colors(self, theme):
        self.theme = 'light' if theme == 'light' else 'dark'
        self._apply_theme_styles()

    # ===== Styling helpers (editable) =====
    def _apply_theme_styles(self):
        c = self.colors[self.theme]
        # Base style for all cards
        base_card_css = (
            "QGroupBox { "
            f"background-color: {c['card_bg']}; border: 1px solid {c['card_border']}; border-radius: 8px; margin-top: 10px; "
            "font-size: 11px; font-weight: bold; "
            f"color: {c['card_text']}; "
            "} QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top left; padding: 0 5px; left: 10px; }"
        )

        for key, card in self.metric_cards.items():
            # Determine alert state
            alert = False
            if self.last_kpis:
                if key == 'overload':
                    alert = int(self.last_kpis.get('overloads', 0)) > 0
                elif key == 'overvoltage':
                    alert = int(self.last_kpis.get('overvoltage_count', 0)) > 0

            if alert:
                card_css = (
                    "QGroupBox { "
                    f"background-color: {c['alert_bg']}; border: 1px solid {c['alert_border']}; border-radius: 8px; margin-top: 10px; "
                    "font-size: 11px; font-weight: bold; "
                    f"color: {c['alert_value']}; "
                    "} QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top left; padding: 0 5px; left: 10px; }"
                )
                card.setStyleSheet(card_css)
            else:
                card.setStyleSheet(base_card_css)

            # Value label colors (gen = green, load = yellow)
            value_label = card.findChild(QLabel, "value_label")
            if value_label:
                color = c['value_default']
                if key == 'gen':
                    color = c['gen_value']
                elif key == 'load':
                    color = c['load_value']
                if alert and key in ('overload', 'overvoltage'):
                    color = c['alert_value']
                value_label.setStyleSheet(f"font-size: 24px; color: {color}; font-weight: bold; padding-top: 5px;")

class ChartsManager:
    """Manages all chart-related functionality for the application."""
    
    def __init__(self, view):
        """Initialize the ChartsManager with references to view components."""
        self.view = view
        self.theme = 'dark'
        
    def set_theme(self, theme):
        """Set the current theme for all charts."""
        self.theme = theme
        if hasattr(self.view, 'voltage_plot'):
            self.view.voltage_plot.update_theme(theme)
        if hasattr(self.view, 'line_loading_plot'):
            self.view.line_loading_plot.update_theme(theme)
        if hasattr(self.view, 'trafo_loading_plot'):
            self.view.trafo_loading_plot.update_theme(theme)
        if hasattr(self.view, 'line_p_flow_plot'):
            self.view.line_p_flow_plot.update_theme(theme)
        if hasattr(self.view, 'line_q_flow_plot'):
            self.view.line_q_flow_plot.update_theme(theme)
    
    def update_all_charts(self, net):
        """Update all charts based on the current network state."""
        if not hasattr(net, 'res_bus') or net.res_bus.empty:
            return
            
        repo = ResultsRepository(net)
        
        # Update voltage chart
        self.update_voltage_chart(repo.get_bus_voltage_data())
        
        # Update line loading chart
        self.update_line_loading_chart(repo.get_line_loading_data())
        
        # Update transformer loading chart
        self.update_trafo_loading_chart(repo.get_trafo_loading_data())
        
        # Update power flow charts
        power_flow_df = repo.get_line_power_flow_data()
        self.update_power_flow_charts(power_flow_df)
    
    def update_voltage_chart(self, voltage_df):
        """Update the voltage profile chart."""
        if not PLOTLY_AVAILABLE or voltage_df.empty:
            return
            
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=voltage_df['Barra'],
            y=voltage_df['Tensão (p.u.)'],
            name='Tensão',
            marker_color='#1f77b4'
        ))
        
        # Add voltage limits
        fig.add_hline(y=1.05, line_dash="dash", line_color="red")
        fig.add_hline(y=0.95, line_dash="dash", line_color="red")
        
        # Apply theme and layout
        self._apply_chart_theme(fig, 'Perfil de Tensão nas Barras', 'Barra', 'Tensão (p.u.)')
        fig.update_yaxes(range=[0.9, 1.1])
        
        # Update the view
        self.view.voltage_plot.plot_chart(fig)
    
    def update_line_loading_chart(self, line_df):
        """Update the line loading chart."""
        if not PLOTLY_AVAILABLE or line_df.empty:
            if hasattr(self.view, 'line_loading_plot'):
                self.view.line_loading_plot.clear()
            return
            
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=line_df['Linha'],
            y=line_df['Carregamento (%)'],
            name='Carregamento',
            marker_color='#ff7f0e'
        ))
        
        # Add 100% limit line
        fig.add_hline(y=100, line_dash="dash", line_color="red")
        
        # Apply theme and layout
        self._apply_chart_theme(fig, 'Carregamento das Linhas', 'Linha', 'Carregamento (%)')
        
        # Set y-axis range with some padding
        y_max = max(110, line_df['Carregamento (%)'].max() * 1.1)
        fig.update_yaxes(range=[0, y_max])
        
        # Update the view
        self.view.line_loading_plot.plot_chart(fig)
    
    def update_trafo_loading_chart(self, trafo_df):
        """Update the transformer loading chart."""
        if not PLOTLY_AVAILABLE or trafo_df.empty:
            if hasattr(self.view, 'trafo_loading_plot'):
                self.view.trafo_loading_plot.clear()
            return
            
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=trafo_df['Transformador'],
            y=trafo_df['Carregamento (%)'],
            name='Carregamento',
            marker_color='#2ca02c'
        ))
        
        # Add 100% limit line
        fig.add_hline(y=100, line_dash="dash", line_color="red")
        
        # Apply theme and layout
        self._apply_chart_theme(fig, 'Carregamento dos Transformadores', 'Transformador', 'Carregamento (%)')
        
        # Set y-axis range with some padding
        y_max = max(110, trafo_df['Carregamento (%)'].max() * 1.1) if not trafo_df.empty else 110
        fig.update_yaxes(range=[0, y_max])
        
        # Update the view
        self.view.trafo_loading_plot.plot_chart(fig)
    
    def update_power_flow_charts(self, power_flow_df):
        """Update both active and reactive power flow charts."""
        if not PLOTLY_AVAILABLE or power_flow_df.empty:
            if hasattr(self.view, 'line_p_flow_plot'):
                self.view.line_p_flow_plot.clear()
            if hasattr(self.view, 'line_q_flow_plot'):
                self.view.line_q_flow_plot.clear()
            return
        
        # Active power flow
        fig_p = go.Figure()
        fig_p.add_trace(go.Bar(
            x=power_flow_df['Linha'],
            y=power_flow_df['Potência Ativa (MW)'],
            name='P (MW)',
            marker_color='#d62728'
        ))
        self._apply_chart_theme(fig_p, 'Fluxo de Potência Ativa', 'Linha', 'Potência Ativa (MW)')
        
        # Reactive power flow
        fig_q = go.Figure()
        fig_q.add_trace(go.Bar(
            x=power_flow_df['Linha'],
            y=power_flow_df['Potência Reativa (MVAr)'],
            name='Q (MVAr)',
            marker_color='#9467bd'
        ))
        self._apply_chart_theme(fig_q, 'Fluxo de Potência Reativa', 'Linha', 'Potência Reativa (MVAr)')
        
        # Update the views
        self.view.line_p_flow_plot.plot_chart(fig_p)
        self.view.line_q_flow_plot.plot_chart(fig_q)
    
    def _apply_chart_theme(self, fig, title, xaxis_title, yaxis_title):
        """Apply consistent theme and layout to a chart."""
        if self.theme == 'dark':
            fig.update_layout(
                title=title,
                xaxis_title=xaxis_title,
                yaxis_title=yaxis_title,
                paper_bgcolor='#343a40',
                plot_bgcolor='#343a40',
                font=dict(color='#f8f9fa'),
                title_font_color='#f8f9fa',
                xaxis=dict(
                    gridcolor='#495057',
                    zerolinecolor='#495057',
                    linecolor='#6c757d',
                    showgrid=False
                ),
                yaxis=dict(
                    gridcolor='#495057',
                    zerolinecolor='#495057',
                    linecolor='#6c757d',
                    showgrid=True
                )
            )
        else:
            fig.update_layout(
                title=title,
                xaxis_title=xaxis_title,
                yaxis_title=yaxis_title,
                paper_bgcolor='#f0f2f6',
                plot_bgcolor='#f0f2f6',
                font=dict(color='#333'),
                title_font_color='#333',
                xaxis=dict(
                    gridcolor='#d0d0d0',
                    zerolinecolor='#d0d0d0',
                    linecolor='#adb5bd',
                    showgrid=False
                ),
                yaxis=dict(
                    gridcolor='#d0d0d0',
                    zerolinecolor='#d0d0d0',
                    linecolor='#adb5bd',
                    showgrid=True
                )
            )

    def _create_loading_figure(self, df, title, y_title, color):
        """Create a loading figure with consistent styling and threshold indicators."""
        fig = go.Figure()
        
        # Add bars below threshold
        below_threshold = df[df <= 100]
        if not below_threshold.empty:
            fig.add_trace(go.Bar(
                x=below_threshold.index,
                y=below_threshold.values,
                marker_color=color,
                name='Normal',
                hovertemplate='%{x}<br>%{y:.2f}%<extra></extra>'
            ))
            
        # Add bars above threshold in red
        above_threshold = df[df > 100]
        if not above_threshold.empty:
            fig.add_trace(go.Bar(
                x=above_threshold.index,
                y=above_threshold.values,
                marker_color='red',
                name='Sobrecarregado',
                hovertemplate='%{x}<br>%{y:.2f}% (acima do limite)<extra></extra>'
            ))
        
        # Add threshold line at 100%
        fig.add_hline(
            y=100,
            line=dict(color='red', width=2, dash='dash'),
            annotation_text='Limite',
            annotation_position='top right',
            annotation_font_color='red'
        )
        
        fig.update_layout(
            title=title,
            yaxis_title=y_title + ' (%)',
            xaxis_title='Elemento',
            showlegend=False,
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#333' if self.theme == 'light' else '#fff'),
            margin=dict(l=50, r=50, t=50, b=50),
            xaxis=dict(showgrid=False),
            yaxis=dict(showgrid=True, gridcolor='#e0e0e0' if self.theme == 'light' else '#444')
        )
        
        return fig

class PlotlyWidget(QWebEngineView if PLOTLY_AVAILABLE else QTextEdit):
    """Widget to display Plotly charts."""
    def __init__(self):
        super().__init__()
        self.current_theme = 'dark'  # Default theme
        if not PLOTLY_AVAILABLE:
            self.setReadOnly(True)
            self.setText("Plotly não disponível. Instale 'PySide6-WebEngine'.")
        else:
            self.setHtml(self._get_html_template())

    def _get_html_template(self):
        bg_color = "#f0f2f6" if self.current_theme == 'light' else "#343a40"
        return f"<html><body style='background-color:{bg_color};'></body></html>"

    def plot_chart(self, fig):
        if PLOTLY_AVAILABLE:
            self.setHtml(pio.to_html(fig, full_html=False, include_plotlyjs='cdn'))

    def clear(self):
        if PLOTLY_AVAILABLE: 
            self.setHtml(self._get_html_template())

    def update_theme(self, theme):
        """Update the widget's theme."""
        self.current_theme = theme
        self.setHtml(self._get_html_template())

class SidebarWidget(QWidget):
    """Sidebar widget with all simulation controls."""
    
    network_changed = Signal(str)
    contingencies_changed = Signal(list)
    run_simulation_requested = Signal()
    theme_toggle_requested = Signal()
    
    def __init__(self):
        super().__init__()
        self.current_theme = 'dark'
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(15)
        
        title = QLabel("Parâmetros da Simulação")
        title.setObjectName("SidebarTitle")
        layout.addWidget(title)
        
        network_group = QGroupBox("Seleção da Rede Elétrica")
        network_layout = QVBoxLayout(network_group)
        self.network_combo = QComboBox()
        self.network_combo.addItems(["case14", "case30", "case57", "case118", "New Network"])
        network_layout.addWidget(self.network_combo)
        layout.addWidget(network_group)
        
        self.contingency_group = QGroupBox("Análise de Contingência (N-k)")
        contingency_layout = QVBoxLayout(self.contingency_group)
        self.element_list = QListWidget()
        self.element_list.setSelectionMode(QListWidget.NoSelection)
        contingency_layout.addWidget(self.element_list)
        layout.addWidget(self.contingency_group)

        self.run_button = QPushButton("Executar Fluxo de Potência")
        self.run_button.setStyleSheet("QPushButton { background-color: #28a745; color: white; padding: 8px; border-radius: 5px; font-weight: bold; } QPushButton:disabled { background-color: #9E9E9E; }")
        layout.addWidget(self.run_button)

        self.theme_toggle_button = QPushButton("Alternar Tema")

        

        self.theme_toggle_button.setObjectName("ThemeToggle")
        layout.addWidget(self.theme_toggle_button)

        # componente de texto (logs longos)
        self.text_output = QTextEdit()
        self.text_output.setObjectName("LogOutput")
        self.text_output.setReadOnly(True)
        self.text_output.setPlaceholderText("Melhorias para o projeto: 1) uso de nomes de linhas no diagrama de rede \n2) Uso de numero ID de cada barra no diagrama 3) limite no loading percent de linhas e trafos crretos em 100% = 1")
        # Quebra de linha automática pela largura do widget
        self.text_output.setLineWrapMode(QTextEdit.WidgetWidth)
        # Altura mínima para comportar múltiplas linhas
        self.text_output.setMinimumHeight(140)
        layout.addWidget(self.text_output)
        
        layout.addStretch()
        
        self.network_combo.currentTextChanged.connect(self.network_changed.emit)
        self.element_list.itemClicked.connect(self._on_item_clicked)
        self.run_button.clicked.connect(self.run_simulation_requested.emit)
        self.theme_toggle_button.clicked.connect(self.theme_toggle_requested.emit)
        self.update_theme_colors(self.current_theme)

    def update_theme_colors(self, theme):
        self.current_theme = theme
        title = self.findChild(QLabel, "SidebarTitle")
        if title:
            title.setStyleSheet(f"font-size: 16px; font-weight: bold; color: {{'#f8f9fa' if theme == 'dark' else '#333'}}; ")

        for i in range(self.element_list.count()):
            item = self.element_list.item(i)
            self._update_item_visuals(item, item.checkState() == Qt.Checked)

    def _update_item_visuals(self, item, is_checked):
        if self.current_theme == 'light':
            bg_color = QColor("#d4edda") if is_checked else QColor("white")
            text_color = QColor("black")
        else: # dark
            bg_color = QColor("#2a9d8f") if is_checked else QColor("#495057")
            text_color = QColor("white")
        item.setBackground(bg_color)
        item.setForeground(text_color)

    def _on_item_clicked(self, item):
        new_state = Qt.Checked if item.checkState() == Qt.Unchecked else Qt.Unchecked
        item.setCheckState(new_state)
        self._update_item_visuals(item, new_state == Qt.Checked)
        self._emit_contingencies()

    def _emit_contingencies(self):
        contingencies = []
        for i in range(self.element_list.count()):
            item = self.element_list.item(i)
            if item.checkState() == Qt.Checked:
                contingencies.append(item.data(Qt.UserRole))
        self.contingencies_changed.emit(contingencies)

    def update_element_list(self, net):
        self.element_list.itemClicked.disconnect(self._on_item_clicked)
        self.element_list.clear()
        if net and not net.line.empty:
            for idx, row in net.line.iterrows():
                item = QListWidgetItem(f"[L] Linha {idx} ({row.from_bus}↔{row.to_bus})")
                item.setData(Qt.UserRole, ('line', idx))
                item.setFlags(item.flags() | Qt.ItemIsUserCheckable)
                item.setCheckState(Qt.Unchecked)
                self.element_list.addItem(item)
                self._update_item_visuals(item, False)
        if net and not net.trafo.empty:
            for idx, row in net.trafo.iterrows():
                item = QListWidgetItem(f"[T] Trafo {idx} ({row.hv_bus}↔{row.lv_bus})")
                item.setData(Qt.UserRole, ('trafo', idx))
                item.setFlags(item.flags() | Qt.ItemIsUserCheckable)
                item.setCheckState(Qt.Unchecked)
                self.element_list.addItem(item)
                self._update_item_visuals(item, False)
        self.element_list.itemClicked.connect(self._on_item_clicked)

    def set_run_button_loading(self, is_loading):
        if is_loading:
            self.run_button.setText("Calculando...")
            self.run_button.setEnabled(False)
        else:
            self.run_button.setText("Executar Fluxo de Potência")
            self.run_button.setEnabled(True)

class LoadingWidget(QWidget):
    """A semi-transparent overlay widget to indicate loading."""
    build_network_requested = Signal()
    import_requested = Signal()
    export_requested = Signal()
    file_imported = Signal(str)
    
    def __init__(self, parent=None):
        super().__init__(parent)
        # Set transparent background for overlay
        self.setStyleSheet("""
            background-color: rgba(0, 0, 0, 180);
            border-radius: 10px;
        """)
        self.setup_ui()

    def setup_ui(self):
        # Use a single, persistent main layout to avoid duplicate layout warnings
        self.main_layout = QVBoxLayout(self)
        self.main_layout.setContentsMargins(10, 10, 10, 10)
        self.main_layout.setSpacing(10)

        # --- Action Buttons ---
        button_layout = QHBoxLayout()
        self.import_button = QPushButton("📥 Importar")
        self.import_button.setToolTip("Importar de Excel, TXT ou SQL")
        self.export_button = QPushButton("📤 Exportar")
        self.export_button.setToolTip("Exportar para Excel")
        self.build_button = QPushButton("🛠️ Construir Rede")
        self.build_button.setToolTip("Construir Rede a partir das Tabelas")
        self.build_button.setStyleSheet("""
            QPushButton {
                background-color: #007bff; 
                color: white; 
                font-weight: bold; 
                padding: 8px; 
                border-radius: 5px;
            }
            QPushButton:hover {
                background-color: #0056b3;
            }
        """)
        
        button_layout.addWidget(self.import_button)
        button_layout.addWidget(self.export_button)
        button_layout.addStretch()
        button_layout.addWidget(self.build_button)
        self.main_layout.addLayout(button_layout)

        # --- Tabs for different tables ---
        self.editor_tabs = QTabWidget()
        self.main_layout.addWidget(self.editor_tabs)

        # Initialize tables with default headers
        self.tables = {}
        self.setup_tables()

        # Connect signals
        self.import_button.clicked.connect(self.import_requested.emit)
        self.export_button.clicked.connect(self.export_requested.emit)
        self.build_button.clicked.connect(self.build_network_requested.emit)

    def setup_tables(self):
        """Initialize tables with default headers and add row buttons."""
        # main_layout and editor_tabs are created in setup_ui; avoid creating duplicates
        
        # Clear existing tabs
        while self.editor_tabs.count() > 0:
            self.editor_tabs.removeTab(0)
            
        # Use singular keys to align with builder: bus, line, trafo, load, gen
        table_configs = {
            'bus': ['name', 'vn_kv', 'type', 'zone', 'in_service'],
            'line': ['name', 'from_bus', 'to_bus', 'length_km', 'r_ohm_per_km', 
                     'x_ohm_per_km', 'c_nf_per_km', 'max_i_ka', 'in_service'],
            'trafo': ['name', 'hv_bus', 'lv_bus', 'sn_mva', 'vn_hv_kv', 'vn_lv_kv', 
                      'vkr_percent', 'vk_percent', 'pfe_kw', 'i0_percent', 'in_service'],
            'load': ['name', 'bus', 'p_mw', 'q_mvar', 'vn_kv', 'in_service'],
            'gen': ['name', 'bus', 'p_mw', 'vm_pu', 'vn_kv', 'min_p_mw', 'max_p_mw', 
                    'min_q_mvar', 'max_q_mvar', 'in_service']
        }
        
        self.tables = {}
        
        for name, headers in table_configs.items():
            # Create container widget for table + buttons
            container = QWidget()
            container_layout = QVBoxLayout(container)
            container_layout.setContentsMargins(0, 0, 0, 0)
            container_layout.setSpacing(5)
            
            # Create table
            table = QTableWidget()
            table.setColumnCount(len(headers))
            table.setHorizontalHeaderLabels(headers)
            table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
            table.setRowCount(5)  # Start with 5 empty rows
            table.horizontalHeader().setStretchLastSection(True)
            
            # Add row button
            add_row_btn = QPushButton("➕ Adicionar Linha")
            add_row_btn.clicked.connect(lambda _, t=table: t.insertRow(t.rowCount()))
            
            # Add widgets to container
            container_layout.addWidget(table)
            container_layout.addWidget(add_row_btn)
            
            # Store table reference
            self.tables[name] = table
            self.editor_tabs.addTab(container, name.capitalize())
            
        # Connect signals
        self.import_button.clicked.connect(self.import_requested.emit)
        self.export_button.clicked.connect(self.export_requested.emit)
        self.build_button.clicked.connect(self.build_network_requested.emit)

    def get_dataframes(self):
        """Extract data from the editor tables into a dictionary of DataFrames."""
        dfs = {}
        for name, table in self.tables.items():
            headers = self.get_table_headers(table)
            df = pd.DataFrame(columns=headers)
            
            for row in range(table.rowCount()):
                # Skip empty rows
                if all(table.item(row, col) is None or 
                       table.item(row, col).text().strip() == '' 
                       for col in range(table.columnCount())):
                    continue
                    
                row_data = []
                for col in range(table.columnCount()):
                    item = table.item(row, col)
                    if item is not None and item.text().strip() != '':
                        # Try to convert numeric values
                        try:
                            # Check if the column should be numeric
                            col_name = headers[col] if col < len(headers) else f'col_{col}'
                            if any(x in col_name.lower() for x in ['_mw', '_mvar', '_kv', '_ka', '_km', '_ohm', 'pfe_', 'vk_', 'vkr_', 'i0_', 'sn_']):
                                row_data.append(float(item.text()))
                            elif col_name in ['in_service']:
                                row_data.append(bool(item.text().lower() in ['true', '1', 'yes', 'y', 't']))
                            else:
                                row_data.append(item.text())
                        except (ValueError, AttributeError):
                            row_data.append(item.text())
                    else:
                        row_data.append('')
                
                if any(x != '' for x in row_data):  # Only add non-empty rows
                    df.loc[len(df)] = row_data[:len(headers)]  # Ensure we don't exceed column count
            
            dfs[name] = df
        return dfs

    def load_dataframes(self, dfs):
        """Load data into the editor tables from a dictionary of DataFrames."""
        for name, df in dfs.items():
            if name in self.tables:
                table = self.tables[name]
                table.clearContents()
                table.setRowCount(0)
                
                # Ensure we have enough columns
                current_cols = table.columnCount()
                needed_cols = len(df.columns)
                
                if needed_cols > current_cols:
                    table.setColumnCount(needed_cols)
                    # Update headers if needed
                    headers = self.get_table_headers(table)
                    for i in range(current_cols, needed_cols):
                        if i < len(df.columns):
                            headers.append(df.columns[i])
                    table.setHorizontalHeaderLabels(headers)
                
                # Set data
                table.setRowCount(len(df))
                for i, row in enumerate(df.itertuples(index=False)):
                    for j, value in enumerate(row):
                        if j < table.columnCount():  # Ensure we don't go out of bounds
                            table.setItem(i, j, QTableWidgetItem(str(value)))
                
                # Auto-resize columns to content
                table.resizeColumnsToContents()
                table.horizontalHeader().setStretchLastSection(True)

    def get_table_headers(self, table):
        return [table.horizontalHeaderItem(i).text() for i in range(table.columnCount())]
        
    def import_file(self):
        """Handle file import from various formats."""
        try:
            # Get file path from file dialog
            file_path, _ = QFileDialog.getOpenFileName(
                self,
                "Importar Dados",
                "",
                "Arquivos Suportados (*.xlsx *.xls *.txt *.csv *.db *.sqlite);;Todos os Arquivos (*)"
            )
            
            if not file_path:
                return
                
            # Show loading indicator
            QApplication.setOverrideCursor(Qt.WaitCursor)
            
            # Import the data
            from backend.dataframe_controller import DataFrameController
            controller = DataFrameController()
            
            # Get file extension
            file_ext = Path(file_path).suffix.lower()
            
            if file_ext in ['.xlsx', '.xls']:
                # For Excel, let user select which sheets to import
                xls = pd.ExcelFile(file_path)
                sheet_names = xls.sheet_names
                
                # Create dialog to select sheets
                dialog = QDialog(self)
                dialog.setWindowTitle("Selecionar Planilhas")
                layout = QVBoxLayout(dialog)
                
                # Add checkboxes for each sheet
                checkboxes = {}
                for sheet in sheet_names:
                    cb = QCheckBox(sheet)
                    cb.setChecked(True)
                    checkboxes[sheet] = cb
                    layout.addWidget(cb)
                
                # Add buttons
                btn_box = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
                btn_box.accepted.connect(dialog.accept)
                btn_box.rejected.connect(dialog.reject)
                layout.addWidget(btn_box)
                
                if dialog.exec_() == QDialog.Accepted:
                    # Import selected sheets
                    for sheet, cb in checkboxes.items():
                        if cb.isChecked():
                            df = pd.read_excel(file_path, sheet_name=sheet)
                            df = controller.clean_power_system_data(df)
                            self._import_dataframe(df, sheet.lower())
            else:
                # For other formats, import directly
                df = controller.load_file(file_path)
                df = controller.clean_power_system_data(df)
                
                # If it's a single table, try to guess the type
                if len(df) > 0:
                    self._import_dataframe(df, self._guess_table_type(df))
            
            # Emit signal that file was imported
            self.file_imported.emit(file_path)
            
        except Exception as e:
            QMessageBox.critical(self, "Erro ao Importar", f"Ocorreu um erro ao importar o arquivo:\n{str(e)}")
        finally:
            QApplication.restoreOverrideCursor()
    
    def _guess_table_type(self, df):
        """Guess the table type based on column names."""
        cols = [col.lower() for col in df.columns]
        
        if any(x in ['from_bus', 'to_bus', 'length_km'] for x in cols):
            return 'lines'
        elif 'hv_bus' in cols and 'lv_bus' in cols:
            return 'transformers'
        elif 'bus' in cols and 'p_mw' in cols and 'q_mvar' in cols:
            return 'loads'
        elif 'bus' in cols and 'p_mw' in cols and 'vm_pu' in cols:
            return 'generators'
        elif 'vn_kv' in cols and 'type' in cols:
            return 'buses'
        return 'dados'
    
    def _import_dataframe(self, df, table_name):
        """Import a single dataframe into the specified table."""
        if not df.empty:
            # Normalize table name
            table_name = table_name.lower()
            
            # If table doesn't exist, create it
            if table_name not in self.tables:
                self._create_table(table_name, df.columns.tolist())
            
            # Load data into table
            self.load_dataframes({table_name: df})
            
            # Switch to the tab
            for i in range(self.editor_tabs.count()):
                if self.editor_tabs.tabText(i).lower() == table_name:
                    self.editor_tabs.setCurrentIndex(i)
                    break
    
    def _create_table(self, name, headers):
        """Create a new table with the given name and headers."""
        # Create container widget for table + buttons
        container = QWidget()
        container_layout = QVBoxLayout(container)
        container_layout.setContentsMargins(0, 0, 0, 0)
        container_layout.setSpacing(5)
        
        # Create table
        table = QTableWidget()
        table.setColumnCount(len(headers))
        table.setHorizontalHeaderLabels(headers)
        table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
        table.setRowCount(5)  # Start with 5 empty rows
        table.horizontalHeader().setStretchLastSection(True)
        
        # Add row button
        add_row_btn = QPushButton("➕ Adicionar Linha")
        add_row_btn.clicked.connect(lambda _, t=table: t.insertRow(t.rowCount()))
        
        # Add widgets to container
        container_layout.addWidget(table)
        container_layout.addWidget(add_row_btn)
        
        # Store table reference
        self.tables[name] = table
        self.editor_tabs.addTab(container, name.capitalize())
    
    def export_to_excel(self):
        """Export all tables to an Excel file."""
        try:
            # Get save file path
            file_path, _ = QFileDialog.getSaveFileName(
                self,
                "Exportar para Excel",
                "",
                "Arquivos Excel (*.xlsx);;Todos os Arquivos (*)"
            )
            
            if not file_path:
                return
                
            # Ensure .xlsx extension
            if not file_path.lower().endswith('.xlsx'):
                file_path += '.xlsx'
            
            # Show loading indicator
            QApplication.setOverrideCursor(Qt.WaitCursor)
            
            # Get all dataframes
            dfs = self.get_dataframes()
            
            # Export to Excel with multiple sheets
            with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                for name, df in dfs.items():
                    if not df.empty:
                        df.to_excel(writer, sheet_name=name.capitalize(), index=False)
            
            QMessageBox.information(self, "Exportação Concluída", 
                                  f"Dados exportados com sucesso para:\n{file_path}")
            
        except Exception as e:
            QMessageBox.critical(self, "Erro ao Exportar", 
                               f"Ocorreu um erro ao exportar os dados:\n{str(e)}")
        finally:
            QApplication.restoreOverrideCursor()

class NewNetworkEditor(QWidget):
    """Editor for creating new power network configurations."""
    import_requested = Signal()
    export_requested = Signal()
    build_network_requested = Signal()
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
        self.expected_keys = ['bus', 'line', 'trafo', 'load', 'gen']
        self.tables = {k: self._create_table() for k in self.expected_keys}
        self._setup_tabs()
        
    def setup_ui(self):
        # Clear any existing layout
        if self.layout():
            QWidget().setLayout(self.layout())
            
        layout = QVBoxLayout(self)
        
        # Add buttons
        btn_layout = QHBoxLayout()
        self.import_btn = QPushButton("Importar")
        self.export_btn = QPushButton("Exportar")
        self.build_btn = QPushButton("Construir Rede")
        
        # Connect buttons to signals
        self.import_btn.clicked.connect(self.import_requested.emit)
        self.export_btn.clicked.connect(self.export_requested.emit)
        self.build_btn.clicked.connect(self.build_network_requested.emit)
        
        btn_layout.addWidget(self.import_btn)
        btn_layout.addWidget(self.export_btn)
        btn_layout.addWidget(self.build_btn)
        
        # Add main content
        layout.addLayout(btn_layout)
        
        # Tabs for data tables
        self.tabs = QTabWidget()
        layout.addWidget(self.tabs)

    def _setup_tabs(self):
        # Create tabs for each element type
        titles = {
            'bus': 'Barras (bus)',
            'line': 'Linhas (line)',
            'trafo': 'Transformadores (trafo)',
            'load': 'Cargas (load)',
            'gen': 'Geradores (gen)'
        }
        for key in self.expected_keys:
            tab = QWidget()
            v = QVBoxLayout(tab)
            v.addWidget(self.tables[key])
            self.tabs.addTab(tab, titles.get(key, key))

    def _create_table(self):
        t = QTableWidget()
        t.setColumnCount(0)
        t.setRowCount(0)
        t.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        return t

    def _set_table_from_df(self, table: QTableWidget, df: pd.DataFrame):
        # Ensure strings for display
        df = df.copy()
        table.clear()
        table.setRowCount(0)
        if df is None or df.empty:
            table.setColumnCount(0)
            return
        table.setRowCount(len(df))
        table.setColumnCount(len(df.columns))
        table.setHorizontalHeaderLabels([str(c) for c in df.columns])
        for i, row in enumerate(df.itertuples(index=False)):
            for j, value in enumerate(row):
                table.setItem(i, j, QTableWidgetItem(str(value)))

    def _df_from_table(self, table: QTableWidget) -> pd.DataFrame:
        rows = table.rowCount()
        cols = table.columnCount()
        headers = [table.horizontalHeaderItem(j).text() if table.horizontalHeaderItem(j) else f"col{j}" for j in range(cols)]
        data = []
        for i in range(rows):
            row = []
            empty = True
            for j in range(cols):
                item = table.item(i, j)
                val = item.text().strip() if item else ''
                if val != '':
                    empty = False
                row.append(val)
            if not empty:
                data.append(row)
        return pd.DataFrame(data, columns=headers)

    def load_dataframes(self, dfs: dict):
        """Load provided dataframes into the editor tables.
        Expected keys: 'bus','line','trafo','load','gen'. Other keys are ignored.
        """
        # Basic column normalizations for likely template columns
        col_maps = {
            'bus': {'Bus': 'name', 'Name': 'name', 'vn_kv': 'vn_kv', 'VN_kV': 'vn_kv', 'in_service': 'in_service', 'type': 'type'},
            'line': {'From': 'from_bus', 'To': 'to_bus', 'from': 'from_bus', 'to': 'to_bus', 'Comprimento_km': 'length_km', 'length': 'length_km', 'length_km': 'length_km', 'r_ohm_per_km': 'r_ohm_per_km', 'x_ohm_per_km': 'x_ohm_per_km', 'c_nf_per_km': 'c_nf_per_km', 'max_i_ka': 'max_i_ka', 'in_service': 'in_service', 'name':'name'},
            'trafo': {'HV': 'hv_bus', 'LV': 'lv_bus', 'sn_mva': 'sn_mva', 'vn_hv_kv': 'vn_hv_kv', 'vn_lv_kv': 'vn_lv_kv', 'vkr_percent': 'vkr_percent', 'vk_percent': 'vk_percent', 'pfe_kw': 'pfe_kw', 'i0_percent': 'i0_percent', 'in_service': 'in_service', 'name':'name'},
            'load': {'Bus': 'bus', 'P_MW': 'p_mw', 'Q_MVAr': 'q_mvar', 'p_mw': 'p_mw', 'q_mvar': 'q_mvar', 'in_service': 'in_service', 'name':'name'},
            'gen': {'Bus': 'bus', 'P_MW': 'p_mw', 'VM_pu': 'vm_pu', 'p_mw': 'p_mw', 'vm_pu': 'vm_pu', 'in_service': 'in_service', 'name':'name'},
        }
        for key in self.expected_keys:
            df = dfs.get(key)
            if df is None:
                # Clear table if no df
                self._set_table_from_df(self.tables[key], pd.DataFrame())
                continue
            # Normalize columns
            cmap = col_maps.get(key, {})
            new_cols = {}
            for c in df.columns:
                c_clean = str(c).strip()
                new_cols[c] = cmap.get(c_clean, c_clean)
            df_norm = df.rename(columns=new_cols)
            self._set_table_from_df(self.tables[key], df_norm)

    def get_dataframes(self) -> dict:
        """Return a dict of dataframes from current tables using the current headers."""
        out = {}
        for key in self.expected_keys:
            out[key] = self._df_from_table(self.tables[key])
        return out


class MainWindow(QMainWindow):
    """The main application window."""
    
    # Define signals
    theme_toggled = Signal(str)  # Signal emitted when theme is toggled
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("⚡ Dashboard de Análise de Contingências de Redes Elétricas SmartGrids from Pedro Victor Veras")
        self.setGeometry(100, 100, 1600, 900)
        self.current_theme = 'dark'
        self.setup_ui()
        self.apply_theme()

    def apply_theme(self):
        """Apply the current theme to all UI components."""
        # Apply theme to widgets
        stylesheet = AppStyles.DARK_MODE_STYLESHEET if self.current_theme == 'dark' else AppStyles.LIGHT_MODE_STYLESHEET
        self.setStyleSheet(stylesheet)
        
        # Update theme for custom widgets
        self.sidebar.update_theme_colors(self.current_theme)
        self.metrics_widget.update_theme_colors(self.current_theme)
        self.network_canvas.update_theme_colors(self.current_theme)
        
        # Update status label style
        current_status = self.status_label.text().strip('✅❌ℹ️ ')
        style_type = self.status_label.property("style_type") if hasattr(self.status_label, "property") else 'info'
        self.update_status(current_status, style_type)

    def toggle_theme(self):
        """Toggle between light and dark theme."""
        self.current_theme = 'light' if self.current_theme == 'dark' else 'dark'
        self.apply_theme()
        # Emit signal with new theme
        self.theme_toggled.emit(self.current_theme)

    def create_tab(self, plot_widget, table_widget):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        splitter = QSplitter(Qt.Vertical)
        splitter.addWidget(plot_widget)
        splitter.addWidget(table_widget)
        splitter.setSizes([400, 200])
        layout.addWidget(splitter)
        return tab

    def setup_tabs(self):
        """Configures the tabs for detailed analysis."""
        diagram_tab = QWidget()
        diagram_layout = QVBoxLayout(diagram_tab)
        self.network_canvas = NetworkCanvas(self)
        diagram_layout.addWidget(self.network_canvas)
        self.tabs.addTab(diagram_tab, "🗺️ Diagrama da Rede")

        self.voltage_plot = PlotlyWidget()
        self.line_loading_plot = PlotlyWidget()
        self.trafo_loading_plot = PlotlyWidget()
        self.line_p_flow_plot = PlotlyWidget()
        self.line_q_flow_plot = PlotlyWidget()

        self.voltage_table = QTableWidget()
        self.line_loading_table = QTableWidget()
        self.trafo_loading_table = QTableWidget()
        self.power_flow_table = QTableWidget()

        self.tabs.addTab(self.create_tab(self.voltage_plot, self.voltage_table), "📊 Tensões nas Barras")
        self.tabs.addTab(self.create_tab(self.line_loading_plot, self.line_loading_table), "📈 Carreg. Linhas")
        self.tabs.addTab(self.create_tab(self.trafo_loading_plot, self.trafo_loading_table), "📈 Carreg. Trafos")
        
        power_flow_tab = QWidget()
        pf_layout = QVBoxLayout(power_flow_tab)
        pf_splitter_plots = QSplitter(Qt.Horizontal)
        pf_splitter_plots.addWidget(self.line_p_flow_plot)
        pf_splitter_plots.addWidget(self.line_q_flow_plot)
        pf_splitter_main = QSplitter(Qt.Vertical)
        pf_splitter_main.addWidget(pf_splitter_plots)
        pf_splitter_main.addWidget(self.power_flow_table)
        pf_splitter_main.setSizes([400, 200])
        pf_layout.addWidget(pf_splitter_main)
        self.tabs.addTab(power_flow_tab, "⚡ Fluxo de Potência")

    def setup_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Root layout for stacking UI and loading screen
        self.root_stack = QStackedLayout(central_widget)

        # Main UI container
        main_ui_widget = QWidget()
        main_layout = QHBoxLayout(main_ui_widget)
        
        self.sidebar = SidebarWidget()
        self.sidebar.setMaximumWidth(350)
        main_layout.addWidget(self.sidebar)

        main_content_area = QWidget()
        main_content_layout = QVBoxLayout(main_content_area)
        main_layout.addWidget(main_content_area)

        self.status_label = QLabel("Carregando rede inicial...")
        self.status_label.setProperty("style_type", "info")
        main_content_layout.addWidget(self.status_label)
        self.metrics_widget = MetricsWidget()
        main_content_layout.addWidget(self.metrics_widget)

        main_vertical_splitter = QSplitter(Qt.Vertical)
        main_content_layout.addWidget(main_vertical_splitter)

        # --- View Stack for Results vs. Editor ---
        self.view_stack = QStackedLayout()
        view_container = QWidget()
        view_container.setLayout(self.view_stack)
        main_vertical_splitter.addWidget(view_container)

        # View 1: Detailed Results (Tabs)
        detailed_results_group = QGroupBox("Resultados Detalhados da Simulação")
        detailed_results_layout = QVBoxLayout(detailed_results_group)
        self.tabs = QTabWidget()
        self.setup_tabs()
        detailed_results_layout.addWidget(self.tabs)
        self.view_stack.addWidget(detailed_results_group)

        # View 2: New Network Editor
        self.new_network_editor = NewNetworkEditor()
        self.view_stack.addWidget(self.new_network_editor)

        # Network Description Area
        network_description_group = QGroupBox("Descrição da Rede e Componentes")
        network_description_layout = QVBoxLayout(network_description_group)
        self.network_description_text = QTextEdit()
        self.network_description_text.setReadOnly(True)
        network_description_layout.addWidget(self.network_description_text)
        main_vertical_splitter.addWidget(network_description_group)
        main_vertical_splitter.setSizes([700, 300])

        # Add main UI and loading widget to the root stack
        self.root_stack.addWidget(main_ui_widget)
        self.loading_widget = LoadingWidget()
        self.root_stack.addWidget(self.loading_widget)

        self.sidebar.theme_toggle_requested.connect(self.toggle_theme)

    def show_loading_overlay(self, show):
        self.root_stack.setCurrentIndex(1 if show else 0)

    def show_view(self, name):
        self.view_stack.setCurrentIndex(1 if name == "new_network" else 0)
        self.sidebar.contingency_group.setVisible(name != "new_network")

    def update_status(self, text, style_type='info'):
        base_style = "padding: 10px; border-radius: 5px; font-weight: bold;"
        self.status_label.setProperty("style_type", style_type)
        if style_type == 'success':
            self.status_label.setText(f"✅ {text}")
            self.status_label.setStyleSheet(f"QLabel {{ {base_style} background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }}")
        elif style_type == 'error':
            self.status_label.setText(f"❌ {text}")
            self.status_label.setStyleSheet(f"QLabel {{ {base_style} background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }}")
        else:
            self.status_label.setText(f"ℹ️ {text}")
            self.status_label.setStyleSheet(f"QLabel {{ {base_style} background-color: #e2e3e5; border: 1px solid #d6d8db; color: #383d41; }}")

    def update_table(self, table_widget, df):
        table_widget.clearContents()
        table_widget.setRowCount(0)
        if df.empty: return
        table_widget.setRowCount(len(df))
        table_widget.setColumnCount(len(df.columns))
        table_widget.setHorizontalHeaderLabels(df.columns.tolist())
        for i, row in enumerate(df.itertuples(index=False)):
            for j, value in enumerate(row):
                table_widget.setItem(i, j, QTableWidgetItem(str(value)))
        table_widget.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)

    def update_network_description(self, net):
        if not net:
            self.network_description_text.setHtml("<h3>Nenhuma rede carregada.</h3>")
            return

        description = f"<h3>Detalhes da Rede: {net.name.upper()}</h3>"
        description += "<p>Esta seção fornece uma visão geral dos componentes da rede.</p>"
        def create_html_list(title, count, items):
            s = f"<h4>{title} ({count}):</h4>"
            if not items: return s + "<p>Nenhum componente definido.</p>"
            s += "<ul>" + "".join([f"<li>{item}</li>" for item in items]) + "</ul>"
            return s

        bus_items = [f"<b>Barra {idx}:</b> Tensão Nominal = {bus.vn_kv} kV" for idx, bus in net.bus.iterrows()]
        line_items = [f"<b>Linha {idx}:</b> De Barra {line.from_bus} para Barra {line.to_bus}, Comp. = {line.length_km:.2f} km, Tipo = {line.std_type}" for idx, line in net.line.iterrows()]
        trafo_items = [f"<b>Trafo {idx}:</b> HV {trafo.hv_bus} ↔ LV {trafo.lv_bus}, Tipo = {trafo.std_type}" for idx, trafo in net.trafo.iterrows()]
        load_items = [f"<b>Carga {idx}</b> @ Barra {load.bus}: P={load.p_mw:.2f} MW, Q={load.q_mvar:.2f} MVAr" for idx, load in net.load.iterrows()]
        gen_items = [f"<b>Gerador {idx}</b> @ Barra {gen.bus}: P={gen.p_mw:.2f} MW" for idx, gen in net.gen.iterrows()]
        ext_grid_items = [f"<b>Grid Externo {idx}</b> @ Barra {ext_grid.bus}: Max P={ext_grid.max_p_mw:.2f} MW, Min P={ext_grid.min_p_mw:.2f} MW" for idx, ext_grid in net.ext_grid.iterrows()]

        description += create_html_list("Barras", len(net.bus), bus_items)
        description += create_html_list("Linhas", len(net.line), line_items)
        description += create_html_list("Transformadores", len(net.trafo), trafo_items)
        description += create_html_list("Cargas", len(net.load), load_items)
        description += create_html_list("Geradores", len(net.gen), gen_items)
        description += create_html_list("Grid Externo", len(net.ext_grid), ext_grid_items)
        self.network_description_text.setHtml(description)

# =========================== CONTROLLER ===========================
class PowerSystemController:
    """Controller - Manages interaction between Model and View."""
    
    def __init__(self):
        self.view = MainWindow()
        self.model = PowerSystemModel()
        self.charts = ChartsManager(self.view)
        self.current_contingencies = []
        self.setup_connections()
        self.load_network(self.view.sidebar.network_combo.currentText())

    def setup_connections(self):
        """Connect all UI signals to their respective slots."""
        try:
            # Network selection
            self.view.sidebar.network_combo.currentTextChanged.connect(self.load_network)
            
            # Contingency selection - use SidebarWidget signal
            self.view.sidebar.contingencies_changed.connect(self.prepare_contingencies)
            
            # Simulation control - connect both direct and signal-based connections
            self.view.sidebar.run_button.clicked.connect(self.run_simulation_with_delay)
            self.view.sidebar.run_simulation_requested.connect(self.run_simulation_with_delay)
            
            # Theme toggle - connect both button and signal
            self.view.sidebar.theme_toggle_button.clicked.connect(self.view.toggle_theme)
            self.view.sidebar.theme_toggle_requested.connect(self.view.toggle_theme)
            
            # Network editor signals
            if hasattr(self.view, 'new_network_editor'):
                # Connect editor buttons
                if hasattr(self.view.new_network_editor, 'import_button'):
                    self.view.new_network_editor.import_button.clicked.connect(self.import_network_from_excel)
                if hasattr(self.view.new_network_editor, 'export_button'):
                    self.view.new_network_editor.export_button.clicked.connect(self.export_network_to_excel)
                if hasattr(self.view.new_network_editor, 'build_button'):
                    self.view.new_network_editor.build_button.clicked.connect(self.build_network_from_editor)
                
                # Connect signals
                if hasattr(self.view.new_network_editor, 'import_requested'):
                    self.view.new_network_editor.import_requested.connect(self.import_network_from_excel)
                if hasattr(self.view.new_network_editor, 'export_requested'):
                    self.view.new_network_editor.export_requested.connect(self.export_network_to_excel)
                if hasattr(self.view.new_network_editor, 'build_network_requested'):
                    self.view.new_network_editor.build_network_requested.connect(self.build_network_from_editor)
            
            # View switching
            if hasattr(self.view.sidebar, 'view_selector'):
                self.view.sidebar.view_selector.currentIndexChanged.connect(
                    lambda i: self.view.show_view("new_network" if i == 1 else "results")
                )
            
            # Connect loading widget buttons if they exist
            if hasattr(self.view, 'loading_widget'):
                if hasattr(self.view.loading_widget, 'import_button'):
                    self.view.loading_widget.import_button.clicked.connect(self.import_network_from_excel)
                if hasattr(self.view.loading_widget, 'export_button'):
                    self.view.loading_widget.export_button.clicked.connect(self.export_network_to_excel)
                if hasattr(self.view.loading_widget, 'build_button'):
                    self.view.loading_widget.build_button.clicked.connect(self.build_network_from_editor)
                
                # Connect signals from loading widget
                if hasattr(self.view.loading_widget, 'import_requested'):
                    self.view.loading_widget.import_requested.connect(self.import_network_from_excel)
                if hasattr(self.view.loading_widget, 'export_requested'):
                    self.view.loading_widget.export_requested.connect(self.export_network_to_excel)
                if hasattr(self.view.loading_widget, 'build_network_requested'):
                    self.view.loading_widget.build_network_requested.connect(self.build_network_from_editor)
            
            # Initialize with default view
            self.view.show_view("results")
            
            # Connect theme toggle from view to controller
            self.view.theme_toggled.connect(self.handle_theme_toggle)
            
        except Exception as e:
            print(f"Error setting up connections: {e}")
            traceback.print_exc()

    def handle_theme_toggle(self):
        theme = 'light' if self.view.current_theme == 'dark' else 'dark'
        self.view.current_theme = theme
        self.charts.set_theme(theme)
        self.view.apply_theme()

    def show(self):
        self.view.show()

    def load_network(self, network_name):
        self.model.load_network(network_name)
        self.view.show_view("new_network" if network_name == "New Network" else "results")
        self.clear_results()
        self.view.sidebar.update_element_list(self.model.net)
        self.view.update_network_description(self.model.net)
        self.view.network_canvas.plot_network(self.model.net)
        if network_name == "New Network":
            self.view.update_status("Editor de Rede pronto. Importe ou preencha os dados.", 'info')
        else:
            self.prepare_contingencies([])

    def prepare_contingencies(self, contingencies):
        self.current_contingencies = contingencies
        self.model.apply_contingencies(self.current_contingencies)
        self.clear_results()
        self.view.network_canvas.plot_network(self.model.net)

    def clear_results(self):
        self.view.update_status("Pronto para simular. Pressione o botão para executar.", 'info')
        self.view.metrics_widget.update_metrics({"total_load_mw": 0, "total_gen_mw": 0, "voltage_violations": 0, "overloads": 0})
        self.view.update_table(self.view.voltage_table, pd.DataFrame())
        self.view.update_table(self.view.line_loading_table, pd.DataFrame())
        self.view.update_table(self.view.trafo_loading_table, pd.DataFrame())
        self.view.update_table(self.view.power_flow_table, pd.DataFrame())
        if PLOTLY_AVAILABLE:
            self.view.voltage_plot.clear()
            self.view.line_loading_plot.clear()
            self.view.trafo_loading_plot.clear()
            self.view.line_p_flow_plot.clear()
            self.view.line_q_flow_plot.clear()

    def run_simulation_with_delay(self):
        self.view.sidebar.set_run_button_loading(True)
        self.view.show_loading_overlay(True)
        QTimer.singleShot(50, self.run_simulation)

    def run_simulation(self):
        try:
            if not hasattr(self.model, 'net') or self.model.net is None or self.model.net.bus.empty:
                self.view.update_status("Rede vazia. Carregue uma rede ou construa uma nova.", 'error')
                return

            # Show loading state
            self.view.sidebar.set_run_button_loading(True)
            self.view.show_loading_overlay(True)
            QApplication.processEvents()  # Update UI

            try:
                # Apply contingencies
                self.model.apply_contingencies(self.current_contingencies)
                
                # Run power flow
                success, msg = self.model.run_power_flow()
                
                if success:
                    # Update UI with results
                    self.view.update_status(msg, 'success')
                    self.update_results_display()
                    
                    # Update network visualization
                    self.view.network_canvas.plot_network(self.model.net)
                    
                    # Update metrics and charts
                    if hasattr(self.model.net, 'res_bus') and not self.model.net.res_bus.empty:
                        repo = ResultsRepository(self.model.net)
                        self.view.metrics_widget.update_metrics(repo.get_kpis())
                        self.charts.update_all_charts(self.model.net)
                else:
                    self.view.update_status(msg, 'error')
                    self.clear_results()
                    
            except Exception as e:
                error_msg = f"Erro na simulação: {str(e)}"
                print(error_msg)
                traceback.print_exc()
                self.view.update_status(error_msg, 'error')
                
            finally:
                # Always ensure loading states are cleared
                self.view.sidebar.set_run_button_loading(False)
                self.view.show_loading_overlay(False)
        except Exception as e:
            self.view.update_status(f"Erro crítico na simulação: {e}", 'error')
            traceback.print_exc()
        finally:
            self.view.sidebar.set_run_button_loading(False)
            self.view.show_loading_overlay(False)

    def update_results_display(self):
        try:
            repo = ResultsRepository(self.model.net)
            self.view.metrics_widget.update_metrics(repo.get_kpis())
            
            # Update tables
            self.view.update_table(self.view.voltage_table, repo.get_bus_voltage_data())
            self.view.update_table(self.view.line_loading_table, repo.get_line_loading_data())
            self.view.update_table(self.view.trafo_loading_table, repo.get_trafo_loading_data())
            power_flow_df = repo.get_line_power_flow_data()
            self.view.update_table(self.view.power_flow_table, power_flow_df)
            
            # Update all charts using ChartsManager
            self.charts.update_all_charts(self.model.net)
            
        except Exception as e:
            self.view.update_status(f"Erro ao processar resultados: {e}", 'error')
            traceback.print_exc()

    def import_network_from_excel(self, path=None):
        # Allow direct path (e.g., from template) or prompt user
        if not path:
            path, _ = QFileDialog.getOpenFileName(self.view, "Importar Rede de Arquivo Excel", "", "Excel Files (*.xlsx)")
        if not path:
            return
        try:
            xls = pd.ExcelFile(path)
            raw_dfs = {sheet: xls.parse(sheet, dtype=str) for sheet in xls.sheet_names}
            # Normalize sheet names to expected keys: 'bus','line','trafo','load','gen'
            name_map = {
                'bus': 'bus', 'buses': 'bus', 'barras': 'bus',
                'line': 'line', 'lines': 'line', 'linhas': 'line',
                'trafo': 'trafo', 'trafos': 'trafo', 'transformer': 'trafo', 'transformers': 'trafo',
                'load': 'load', 'loads': 'load', 'cargas': 'load',
                'gen': 'gen', 'gens': 'gen', 'generator': 'gen', 'generators': 'gen', 'geradores': 'gen'
            }
            dfs = {}
            for sheet_name, df in raw_dfs.items():
                key = name_map.get(str(sheet_name).strip().lower())
                if key:
                    dfs[key] = df
            if not dfs:
                raise ValueError("Nenhuma planilha reconhecida. Use abas: bus, line, trafo, load, gen.")
            self.view.new_network_editor.load_dataframes(dfs)
            self.view.update_status(f"Dados importados de {path}", 'success')
        except Exception as e:
            self.view.update_status(f"Falha ao importar arquivo: {e}", 'error')
            traceback.print_exc()

    def export_network_to_excel(self):
        path, _ = QFileDialog.getSaveFileName(self.view, "Exportar Rede para Arquivo Excel", "minha_rede.xlsx", "Excel Files (*.xlsx)")
        if not path: return
        try:
            dfs = self.view.new_network_editor.get_dataframes()
            with pd.ExcelWriter(path) as writer:
                for name, df in dfs.items():
                    if not df.empty:
                        df.to_excel(writer, sheet_name=name, index=False)
            self.view.update_status(f"Rede exportada para {path}", 'success')
        except Exception as e:
            self.view.update_status(f"Falha ao exportar arquivo: {e}", 'error')
            traceback.print_exc()

    def build_network_from_editor(self):
        self.view.show_loading_overlay(True)
        QTimer.singleShot(50, self._build_network_task)

    def _build_network_task(self):
        try:
            self.view.update_status("Construindo rede a partir dos dados...", 'info')
            dfs = self.view.new_network_editor.get_dataframes()
            net = pp.create_empty_network(name="New Network")

            bus_df = dfs.get('bus')
            if bus_df is None or bus_df.empty:
                raise ValueError("A tabela 'bus' está vazia. Pelo menos uma barra é necessária.")

            def to_bool(val):
                return str(val).strip().lower() in ['true', '1', 'yes', 'y', 't']

            bus_map = {str(name): i for i, name in enumerate(bus_df['name'])}
            bus_map_norm = {str(k).strip().lower(): v for k, v in bus_map.items()}
            bus_index_set = set(range(len(bus_df)))
            def resolve_bus(x):
                s = str(x).strip()
                # If numeric and corresponds to an index, prefer index
                try:
                    idx = int(float(s))
                    if idx in bus_index_set:
                        return idx
                except Exception:
                    pass
                if s in bus_map:
                    return bus_map[s]
                s2 = s.lower()
                if s2 in bus_map_norm:
                    return bus_map_norm[s2]
                raise KeyError(f"Barra não encontrada: {x}")
            for i, row in bus_df.iterrows():
                pp.create_bus(
                    net,
                    name=row['name'],
                    vn_kv=float(row['vn_kv']),
                    index=bus_map[row['name']],
                    type=row.get('type', 'b'),
                    in_service=to_bool(row.get('in_service', 'true'))
                )

            def safe_cast(val, cast_fn, default=0):
                return cast_fn(val) if val and str(val).strip() else default

            for df_name, create_func, param_map in self._get_element_mappers(resolve_bus):
                df = dfs.get(df_name)
                if df is not None and not df.empty:
                    for _, row in df.iterrows():
                        params = {}
                        for pp_key, df_key, type_fn in param_map:
                            if df_key in row and pd.notna(row[df_key]):
                                val = row[df_key]
                                try:
                                    params[pp_key] = type_fn(val)
                                except Exception:
                                    params[pp_key] = safe_cast(val, str, str(val))
                        params['name'] = row['name']
                        create_func(net, **params)

            self.model.net = net
            try:
                plot.create_generic_coordinates(self.model.net)
            except Exception as e:
                # Optional dependency (igraph) may be missing; proceed without generic coords
                self.view.update_status(f"Coordenadas genéricas não geradas (dependência opcional ausente): {e}", 'info')
            self.view.sidebar.update_element_list(self.model.net)
            self.view.network_canvas.plot_network(self.model.net)
            self.view.update_network_description(self.model.net)
            self.view.update_status("Rede construída com sucesso! Pronta para simulação.", 'success')

        except Exception as e:
            self.view.update_status(f"Erro ao construir a rede: {e}", 'error')
            traceback.print_exc()
        finally:
            self.view.show_loading_overlay(False)

    def _get_element_mappers(self, resolve_bus):
        def to_bool(val):
            return str(val).strip().lower() in ['true', '1', 'yes', 'y', 't']
        return [
            ('line', pp.create_line_from_parameters, [
                ('from_bus', 'from_bus', resolve_bus),
                ('to_bus', 'to_bus', resolve_bus),
                ('length_km', 'length_km', float),
                ('r_ohm_per_km', 'r_ohm_per_km', float),
                ('x_ohm_per_km', 'x_ohm_per_km', float),
                ('c_nf_per_km', 'c_nf_per_km', float),
                ('max_i_ka', 'max_i_ka', float),
                ('in_service', 'in_service', to_bool),
            ]),
            ('gen', pp.create_gen, [
                ('bus', 'bus', resolve_bus),
                ('p_mw', 'p_mw', float),
                ('vm_pu', 'vm_pu', float),
                ('in_service', 'in_service', to_bool),
            ]),
            ('load', pp.create_load, [
                ('bus', 'bus', resolve_bus),
                ('p_mw', 'p_mw', float),
                ('q_mvar', 'q_mvar', float),
                ('in_service', 'in_service', to_bool),
            ]),
            ('trafo', pp.create_transformer_from_parameters, [
                ('hv_bus', 'hv_bus', resolve_bus),
                ('lv_bus', 'lv_bus', resolve_bus),
                ('sn_mva', 'sn_mva', float),
                ('vn_hv_kv', 'vn_hv_kv', float),
                ('vn_lv_kv', 'vn_lv_kv', float),
                ('vkr_percent', 'vkr_percent', float),
                ('vk_percent', 'vk_percent', float),
                ('pfe_kw', 'pfe_kw', float),
                ('i0_percent', 'i0_percent', float),
                ('in_service', 'in_service', to_bool),
            ])
        ]

# =========================== MAIN ===========================
def main():
    """Main entry point for the application."""
    app = QApplication(sys.argv)
    app.setFont(QFont("Segoe UI", 12))

    if not PLOTLY_AVAILABLE:
        QMessageBox.warning(None, "Dependência Faltando", "O módulo 'PySide6-WebEngine' não foi encontrado. Os gráficos interativos não serão exibidos.\n\nPor favor, instale-o com: pip install PySide6-WebEngine")

    controller = PowerSystemController()
    controller.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
