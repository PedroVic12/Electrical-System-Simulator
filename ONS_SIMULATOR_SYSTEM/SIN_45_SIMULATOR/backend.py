#!/usr/bin/env python3
# backend.py
# Flask server que renderiza o HTML com pf_res_plotly do pandapower.
# Usa um servidor simples e uma classe FlaskServer para controlar start/stop.
#
# Executar sozinho: python backend.py --host 127.0.0.1 --port 5001
# O frontend (PySide6) vai chamar o endpoint /report?net=/abs/path/net.json&data=/abs/path/data.xlsx

import os
import sys
import argparse
from threading import Thread
from flask import Flask, request, send_from_directory, abort, Response
from datetime import datetime
import pandapower as pp
import pandas as pd
import traceback

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, "template_index.html")  # arquivo de template (index.html fornecido)
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 5001

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, "static"), template_folder=BASE_DIR)

def load_template():
    if not os.path.exists(TEMPLATE_PATH):
        # fallback minimal
        return """<!doctype html><html><head><meta charset="utf-8"><title>Relatório</title></head><body>
        <h1>Relatório Pandapower</h1>
        {{NET_SUMMARY}}
        {{PLOTLY_PLOT}}
        {{TABLES}}
        </body></html>"""
    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
        return f.read()

@app.route("/")
def index():
    # serve o template bruto (sem plot)
    tpl = load_template()
    tpl = tpl.replace("{{GEN_TIME}}", datetime.now().isoformat())
    tpl = tpl.replace("{{NET_SUMMARY}}", "<p>Use /report?net=&data= para gerar relatório</p>")
    tpl = tpl.replace("{{PLOTLY_PLOT}}", "<p>Nenhum plot disponível.</p>")
    tpl = tpl.replace("{{TABLES}}", "<p>Nenhuma tabela.</p>")
    return Response(tpl, mimetype="text/html")

@app.route("/report")
def report():
    """
    endpoint: /report?net=/abs/path/net.json&data=/abs/path/data.xlsx
    - carrega net.json com pandapower
    - carrega excel opcional
    - executa pp.runpp() se necessário
    - gera pf_res_plotly (fallback simple_plotly)
    - injeta tudo no template e retorna HTML
    """
    net_path = request.args.get("net", None)
    data_path = request.args.get("data", None)

    log_msgs = []
    def log(msg):
        print(msg)
        log_msgs.append(f"[{datetime.now().isoformat()}] {msg}")

    template = load_template()

    if not net_path or not os.path.exists(net_path):
        log(f"Arquivo net.json inválido ou inexistente: {net_path}")
        return abort(400, f"net file missing or not found: {net_path}")

    try:
        log(f"Carregando rede pandapower de: {net_path}")
        net = pp.from_json(net_path)
    except Exception as e:
        tb = traceback.format_exc()
        log(f"Erro ao carregar net.json: {e}\n{tb}")
        return abort(500, f"Erro ao carregar net.json: {e}")

    # executar fluxo se necessário
    try:
        has_results = (hasattr(net, "res_bus") and net.res_bus is not None and len(net.res_bus) > 0)
        if not has_results:
            log("Sem resultados de fluxo. Executando pp.runpp(net) ...")
            try:
                pp.runpp(net)
                log("Fluxo de potência executado com sucesso.")
            except Exception as e:
                log(f"Falha ao executar pp.runpp: {e}")
    except Exception as e:
        log(f"Erro verificando/executando fluxo: {e}")

    # gerar html do plotly
    plot_html = ""
    try:
        try:
            log("Tentando pf_res_plotly...")
            fig = pp.plotting.pf_res_plotly(net, auto_open=False)
            plot_html = fig.to_html(full_html=False, include_plotlyjs='cdn')
            log("pf_res_plotly OK.")
        except Exception as e_pf:
            log(f"pf_res_plotly falhou: {e_pf}. Tentando simple_plotly...")
            try:
                fig = pp.plotting.simple_plotly(net, auto_open=False)
                plot_html = fig.to_html(full_html=False, include_plotlyjs='cdn')
                log("simple_plotly OK.")
            except Exception as e_sp:
                log(f"simple_plotly falhou: {e_sp}. Gerando mensagem fallback.")
                plot_html = '<div style="padding:10px;background:#fff3cd;border-radius:6px">⚠️ Não foi possível gerar o gráfico Plotly automaticamente.</div>'
    except Exception as e:
        log(f"Erro gerando plotly: {e}")
        plot_html = f'<div style="color:red">Erro ao gerar plot: {e}</div>'

    # summary da rede
    try:
        summary = []
        summary.append(f"Barras: {len(net.bus) if hasattr(net,'bus') else 0}")
        summary.append(f"Linhas: {len(net.line) if hasattr(net,'line') else 0}")
        summary.append(f"Transformadores: {len(net.trafo) if hasattr(net,'trafo') else 0}")
        summary.append(f"Cargas: {len(net.load) if hasattr(net,'load') else 0}")
        summary.append(f"Geradores: {len(net.gen) if hasattr(net,'gen') else 0}")
        summary_html = "<p>" + " | ".join(summary) + "</p>"
    except Exception as e:
        summary_html = f"<p>Erro resumindo rede: {e}</p>"

    # carregar dados excel (opcional) e transformar em HTML
    tables_html = ""
    if data_path and os.path.exists(data_path):
        try:
            xls = pd.ExcelFile(data_path)
            for sheet in xls.sheet_names:
                df = pd.read_excel(xls, sheet)
                df2 = df.fillna("N/A").astype(str)
                tables_html += f"<h3>{sheet}</h3>\n"
                tables_html += df2.to_html(classes='table table-sm', index=False, escape=True)
            log(f"Excel {data_path} convertido para HTML.")
        except Exception as e:
            log(f"Erro lendo Excel: {e}")
            tables_html = f"<p>Erro lendo Excel: {e}</p>"
    else:
        tables_html = "<p>Nenhum arquivo Excel fornecido.</p>"

    # montar HTML final injetando no template
    try:
        out = template
        out = out.replace("{{GEN_TIME}}", datetime.now().isoformat())
        out = out.replace("{{NET_SUMMARY}}", summary_html)
        out = out.replace("{{PLOTLY_PLOT}}", plot_html)
        out = out.replace("{{TABLES}}", tables_html)
        log("Template preenchido com sucesso.")
        return Response(out, mimetype="text/html")
    except Exception as e:
        tb = traceback.format_exc()
        log(f"Erro ao preencher template: {e}\n{tb}")
        return abort(500, f"Erro ao preencher template: {e}")

def run_flask(host=DEFAULT_HOST, port=DEFAULT_PORT, debug=False):
    # roda o Flask (bloqueante)
    app.run(host=host, port=port, debug=debug, threaded=True)

class FlaskServer:
    def __init__(self, host=DEFAULT_HOST, port=DEFAULT_PORT):
        self.host = host
        self.port = port
        self._thread = None

    def start_in_thread(self):
        if self._thread and self._thread.is_alive():
            print("Flask already running.")
            return
        self._thread = Thread(target=run_flask, args=(self.host, self.port, False), daemon=True)
        self._thread.start()
        print(f"Flask server started in thread on http://{self.host}:{self.port}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Flask backend para relatorio Pandapower")
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    args = parser.parse_args()
    print("Iniciando Flask (diretamente). Template:", TEMPLATE_PATH)
    run_flask(host=args.host, port=args.port)
