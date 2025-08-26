from tkinter import *
from tkinter import filedialog, messagebox
import pandas as pd

import os

class Variavel():
    def __init__(self, nome=''):
        self._nome = nome
        self.valores = []

    def SetNome(self, nome):
        self._nome = nome

    def GetNome(self):
        return self._nome
    
def ConvertePLTParaDF(arqv):
    content = ""
    valores_temp = []
    index_var = 0
    n_vars = 9999

    plt = open(arqv,'r')
    content = plt.readlines()
    n_linhas = len(content)
    
    for i in range(n_linhas):
        linha = content[i]

        # Primeira linha do plot contém o número total de variáveis
        if i == 0:
            valor_str = linha.strip()
            n_vars = int(valor_str)
            variaveis = [Variavel() for _ in range(n_vars)]
        # Linhas entre 1 e n_Vars contém os nomes das variáveis 
        elif i < n_vars+1:
            valor_str = linha.strip()
            variaveis[index_var].SetNome(valor_str)
            index_var = index_var + 1
        # Demais linhas contém os valores
        else:
            valor_str = linha.strip()
            valores_temp.extend(valor_str.split())

    # Fechar arquivo (leitura terminada)
    plt.close()

    # Preencher valores das variáveis com os valores_temp
    i_var = 0
    for j in range(len(valores_temp)):
        variaveis[i_var].valores.append(float(valores_temp[j]))
        if i_var < n_vars-1:
            i_var = i_var + 1
        else:
            i_var = 0    

    # Passar da estrutura de dados de classes para o DataFrame
    df = pd.DataFrame({var.GetNome(): var.valores for var in variaveis})
    
    return df

# ---------- SCRIPT PRINCIPAL ----------------------------------------------------------------------------

arqv = filedialog.askopenfilename(title='Selecione o arquivo plot', filetypes=[('Arquivo Plot', '*.plt')])

if os.path.isfile(arqv):
    
    df = ConvertePLTParaDF(arqv)

    dir = os.path.split(arqv)[0]
    nome_arqv = os.path.splitext(os.path.basename(arqv))[0]
    arqv_resultado = filedialog.asksaveasfilename(title='Arquivo de saída', initialfile=nome_arqv,
                                                  defaultextension ='.xlsx', filetypes=[('Arquivo Excel', '*.xlsx')])

    if arqv_resultado:
        # Está retornando um arquivo corrompido --------------------
        # # Writer do pandas
        # writer = pd.ExcelWriter(arqv_resultado, engine="xlsxwriter")
        # # Escreve o Arquivo
        # df.to_excel(writer, sheet_name="Valores", float_format="%.5f", index=False)
        # worksheet = writer.sheets["Valores"]
        # # Dimensões do data frame
        # (max_row, max_col) = df.shape
        # # Make the columns wider for clarity.
        # worksheet.set_column(0, max_col - 1, 12)
        # # Filtros.
        # worksheet.autofilter(0, 0, max_row, max_col - 1)

        df.to_excel(arqv_resultado, sheet_name="Valores", float_format="%.5f", index=False)
        messagebox.showinfo(message='Arquivo gerado com sucesso!')