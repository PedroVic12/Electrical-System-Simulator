import pandas as pd

#projeto ciencia de dados


# projeto de modelagem em pandapower

# pipeline de addos para criar um website com entrada de dados de execel do SIN
nome_aba = ["R_REDESPACHO", "C_Controle_de_Casos", "DBSH","C_Mapa"]
path_planilha = r"C:\Users\pedrovictor.veras\OneDrive - Operador Nacional do Sistema Eletrico\Documentos\ESTAGIO ONS PVRV 2025\GitHub\Electrical-System-Simulator\backend\database\FLOW_ONS_geracao_despacho_SIN.xlsm"
SIN_df = pd.read_excel(path_planilha,
                       sheet_name=nome_aba[0],  skiprows=5, engine='openpyxl')
print(SIN_df.columns)
# Exibir as primeiras linhas do DataFrame
print(SIN_df.head())