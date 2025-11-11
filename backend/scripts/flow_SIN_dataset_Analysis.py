import pandas as pd

#projeto ciencia de dados


# projeto de modelagem em pandapower

# pipeline de addos para criar um website com entrada de dados de execel do SIN
nome_aba = ["R_REDESPACHO", "C_Controle_de_Casos", "DBSH","C_Mapa"]
path_planilha = r"C:\Users\pedrovictor.veras\OneDrive - Operador Nacional do Sistema Eletrico\Documentos\ESTAGIO ONS PVRV 2025\GitHub\Electrical-System-Simulator\backend\database\FLOW_ONS_geracao_despacho_SIN.xlsm"
SIN_df = pd.read_excel(path_planilha,
                       sheet_name=nome_aba[0],  skiprows=5, engine='openpyxl')

# Dados da minha tabela
print(SIN_df.columns)
print(len(SIN_df.columns))

# fatiamento do dataframe
SIN_df = SIN_df.iloc[:, 0:33]  # Seleciona as primeiras 33 colunas
#SIN_df = SIN_df.dropna(axis=0, how='all')  # Remove linhas que estão completamente vazias

# Exibir as primeiras linhas do DataFrame
print(SIN_df.head())

#exporta o dataset do SIN
SIN_df.to_excel(
    "./SIN_dataset.xlsx",
    index=False,
    sheet_name="Usinas",
    engine='openpyxl'
    
)

