#!/usr/bin/env python3
# frontend.py
# PySide6 GUI que carrega dados, cria net.json+report_data.xlsx e chama o backend Flask (backend.py)
# O frontend inicia o backend como subprocess caso não esteja rodando.

import sys
import os
import subprocess
import time
import webbrowser
import tempfile
from pathlib import Path

# --- importante definir backend script name ---
BACKEND_SCRIPT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend.py")
TEMPLATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "template_index.html")
FLASK_HOST = "127.0.0.1"
FLASK_PORT = 5001
FLASK_URL_BASE = f"http://{FLASK_HOST}:{FLASK_PORT}"

# Qt / PySide6
from PySide6.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QMessageBox
from PySide6.QtCore import Qt

# Pandapower & pandas (model functions minimal)
import pandas as pd
import pandapower as pp

#! pip install pandapower pandas openpyxl PySide6 PySide6-QtWebEngine

class SimpleFrontend(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Frontend PySide6 - Relatório Pandapower")
        self.setGeometry(100, 100, 600, 160)
        self._backend_proc = None

        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)

        self.btn_gen_sin = QPushButton("Gerar SIN45 e Abrir Relatório (vai iniciar backend se preciso)")
        self.btn_gen_sin.clicked.connect(self.on_gen_sin)
        layout.addWidget(self.btn_gen_sin)

        self.btn_open_index = QPushButton("Abrir index.html (template)")
        self.btn_open_index.clicked.connect(self.open_index_template)
        layout.addWidget(self.btn_open_index)

    def ensure_backend_running(self):
        # tenta conectar na URL; se falhar, inicia backend.py como subprocess
        import socket
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            s.settimeout(0.5)
            s.connect((FLASK_HOST, FLASK_PORT))
            s.close()
            return True
        except Exception:
            # iniciar backend
            if not os.path.exists(BACKEND_SCRIPT):
                QMessageBox.critical(self, "Erro", f"backend.py não encontrado em:\n{BACKEND_SCRIPT}")
                return False
            cmd = [sys.executable, BACKEND_SCRIPT, "--host", FLASK_HOST, "--port", str(FLASK_PORT)]
            # iniciar em modo detached dependendo do SO
            if os.name == "nt":
                # windows
                proc = subprocess.Popen(cmd, creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)
            else:
                proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setpgrp)
            self._backend_proc = proc
            # aguardar disponibilidade
            for i in range(20):
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s.settimeout(0.5)
                    s.connect((FLASK_HOST, FLASK_PORT))
                    s.close()
                    return True
                except Exception:
                    time.sleep(0.2)
            QMessageBox.critical(self, "Erro", "Não foi possível iniciar o backend Flask.")
            return False

    def create_sin45_dataset_file(self, filename="SIN_45_barras_dataset.xlsx"):
        # crie na pasta temporária
        tempdir = tempfile.mkdtemp(prefix="sin45_")
        path = os.path.join(tempdir, filename)
        # criar planilhas mínimas (reaproveitei estrutura curta)
        nomes_barras = {'Barra': list(range(1, 46)), 'Nome': [f'BUS{i}.230' for i in range(1,46)]}
        dados_rede = {'De':[1,1,2], 'Para':[2,3,3], 'R(pu)':[0.001,0.002,0.001], 'X(pu)':[0.01,0.02,0.015], 'B(pu)':[0,0,0]}
        carga_leve = {'Barra': list(range(1, 46)), 'Tipo de Barra (*)':[0]*45, 'Potência Ativa (MW)':[0]*45, 'Carga Ativa (MW)':[0]*45, 'Carga Reativa (Mvar)':[0]*45}
        with pd.ExcelWriter(path, engine='openpyxl') as writer:
            pd.DataFrame(nomes_barras).to_excel(writer, sheet_name='bus', index=False)
            pd.DataFrame(dados_rede).to_excel(writer, sheet_name='line', index=False)
            pd.DataFrame(carga_leve).to_excel(writer, sheet_name='load_gen', index=False)
            pd.DataFrame({'note':['generated minimal sin45 stub']}).to_excel(writer, sheet_name='meta', index=False)
        return path, tempdir

    def on_gen_sin(self):
        try:
            ok = self.ensure_backend_running()
            if not ok:
                return
            excel_path, tmpdir = self.create_sin45_dataset_file()
            # Criar net.json via o mesmo fluxo de criação (leva os dados do excel e cria network)
            # Vamos criar rede rapidamente e salvar json, para o backend carregar.
            df_bus = pd.read_excel(excel_path, sheet_name='bus')
            df_line = pd.read_excel(excel_path, sheet_name='line')
            df_load = pd.read_excel(excel_path, sheet_name='load_gen')

            net = pp.create_empty_network()

            bus_map = {}
            for _, row in df_bus.iterrows():
                idx = pp.create_bus(net, vn_kv=230.0, name=str(row['Nome']))
                bus_map[int(row['Barra'])] = idx

            # cargas
            for _, row in df_load.iterrows():
                b = int(row['Barra'])
                if row.get('Carga Ativa (MW)', 0) > 0:
                    pp.create_load(net, bus=bus_map[b], p_mw=float(row['Carga Ativa (MW)']), q_mvar=float(row['Carga Reativa (Mvar)']))

            # linhas simples
            for _, row in df_line.iterrows():
                de = int(row['De']); para = int(row['Para'])
                if de in bus_map and para in bus_map:
                    try:
                        pp.create_line_from_parameters(net, from_bus=bus_map[de], to_bus=bus_map[para],
                                                      length_km=1.0,
                                                      r_ohm_per_km=float(row['R(pu)'])*((230.0**2)/100.0),
                                                      x_ohm_per_km=float(row['X(pu)'])*((230.0**2)/100.0),
                                                      c_nf_per_km=0.0,
                                                      max_i_ka=1.0)
                    except Exception:
                        pass

            # forçar um ext_grid se não houver gerador/slack
            if len(net.ext_grid) == 0 and len(net.bus) > 0:
                pp.create_ext_grid(net, bus=0, vm_pu=1.0)

            # runpp para gerar resultados
            try:
                pp.runpp(net)
            except Exception:
                # ainda salva o net mesmo se runpp falhar
                pass

            net_json = os.path.join(tmpdir, "net.json")
            pp.to_json(net, net_json)

            # criar report_data.xlsx com resultados
            report_xlsx = os.path.join(tmpdir, "report_data.xlsx")
            with pd.ExcelWriter(report_xlsx, engine='openpyxl') as writer:
                if hasattr(net, "res_bus") and net.res_bus is not None:
                    net.res_bus.to_excel(writer, sheet_name="res_bus", index=False)
                if hasattr(net, "res_line") and net.res_line is not None:
                    net.res_line.to_excel(writer, sheet_name="res_line", index=False)

            # abrir no navegador a URL do backend
            url = f"{FLASK_URL_BASE}/report?net={os.path.abspath(net_json)}&data={os.path.abspath(report_xlsx)}"
            webbrowser.open(url)
            QMessageBox.information(self, "Relatório", f"Relatório solicitado. Abrindo: {url}")
        except Exception as e:
            QMessageBox.critical(self, "Erro", str(e))

    def open_index_template(self):
        if os.path.exists(TEMPLATE_FILE):
            webbrowser.open(f"file://{os.path.abspath(TEMPLATE_FILE)}")
        else:
            QMessageBox.warning(self, "Template não encontrado", f"Crie template_index.html ao lado de frontend.py/backend.py")

def main():
    app = QApplication(sys.argv)
    win = SimpleFrontend()
    win.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
