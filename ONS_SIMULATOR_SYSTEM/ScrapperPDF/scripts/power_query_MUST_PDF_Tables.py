# -*- coding: utf-8 -*-
import pandas as pd
import re
import camelot
import os
from rich.console import Console
from rich.theme import Theme

class Logger:
    """Classe para fornecer logs coloridos e formatados no console."""
    def __init__(self):
        self.console = Console(theme=Theme({
            "success": "bold green",
            "warning": "yellow",
            "error": "bold red",
            "info": "cyan",
            "step": "bold magenta"
        }))

    def log(self, message, level="info"):
        """Registra uma mensagem com o nível e a cor especificados."""
        self.console.print(f"[{level}]{message}[/]")

# Cria uma instância global do Logger para ser usada como console.log
console = Logger()

class MiniPowerQuery:
    """
    Classe para extrair, transformar e consolidar dados de tabelas MUST de arquivos PDF.
    Versão modificada para capturar dados diretos com separação de anotações (A-Z).
    """

    def __init__(self):
        self.final_df = pd.DataFrame()
        self.console = console

    def read_must_tables(self, pdf_path: str, pages: str = 'all'):
        """
        Função principal que orquestra a extração, processamento e
        consolidação de todas as tabelas MUST de um arquivo PDF.
        """
        self.final_df = pd.DataFrame()
        self.console.log(f"Iniciando processamento do arquivo: {os.path.basename(pdf_path)}", "step")
        self.console.log(f"📖 Extraindo todas as tabelas das páginas: {pages}", "info")
        
        try:
            tables = camelot.read_pdf(pdf_path, pages=pages, flavor='lattice')
            self.console.log(f"✅ {len(tables)} tabelas encontradas no intervalo especificado.", "success")
        except Exception as e:
            self.console.log(f"Erro ao extrair tabelas com Camelot: {e}", "error")
            return self

        if not tables:
            self.console.log("Nenhuma tabela encontrada para processar.", "warning")
            return self

        all_processed_tables = []
        
        for i, table in enumerate(tables):
            temp_df = table.df
            is_must_table = any("MUST" in str(cell).upper() for _, row in temp_df.head(5).iterrows() for cell in row)
            
            if not is_must_table:
                self.console.log(f"  -> Ignorando Tabela {i+1} (Página: {table.page}) - não é uma tabela MUST.", "warning")
                continue

            self.console.log(f"  -> Processando Tabela {i+1} (Página: {table.page})...", "info")
            processed_df = self._process_must_table_direct(temp_df, i+1)

            if not processed_df.empty:
                self.console.log(f"    -> Tabela processada resultou em: {processed_df.shape[0]} linhas x {processed_df.shape[1]} colunas", "info")
                all_processed_tables.append(processed_df)
                break  # <<< para logo após a primeira tabela válida
            else:
                self.console.log(f"    -> Nenhuma linha de dados válida na Tabela {i+1}. Não é uma tabela MUST", "warning")


        if not all_processed_tables:
            self.console.log("Nenhuma tabela MUST válida foi encontrada após o processamento.", "warning")
            return self

        self.final_df = pd.concat(all_processed_tables, ignore_index=True)
        
        self.console.log("Processamento de todas as tabelas concluído!", "step")
        self.console.log(f"\n📊 DataFrame final consolidado: {self.final_df.shape[0]} linhas x {self.final_df.shape[1]} colunas", "success")
        print("\n")
        
        return self

    def _process_must_table_direct(self, df: pd.DataFrame, table_number: int) -> pd.DataFrame:
        """
        Processa tabela MUST extraindo dados e separando anotações por delimitador de letras (A-Z),
        ignorando a coluna de instalação.
        """
        self.console.log("    -> Processando tabela MUST com separação de anotações", "info")
        
        # Força todas das colunas como texto
        df_texto = df.astype(str).replace('nan', '').replace('', '')
        
        if len(df_texto) < 3:
            self.console.log("    -> ERRO: Tabela tem menos de 3 linhas", "error")
            return pd.DataFrame()

        # Encontra linha com headers (procura por "MUST" ou anos)
        header_row_idx = None
        for idx, row in df_texto.iterrows():
            row_text = ' '.join(row.astype(str)).upper()
            if 'MUST' in row_text and ('2025' in row_text or '2026' in row_text or '2027' in row_text or '2028' in row_text):
                header_row_idx = idx
                break
        
        if header_row_idx is None:
            self.console.log("    -> ERRO: Não foi possível identificar linha de headers", "error")
            return pd.DataFrame()

        # Identifica estrutura das colunas baseada nos headers
        column_mapping = self._identify_must_columns(df_texto, header_row_idx)
        
        if not column_mapping:
            self.console.log("    -> ERRO: Não foi possível mapear as colunas MUST", "error")
            return pd.DataFrame()

        # Extrai dados das linhas após o header
        data_rows = df_texto.iloc[header_row_idx + 1:].reset_index(drop=True)
        
        # Filtra apenas linhas que começam com código ONS
        valid_rows = []
        for _, row in data_rows.iterrows():
            first_col = str(row.iloc[0]).strip()
            if re.match(r'^SP[A-Z0-9\-]+', first_col):
                valid_rows.append(row)
        
        if not valid_rows:
            self.console.log("    -> Nenhuma linha válida com código ONS encontrada", "warning")
            return pd.DataFrame()

        # Constrói DataFrame final
        result_data = []
        
        for row in valid_rows:
            # Extrai tensão de forma mais robusta
            tensao_value = self._extract_tensao_safely(row, column_mapping)
            
            row_dict = {
                'num_tabela': table_number,
                'Cód ONS': str(row.iloc[column_mapping.get('cod_ons', 0)]).strip(),
                'Tensão (kV)': tensao_value,
                'De': str(row.iloc[column_mapping.get('de', 3)]).strip(),
                'Até': str(row.iloc[column_mapping.get('ate', 4)]).strip()
            }
            
            # Extrai dados de cada ano com separação de anotações
            years = ['2025', '2026', '2027', '2028']
            for year in years:
                ponta_col = column_mapping.get(f'ponta_{year}')
                fora_ponta_col = column_mapping.get(f'fora_ponta_{year}')
                
                if ponta_col is not None and ponta_col < len(row):
                    ponta_full = str(row.iloc[ponta_col]).strip()
                    ponta_valor, ponta_anotacao = self._separate_value_annotation(ponta_full)
                    row_dict[f'Ponta {year} Valor'] = ponta_valor
                    row_dict[f'Ponta {year} Anotacao'] = ponta_anotacao
                
                if fora_ponta_col is not None and fora_ponta_col < len(row):
                    fora_ponta_full = str(row.iloc[fora_ponta_col]).strip()
                    fora_ponta_valor, fora_ponta_anotacao = self._separate_value_annotation(fora_ponta_full)
                    row_dict[f'Fora Ponta {year} Valor'] = fora_ponta_valor
                    row_dict[f'Fora Ponta {year} Anotacao'] = fora_ponta_anotacao
            
            result_data.append(row_dict)
        
        result_df = pd.DataFrame(result_data)
        
        self.console.log(f"    -> Extraídas {len(result_df)} linhas de dados", "info")
        
        return result_df

    def _separate_value_annotation(self, text: str) -> tuple:
        """
        Separa valor e anotação de um texto, onde anotação são letras entre parênteses.
        Ex: '47,000(B)' -> ('47,000', 'B')
        """
        text = str(text).strip()
        if not text or text == '' or text == 'nan':
            return ('', '')
        
        # Procura por letras entre parênteses no final
        match = re.search(r'^(.*?)\(([A-Z]+)\)$', text)
        if match:
            valor = match.group(1).strip()
            anotacao = match.group(2).strip()
            return (valor, anotacao)
        else:
            # Se não tem anotação, retorna o valor completo e anotação vazia
            return (text, '')
    
    def _extract_tensao_safely(self, row: pd.Series, column_mapping: dict) -> str:
        """
        Extrai o valor de tensão de forma mais robusta, procurando em múltiplas colunas se necessário.
        """
        tensao_col = column_mapping.get('tensao', 2)
        
        # Tenta extrair da coluna mapeada
        if tensao_col < len(row):
            tensao_value = str(row.iloc[tensao_col]).strip()
            
            # Se encontrou um número, retorna
            if re.search(r'\d+', tensao_value):
                # Extrai apenas números
                numbers = re.findall(r'\d+', tensao_value)
                if numbers:
                    return numbers[0]
        
        # Se não encontrou na coluna mapeada, procura nas próximas colunas
        for col_idx in range(min(len(row), 5)):  # Procura nas primeiras 5 colunas
            cell_value = str(row.iloc[col_idx]).strip().upper()
            # Procura por padrões de tensão
            if 'KV' in cell_value or any(tension in cell_value for tension in ['138', '230', '88', '500']):
                numbers = re.findall(r'\d+', cell_value)
                if numbers:
                    return numbers[0]
        
        return ''

    def _identify_must_columns(self, df: pd.DataFrame, header_row_idx: int) -> dict:
        """
        Identifica e mapeia as colunas da tabela MUST baseado no conteúdo dos headers.
        Ignora a coluna de instalação.
        """
        column_mapping = {}
        
        # Analisa algumas linhas para encontrar padrões
        analysis_rows = df.iloc[max(0, header_row_idx-1):header_row_idx+3]
        
        for col_idx in range(len(df.columns)):
            col_content = []
            for _, row in analysis_rows.iterrows():
                if col_idx < len(row):
                    col_content.append(str(row.iloc[col_idx]).upper().strip())
            
            col_text = ' '.join(col_content)
            
            # Mapeia colunas básicas (IGNORA INSTALAÇÃO)
            if any(pattern in col_text for pattern in ['COD', 'ONS', 'SP']):
                column_mapping['cod_ons'] = col_idx
            elif any(pattern in col_text for pattern in ['TENSÃO', 'TENSAO', 'KV']) and 'INSTALACAO' not in col_text:
                column_mapping['tensao'] = col_idx
            elif 'DE' in col_text and any(month in col_text for month in ['JAN', 'JANEIRO']):
                column_mapping['de'] = col_idx
            elif 'ATÉ' in col_text or ('ATE' in col_text and any(month in col_text for month in ['DEZ', 'DEZEMBRO'])):
                column_mapping['ate'] = col_idx
            
            # Mapeia colunas de dados por ano
            for year in ['2025', '2026', '2027', '2028']:
                if year in col_text:
                    if 'PONTA' in col_text and 'FORA' not in col_text:
                        column_mapping[f'ponta_{year}'] = col_idx
                    elif 'FORA' in col_text and 'PONTA' in col_text:
                        column_mapping[f'fora_ponta_{year}'] = col_idx
        
        # Se não encontrou todas as colunas básicas, tenta inferir pela posição
        if 'cod_ons' not in column_mapping:
            column_mapping['cod_ons'] = 0
        
        if 'tensao' not in column_mapping:
            # Procura por coluna com números típicos de tensão
            for col_idx in range(min(len(df.columns), 5)):
                if header_row_idx + 1 < len(df):
                    sample_values = df.iloc[header_row_idx+1:min(header_row_idx+5, len(df)), col_idx].astype(str)
                    for val in sample_values:
                        if any(tension in str(val) for tension in ['138', '230', '88', '500']):
                            column_mapping['tensao'] = col_idx
                            break
                    if 'tensao' in column_mapping:
                        break
            if 'tensao' not in column_mapping:
                column_mapping['tensao'] = 2
        
        if 'de' not in column_mapping:
            column_mapping['de'] = 3
        if 'ate' not in column_mapping:
            column_mapping['ate'] = 4
        
        # Para os dados MUST, assume que começam após as colunas básicas
        data_start_col = 5
        years = ['2025', '2026', '2027', '2028']
        
        for i, year in enumerate(years):
            if f'ponta_{year}' not in column_mapping:
                column_mapping[f'ponta_{year}'] = data_start_col + (i * 2)
            if f'fora_ponta_{year}' not in column_mapping:
                column_mapping[f'fora_ponta_{year}'] = data_start_col + (i * 2) + 1
        
        #self.console.log(f"    -> Mapeamento de colunas: {column_mapping}", "info")
        
        return column_mapping

    def trim_spaces(self):
        """Remove espaços em branco de todas as células de texto."""
        if not self.final_df.empty:
            self.console.log("Removendo espaços em branco...", "info")
            self.final_df = self.final_df.map(lambda x: x.strip() if isinstance(x, str) else x)
        return self

    def drop_duplicates(self):
        """Remove linhas duplicadas."""
        if not self.final_df.empty:
            linhas_antes = len(self.final_df)
            self.final_df = self.final_df.drop_duplicates()
            linhas_depois = len(self.final_df)
            if linhas_antes != linhas_depois:
                self.console.log(f"Removidas {linhas_antes - linhas_depois} linhas duplicadas", "info")
        return self
        
    def preview(self, n: int = 10):
        """Exibe uma prévia dos dados processados."""
        self.console.log(f"📋 Preview do DataFrame final ({n} primeiras linhas):", "step")
        if self.final_df.empty:
            self.console.log("DataFrame está vazio.", "warning")
        else:
            with pd.option_context('display.max_rows', None, 'display.max_columns', None, 'display.width', None):
                print(self.final_df.head(n).to_string())
        return self

    def export_excel(self, output_path: str):
        """Exporta os dados para a planilha Excel."""
        if self.final_df.empty:
            self.console.log("Nenhum dado para exportar.", "warning")
            return self
        
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)

        self.final_df.to_excel(output_path, index=False)
        self.console.log(f"📁 Arquivo Excel salvo em: {output_path}", "success")
        return self
    
    def run_single_mode(self, input_folder, output_folder, file_name, page_range):
        """Executa o processo para um único arquivo usando a instância fornecida."""
        pdf_path = os.path.join(input_folder, file_name)
        if not os.path.exists(pdf_path):
            console.log(f"ERRO: Arquivo '{file_name}' não encontrado.", "error")
            return

        output_file = os.path.join(output_folder, f"saida_{os.path.splitext(file_name)[0]}.xlsx")
        (self.read_must_tables(pdf_path, pages=page_range)
        .trim_spaces().drop_duplicates().preview(2).export_excel(output_file))

    def consolidar_tabela_final(self, output_folder, output_filename="database_must.xlsx"):
        """
        Consolida todas as abas do arquivo Excel gerado pelo run_folder_mode
        em um único DataFrame com uma coluna adicional 'EMPRESA'.
        """
        # Caminho do arquivo gerado pelo run_folder_mode
        input_excel_path = os.path.join(output_folder, "resultado_tabelas_MUST_ONS.xlsx")
        
        if not os.path.exists(input_excel_path):
            self.console.log(f"Arquivo de entrada não encontrado: {input_excel_path}", "error")
            return
        
        try:
            # Ler todas as abas do arquivo Excel
            all_sheets = pd.read_excel(input_excel_path, sheet_name=None)
            
            # Lista para armazenar todos os DataFrames com a coluna EMPRESA
            consolidated_dfs = []
            empresas = set()
            
            # Processar cada aba
            for sheet_name, df in all_sheets.items():
                # Extrair nome da empresa do nome da aba
                empresa = self._extrair_empresa_da_aba(sheet_name)
                empresas.add(empresa)
                
                # Adicionar coluna EMPRESA ao DataFrame
                df_copy = df.copy()
                df_copy.insert(0, "EMPRESA", empresa)
                
                consolidated_dfs.append(df_copy)
            
            # Concatenar todos os DataFrames
            final_consolidated_df = pd.concat(consolidated_dfs, ignore_index=True)
            
            # Salvar o resultado consolidado
            output_path = os.path.join(output_folder, output_filename)
            with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
                final_consolidated_df.to_excel(writer, sheet_name="Tabelas Consolidada", index=False)
                
                # Adicionar aba com lista de empresas
                pd.DataFrame({"Empresas": sorted(empresas)}).to_excel(writer, sheet_name="Empresas", index=False)
            
            self.console.log(f"\n✅ Consolidação final concluída: {output_path}", "success")
            self.console.log(f"🔎 {len(empresas)} empresas identificadas: {sorted(empresas)}", "info")
            
            return final_consolidated_df
            
        except Exception as e:
            self.console.log(f"Erro ao consolidar tabelas: {e}", "error")
            return pd.DataFrame()

    def _extrair_empresa_da_aba(self, sheet_name: str) -> str:
        """
        Extrai o nome da empresa a partir do nome da aba.
        Exemplo: "sheet_SUL SUDESTE" -> "SUL SUDESTE"
        """
        # Remove o prefixo "sheet_"
        if sheet_name.startswith("sheet_"):
            empresa = sheet_name[6:]
        else:
            empresa = sheet_name
        
        return empresa.strip().upper()
    
    def run_folder_mode(self, input_folder, output_folder, mapeamento):
        """Executa o processo para uma pasta, salvando em abas de um único Excel."""
        all_company_data = {}
        for pdf_file, page_range in mapeamento.items():
            pdf_path = os.path.join(input_folder, pdf_file)
            if not os.path.exists(pdf_path):
                console.log(f"AVISO: Arquivo '{pdf_file}' não encontrado, pulando.", "warning")
                continue
                
            (self.read_must_tables(pdf_path, pages=page_range)
            .trim_spaces().drop_duplicates())
            
            if not self.final_df.empty:
                company_name = get_company_name_from_filename(pdf_file)
                all_company_data[company_name] = self.final_df.copy()
        
        if all_company_data:
            output_excel_path = os.path.join(output_folder, "resultado_tabelas_MUST_ONS.xlsx")
            with pd.ExcelWriter(output_excel_path, engine='xlsxwriter') as writer:
                for company_name, df in all_company_data.items():
                    sheet_name = f"sheet_{company_name}"[:31]
                    df.to_excel(writer, sheet_name=sheet_name, index=False)
            console.log(f"\n\n📁 Arquivo consolidado salvo em:\n{output_excel_path}", "success")

            # Agora consolide todas as abas em um único DataFrame com coluna EMPRESA
            self.consolidar_tabela_final(output_folder)

def get_company_name_from_filename(filename: str) -> str:
    """Extrai um nome limpo de empresa do nome do arquivo."""
    # Remove a extensão .pdf
    name = os.path.splitext(filename)[0]
    
    # Remove o prefixo CUST-XXXX-XXX-XX (com variações de hífen, espaço, underscore)
    name = re.sub(r'^CUST-\d{4}-\d{2,4}-\d{2,3}[\s_-]*', '', name, flags=re.IGNORECASE)
    
    # Remove qualquer texto após palavras-chave como minuta, recon, final, etc.
    name = re.split(r'[\s_-]*(?:minuta|recon|final|202[0-9])[\s_-]*', name, flags=re.IGNORECASE)[0]
    
    # Remove qualquer caractere especial restante (underscores, hífens) e espaços extras
    name = re.sub(r'[_\s]+', ' ', name).strip()
    
    return name.upper()

power_query = MiniPowerQuery()

def run_automation(mode = "single" ):
    """Função principal para iniciar o processo de extração de tabelas MUST de PDFs."""
    

    input_folder = r"C:\Users\pedrovictor.veras\OneDrive - Operador Nacional do Sistema Eletrico\Documentos\ESTAGIO_ONS_PVRV_2025\AUTOMACÕES ONS\arquivos"
    output_folder = os.path.join(input_folder, "tabelas_extraidas")
    os.makedirs(output_folder, exist_ok=True)
    
    intervalos_paginas = ["8-16", "8-24", "7-10", "10-32", "7-13", "7-9"]
    single_file_name = "CUST-2002-123-41 - JAGUARI - RECON 2025-2028.pdf"
    
    try:
        pdf_files = sorted([f for f in os.listdir(input_folder) if f.lower().endswith('.pdf')])
        if len(pdf_files) != len(intervalos_paginas):
            console.log("ERRO CRÍTICO: O número de arquivos PDF na pasta não corresponde ao número de intervalos.", "error")
            return
        mapeamento = dict(zip(pdf_files, intervalos_paginas))
        console.log("Mapeamento de arquivos e páginas criado com sucesso.", "success")
    except FileNotFoundError:
        console.log(f"ERRO: A pasta de entrada não foi encontrada: {input_folder}", "error")
        return

    if mode == "single":
        page_range = mapeamento.get(single_file_name)
        if page_range:
           power_query.run_single_mode( input_folder, output_folder, single_file_name, page_range)
        else:
            console.log(f"ERRO: Arquivo '{single_file_name}' não encontrado no mapeamento.", "error")
    elif mode == "folder":
        power_query.run_folder_mode( input_folder, output_folder, mapeamento)

# --- PONTO DE PARTIDA DO SCRIPT ---
#run_automation()