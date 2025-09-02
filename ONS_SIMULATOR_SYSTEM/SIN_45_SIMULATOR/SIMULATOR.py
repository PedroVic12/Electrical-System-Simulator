#!/usr/bin/env python3
# frontend_full.py
# Frontend PySide6 completo (restaura seu simulador) + QWebEngineView embedding do relatório Flask.
#
# Requisitos:
# pip install pandapower pandas openpyxl PySide6 PySide6-QtWebEngine plotly
#
# Coloque backend.py e template_index.html no mesmo diretório.

import os
# IMPORTANTE para compatibilidade matplotlib <-> PySide6
os.environ['QT_API'] = 'PySide6'

import sys
import subprocess
import time
import tempfile
import webbrowser
import urllib.parse
import socket
import shutil
from pathlib import Path
from datetime import datetime

import pandas as pd
import pandapower as pp
import pandapower.plotting as plot

# PySide6
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QTableWidget, QTableWidgetItem, QTabWidget, QFileDialog,
    QMessageBox, QHeaderView, QGroupBox, QSplitter, QLabel
)
from PySide6.QtCore import Qt, Slot, QUrl
from PySide6.QtGui import QFont

# WebEngine
from PySide6.QtWebEngineWidgets import QWebEngineView

# Matplotlib canvas (works with PySide6)
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_SCRIPT = os.path.join(BASE_DIR, "backend.py")
TEMPLATE_FILE = os.path.join(BASE_DIR, "template_index.html")
FLASK_HOST = "127.0.0.1"
FLASK_PORT = 5001
FLASK_URL_BASE = f"http://{FLASK_HOST}:{FLASK_PORT}"

# -------------------------
# 1. MODEL
# -------------------------
class PowerSystemModel:
    def __init__(self):
        self.net = None
        self.dataframes = {}

    def create_sin45_dataset_file(self, filename='SIN_45_barras_dataset.xlsx'):
        # cria Excel com abas mínimas (você pode substituir por sua versão completa)
        nomes_barras = {'Barra': list(range(1, 46)),
                        'Nome': ['IVAIPORA.525', 'LONDRINA.525'] + [f'BUS{i}.230' for i in range(3,46)]}
        reatores = {'Barra': [1, 20, 21], 'Susceptância Shunt B(pu)': [-2.0, -1.5, -1.5]}
        dados_rede = {'De':[1,1,2], 'Para':[2,3,3], 'R(pu)':[0.001,0.002,0.001], 'X(pu)':[0.01,0.02,0.015], 'B(pu)':[0,0,0]}
        carga_leve = {'Barra': list(range(1, 46)), 'Tipo de Barra (*)':[0]*45,
                      'Potência Ativa (MW)':[0]*45, 'Carga Ativa (MW)':[0]*45, 'Carga Reativa (Mvar)':[0]*45}

        tmpdir = tempfile.mkdtemp(prefix="sin45_")
        filepath = os.path.join(tmpdir, filename)
        with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
            pd.DataFrame(nomes_barras).to_excel(writer, sheet_name='bus', index=False)
            pd.DataFrame(dados_rede).to_excel(writer, sheet_name='line', index=False)
            pd.DataFrame(carga_leve).to_excel(writer, sheet_name='load_gen', index=False)
            pd.DataFrame(reatores).to_excel(writer, sheet_name='shunt', index=False)
        return filepath

    def load_data_from_excel(self, filepath):
        try:
            xls = pd.ExcelFile(filepath)
            self.dataframes = {sheet_name: pd.read_excel(xls, sheet_name) for sheet_name in xls.sheet_names}
            return self.dataframes
        except Exception as e:
            raise ValueError(f"Não foi possível ler o arquivo Excel: {e}")

    def create_network_from_dataframes(self):
        if not self.dataframes:
            raise ValueError("Nenhum dado carregado para criar a rede.")

        self.net = pp.create_empty_network()
        df_bus = self.dataframes.get('bus')
        df_load_gen = self.dataframes.get('load_gen')
        if df_bus is None or df_load_gen is None:
            raise ValueError("Abas 'bus' e 'load_gen' são necessárias.")

        # coerção
        for col in ['Barra', 'Tipo de Barra (*)', 'Potência Ativa (MW)', 'Carga Ativa (MW)', 'Carga Reativa (Mvar)']:
            if col in df_load_gen.columns:
                df_load_gen[col] = pd.to_numeric(df_load_gen[col], errors='coerce').fillna(0)
        df_bus['Barra'] = pd.to_numeric(df_bus['Barra'], errors='coerce').fillna(0)

        bus_map = {}
        for _, row in df_bus.iterrows():
            bus_id = int(row['Barra'])
            # tenta extrair vn_kv do nome
            vn_kv = 230.0
            try:
                name_str = str(row['Nome'])
                parts = name_str.split('.')
                if len(parts) > 1 and parts[-1].isdigit():
                    vn_kv = float(parts[-1])
            except Exception:
                vn_kv = 230.0
            new_idx = pp.create_bus(self.net, name=row['Nome'], vn_kv=vn_kv)
            bus_map[bus_id] = new_idx

        # cargas
        for _, row in df_load_gen.iterrows():
            if float(row.get('Carga Ativa (MW)', 0)) > 0:
                bus_idx = bus_map.get(int(row['Barra']))
                if bus_idx is not None:
                    pp.create_load(self.net, bus=bus_idx, p_mw=float(row['Carga Ativa (MW)']), q_mvar=float(row['Carga Reativa (Mvar)']))

        # gens / slack
        for _, row in df_load_gen.iterrows():
            bus_idx = bus_map.get(int(row['Barra']))
            if bus_idx is None: continue
            is_slack = int(row.get('Tipo de Barra (*)', 0)) == 2
            is_gen = float(row.get('Potência Ativa (MW)', 0)) > 0
            if is_gen:
                if is_slack:
                    pp.create_ext_grid(self.net, bus=bus_idx, vm_pu=1.0, name="Slack Bus")
                else:
                    pp.create_gen(self.net, bus=bus_idx, p_mw=float(row['Potência Ativa (MW)']), vm_pu=1.0)

        # linhas/trafo
        df_line = self.dataframes.get('line')
        if df_line is not None:
            for col in ['De','Para','R(pu)','X(pu)','B(pu)']:
                if col in df_line.columns:
                    df_line[col] = pd.to_numeric(df_line[col], errors='coerce').fillna(0)
            s_base_mva = 100.0
            for _, row in df_line.iterrows():
                try:
                    from_bus = bus_map.get(int(row['De'])); to_bus = bus_map.get(int(row['Para']))
                    if from_bus is None or to_bus is None: continue
                    vn_kv = self.net.bus.vn_kv.at[from_bus]
                    z_base_ohm = (vn_kv ** 2) / s_base_mva
                    r_ohm = row['R(pu)'] * z_base_ohm
                    x_ohm = row['X(pu)'] * z_base_ohm
                    y_base_siemens = 1 / z_base_ohm
                    b_siemens = row['B(pu)'] * y_base_siemens
                    c_nf = (b_siemens / (2 * 3.14159 * 60)) * 1e9 if b_siemens > 0 else 0
                    # detectar trafo por diferença de vn_kv
                    from_vn = self.net.bus.vn_kv.at[from_bus]; to_vn = self.net.bus.vn_kv.at[to_bus]
                    if abs(from_vn - to_vn) > 1e-3:
                        pp.create_transformer_from_parameters(self.net, hv_bus=from_bus, lv_bus=to_bus, sn_mva=s_base_mva,
                                                             vn_hv_kv=max(from_vn, to_vn), vn_lv_kv=min(from_vn, to_vn),
                                                             vkr_percent=row['R(pu)'] * 100.0, vk_percent=row['X(pu)'] * 100.0,
                                                             pfe_kw=0, i0_percent=0)
                    else:
                        pp.create_line_from_parameters(self.net, from_bus=from_bus, to_bus=to_bus,
                                                      length_km=1.0, r_ohm_per_km=r_ohm, x_ohm_per_km=x_ohm,
                                                      c_nf_per_km=c_nf, max_i_ka=0.5)
                except Exception:
                    continue
        return self.net

    def run_power_flow(self):
        if self.net is None:
            raise ValueError("Rede não criada.")
        try:
            pp.runpp(self.net)
            return True, "Fluxo de potência executado com sucesso."
        except Exception as e:
            return False, f"Falha no fluxo de potência: {e}"

# -------------------------
# 2. VIEW
# -------------------------
class MetricsWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 10, 0, 10)
        self.gen_card = self._create_metric_card("Geração Total (MW)", "N/A")
        self.load_card = self._create_metric_card("Carga Total (MW)", "N/A")
        layout.addWidget(self.gen_card)
        layout.addWidget(self.load_card)

    def _create_metric_card(self, title, initial_value):
        card = QGroupBox(title)
        card_layout = QVBoxLayout(card)
        value_label = QLabel(initial_value)
        font = QFont("Segoe UI", 18, QFont.Bold)
        value_label.setFont(font)
        value_label.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(value_label)
        card.setStyleSheet("""
            QGroupBox { background-color: #f0f0f0; border: 1px solid #cccccc; border-radius: 5px; margin-top:1ex; }
            QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top center; padding: 0 3px; }
        """)
        return card

    def update_metrics(self, total_gen_mw, total_load_mw):
        gen_label = self.gen_card.findChild(QLabel)
        load_label = self.load_card.findChild(QLabel)
        gen_label.setText(f"{total_gen_mw:.2f}")
        load_label.setText(f"{total_load_mw:.2f}")

class NetworkCanvas(FigureCanvas):
    def __init__(self, parent=None):
        self.fig, self.ax = plt.subplots(figsize=(8,6))
        super().__init__(self.fig)
        self.setParent(parent)
        self.ax.set_title("Diagrama Unifilar da Rede")
        self.fig.tight_layout()

    def plot_network(self, net):
        self.ax.clear()
        if net is None or len(net.bus) == 0:
            self.ax.text(0.5,0.5,"Nenhuma rede para plotar", ha='center', va='center')
            self.draw()
            return
        try:
            collections = []
            # esquema simples usando pandapower plotting collections
            try:
                bc = plot.create_bus_collection(net, size=0.06, zorder=10)
                collections.append(bc)
            except Exception:
                pass
            try:
                collections.append(plot.create_line_collection(net, color="grey", linewidth=1.2))
            except Exception:
                pass
            try:
                if len(net.load) > 0:
                    collections.append(plot.create_load_collection(net, size=0.12, color='red'))
                if len(net.gen) > 0:
                    collections.append(plot.create_gen_collection(net, size=0.12, color='green'))
                if len(net.ext_grid) > 0:
                    collections.append(plot.create_ext_grid_collection(net, size=0.12, color='orange'))
                if len(net.trafo) > 0:
                    collections.append(plot.create_trafo_collection(net, size=0.12, color='purple'))
                if len(net.shunt) > 0:
                    collections.append(plot.create_shunt_collection(net, size=0.12, color='cyan'))
            except Exception:
                pass

            plot.draw_collections(collections, ax=self.ax)
            self.ax.set_title("Diagrama Unifilar da Rede")
            self.ax.axis('off')
        except Exception as e:
            self.ax.text(0.5,0.5,f'Erro ao plotar:\n{e}', ha='center', va='center', color='red')
        self.fig.tight_layout()
        self.draw()

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Dashboard de Análise de Redes Elétricas - Mestre Pedro Victor")
        self.setGeometry(80, 80, 1400, 900)

        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QHBoxLayout(main_widget)

        splitter = QSplitter(Qt.Horizontal)
        main_layout.addWidget(splitter)

        # left controls & tables
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        splitter.addWidget(left_panel)

        # controls group
        controls_group = QGroupBox("Controles")
        controls_layout = QHBoxLayout(controls_group)
        self.btn_generate_sin45 = QPushButton("Gerar e Carregar SIN 45")
        self.btn_import = QPushButton("Importar XLSX")
        self.btn_export = QPushButton("Exportar XLSX")
        self.btn_run_pf = QPushButton("▶ Executar Fluxo de Potência")
        self.btn_plot_plotly = QPushButton("📈 Report Interativo (embutido)")

        self.btn_run_pf.setStyleSheet("background-color:#4CAF50;color:white;font-weight:bold;")
        controls_layout.addWidget(self.btn_generate_sin45)
        controls_layout.addWidget(self.btn_import)
        controls_layout.addWidget(self.btn_export)
        controls_layout.addStretch()
        controls_layout.addWidget(self.btn_run_pf)
        controls_layout.addWidget(self.btn_plot_plotly)
        left_layout.addWidget(controls_group)

        # tabs for tables
        self.tabs = QTabWidget()
        left_layout.addWidget(self.tabs)
        self.tables = {}

        # right panel: metrics + canvas + webview
        right_panel = QGroupBox("Visualização")
        right_layout = QVBoxLayout(right_panel)
        splitter.addWidget(right_panel)

        self.metrics_widget = MetricsWidget()
        right_layout.addWidget(self.metrics_widget)

        self.network_canvas = NetworkCanvas(self)
        right_layout.addWidget(self.network_canvas, stretch=1)

        # embedded web view for report
        self.web_view = QWebEngineView()
        self.web_view.setMinimumHeight(300)
        right_layout.addWidget(self.web_view, stretch=1)

        splitter.setSizes([600,800])

    def add_table_tab(self, name, df):
        if name not in self.tables:
            table = QTableWidget()
            table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
            self.tables[name] = table
            self.tabs.addTab(table, name.capitalize())
        table = self.tables[name]
        table.clear()
        table.setRowCount(df.shape[0])
        table.setColumnCount(df.shape[1])
        table.setHorizontalHeaderLabels(list(df.columns.astype(str)))
        for i, row in enumerate(df.itertuples(index=False)):
            for j, value in enumerate(row):
                table.setItem(i, j, QTableWidgetItem(str(value)))
        table.resizeColumnsToContents()

    def get_dataframes_from_tables(self):
        dfs = {}
        for name, table in self.tables.items():
            headers = [table.horizontalHeaderItem(j).text() for j in range(table.columnCount())]
            data = []
            for i in range(table.rowCount()):
                row_data = [table.item(i, j).text() if table.item(i, j) else '' for j in range(table.columnCount())]
                if any(cell.strip() for cell in row_data):
                    data.append(row_data)
            dfs[name] = pd.DataFrame(data, columns=headers)
        return dfs

# -------------------------
# 3. CONTROLLER
# -------------------------
class AppController:
    def __init__(self):
        self.app = QApplication(sys.argv)
        self.view = MainWindow()
        self.model = PowerSystemModel()
        self._backend_proc = None
        self._backend_started_by_me = False
        self._tmpdirs = []

        self._connect_signals()
        self.view.show()

    def _connect_signals(self):
        self.view.btn_generate_sin45.clicked.connect(self.generate_and_load_sin45)
        self.view.btn_import.clicked.connect(self.import_from_excel)
        self.view.btn_export.clicked.connect(self.export_to_excel)
        self.view.btn_run_pf.clicked.connect(self.run_power_flow)
        self.view.btn_plot_plotly.clicked.connect(self.plot_interactive_embedded)

    def ensure_backend_running(self, timeout=5.0):
        # verifica conexão; se não, inicia backend.py (detached)
        def can_connect():
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.4)
                s.connect((FLASK_HOST, FLASK_PORT)); s.close(); return True
            except Exception:
                return False

        if can_connect():
            return True

        if not os.path.exists(BACKEND_SCRIPT):
            QMessageBox.critical(self.view, "Erro", f"backend.py não encontrado em:\n{BACKEND_SCRIPT}")
            return False

        cmd = [sys.executable, BACKEND_SCRIPT, "--host", FLASK_HOST, "--port", str(FLASK_PORT)]
        try:
            if os.name == "nt":
                proc = subprocess.Popen(cmd, creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)
            else:
                proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setpgrp)
            self._backend_proc = proc
            self._backend_started_by_me = True
            # aguardar
            start = time.time()
            while time.time() - start < timeout:
                if can_connect(): return True
                time.sleep(0.15)
            QMessageBox.warning(self.view, "Timeout", "Backend Flask não respondeu a tempo.")
            return False
        except Exception as e:
            QMessageBox.critical(self.view, "Erro ao iniciar backend", str(e))
            return False

    def generate_and_load_sin45(self):
        try:
            filepath = self.model.create_sin45_dataset_file()
            self._tmpdirs.append(os.path.dirname(filepath))
            dfs = self.model.load_data_from_excel(filepath)
            self.view.tabs.clear(); self.view.tables.clear()
            for name, df in dfs.items():
                self.view.add_table_tab(name, df)
            # reset canvas and metrics
            self.view.network_canvas.plot_network(None)
            self.view.metrics_widget.update_metrics(0, 0)
            QMessageBox.information(self.view, "Sucesso", f"Dataset SIN45 gerado e carregado:\n{filepath}")
        except Exception as e:
            QMessageBox.critical(self.view, "Erro", f"Falha ao gerar/carregar SIN45: {e}")

    def import_from_excel(self):
        filepath, _ = QFileDialog.getOpenFileName(self.view, "Importar Rede", "", "Arquivos Excel (*.xlsx)")
        if filepath:
            try:
                dfs = self.model.load_data_from_excel(filepath)
                self.view.tabs.clear(); self.view.tables.clear()
                for name, df in dfs.items():
                    self.view.add_table_tab(name, df)
                self.view.network_canvas.plot_network(None)
                self.view.metrics_widget.update_metrics(0,0)
            except Exception as e:
                QMessageBox.critical(self.view, "Erro de Importação", str(e))

    def export_to_excel(self):
        filepath, _ = QFileDialog.getSaveFileName(self.view, "Exportar Rede", "", "Arquivos Excel (*.xlsx)")
        if filepath:
            try:
                dfs = self.view.get_dataframes_from_tables()
                with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
                    for name, df in dfs.items():
                        df.to_excel(writer, sheet_name=name, index=False)
                QMessageBox.information(self.view, "Sucesso", f"Dados exportados para:\n{filepath}")
            except Exception as e:
                QMessageBox.critical(self.view, "Erro de Exportação", str(e))

    def run_power_flow(self):
        try:
            # pega dados da UI
            self.model.dataframes = self.view.get_dataframes_from_tables()
            net = self.model.create_network_from_dataframes()
            success, message = self.model.run_power_flow()
            if success:
                # coordenadas genéricas para plot
                try:
                    pp.plotting.create_generic_coordinates(self.model.net)
                except Exception:
                    pass
                QMessageBox.information(self.view, "Fluxo de Potência", message)
                # mostrar resultados
                if hasattr(self.model.net, "res_bus"):
                    self.view.add_table_tab("res_bus", self.model.net.res_bus)
                if hasattr(self.model.net, "res_line"):
                    self.view.add_table_tab("res_line", self.model.net.res_line)
                # metrics
                total_gen = 0.0
                total_load = 0.0
                if hasattr(self.model.net, "res_gen"):
                    total_gen += self.model.net.res_gen.p_mw.sum() if not self.model.net.res_gen.empty else 0.0
                if hasattr(self.model.net, "res_ext_grid"):
                    total_gen += self.model.net.res_ext_grid.p_mw.sum() if not self.model.net.res_ext_grid.empty else 0.0
                if hasattr(self.model.net, "res_load"):
                    total_load += self.model.net.res_load.p_mw.sum() if not self.model.net.res_load.empty else 0.0
                self.view.metrics_widget.update_metrics(total_gen, total_load)
                # plot canvas
                self.view.network_canvas.plot_network(self.model.net)
            else:
                QMessageBox.warning(self.view, "Fluxo de Potência", message)
        except Exception as e:
            QMessageBox.critical(self.view, "Erro", f"Ocorreu um erro: {e}")

    def plot_interactive_embedded(self):
        # gera net.json e excel, chama endpoint /report e carrega no QWebEngineView
        try:
            if not self.model.net:
                QMessageBox.warning(self.view, "Aviso", "É necessário gerar/carregar a rede e executar o fluxo de potência primeiro.")
                return

            ok = self.ensure_backend_running()
            if not ok:
                return

            base_dir = os.getcwd()
            temp_dir = tempfile.mkdtemp(prefix="pandapower_report_")
            self._tmpdirs.append(temp_dir)
            net_file = os.path.join(temp_dir, "net.json")
            data_file = os.path.join(temp_dir, "report_data.xlsx")
            output_file = os.path.join(base_dir, "pandapower_report.html")
            log_file = os.path.join(base_dir, "report_logs.txt")

            # salvar net e resultados
            pp.to_json(self.model.net, net_file)
            with pd.ExcelWriter(data_file, engine='openpyxl') as writer:
                # salvar todas as DFs da UI + res_bus/res_line
                dfs = self.view.get_dataframes_from_tables()
                for name, df in dfs.items():
                    if df is not None and not df.empty:
                        df.to_excel(writer, sheet_name=name, index=False)
                if hasattr(self.model.net, "res_bus"):
                    self.model.net.res_bus.to_excel(writer, sheet_name="res_bus", index=False)
                if hasattr(self.model.net, "res_line"):
                    self.model.net.res_line.to_excel(writer, sheet_name="res_line", index=False)

            # montar URL (usar quote)
            url = f"{FLASK_URL_BASE}/report?net={urllib.parse.quote_plus(os.path.abspath(net_file))}&data={urllib.parse.quote_plus(os.path.abspath(data_file))}"
            # carregar no QWebEngineView embutido
            self.view.web_view.load(QUrl(url))
            # opcional: mostrar status/diálogo
            self.view.web_view.loadFinished.connect(lambda ok: QMessageBox.information(self.view, "Relatório", "Relatório carregado." if ok else "Falha ao carregar relatório."))
        except Exception as e:
            QMessageBox.critical(self.view, "Erro", f"Erro ao gerar relatório interativo:\n{e}")

    def run(self):
        try:
            sys.exit(self.app.exec())
        finally:
            # clean up
            try:
                if self._backend_proc and self._backend_started_by_me:
                    self._backend_proc.terminate()
            except Exception:
                pass
            for d in self._tmpdirs:
                try:
                    shutil.rmtree(d, ignore_errors=True)
                except Exception:
                    pass

# -------------------------
# 4. ENTRYPOINT
# -------------------------
if __name__ == '__main__':
    controller = AppController()
    controller.run()
