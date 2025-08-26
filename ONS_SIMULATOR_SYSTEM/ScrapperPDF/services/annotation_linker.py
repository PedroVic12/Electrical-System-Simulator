# -*- coding: utf-8 -*-
import re
import pandas as pd
from .pdf_processor import PDFProcessor

class AnnotationLinker:
    """
    Classe responsável por vincular anotações a linhas de dados extraídas de PDFs.
    """

    def __init__(self, raw_text: str):
        self.raw_text = raw_text

        # Definição de expressões regulares
        self.table_regex = re.compile(r'Tabela\s+([0-9A-Z.]+)\s*-\s*(.*)')
        self.annotation_regex = re.compile(r'^\s*\(([A-Z])\)\s*-\s*(.*)')
        self.row_start_regex = re.compile(r'^(SP[A-Z0-9\s-]+(?:--?[A-Z])?)\s+.*')
        self.data_row_regex = re.compile(
            r'^(?P<cod_ons>SP[A-Z0-9\s-]+(?:--?[A-Z])?)\s+'  # Captura o Cód ONS
            r'(?P<instalacao>.*?)\s+'                          # Captura a Instalação
            r'(?P<tensao>\d{2,3})\s+'                        # Captura a Tensão
            r'(?P<de>\d{1,2}/[A-Za-z]{3})\s+'                # Captura a data de início
            r'(?P<ate>\d{1,2}/[A-Za-z]{3})\s+'               # Captura a data de fim
            r'(?P<must_data>.*)'                               # Captura os dados MUST
        )

    def link_annotations(self) -> pd.DataFrame:
        """
        Vincula anotações às linhas de dados extraídas do texto bruto do PDF.

        Returns:
            pd.DataFrame: DataFrame contendo os vínculos entre códigos ONS e anotações.
        """
        print("🔍 Vinculando anotações aos códigos ONS...")
        lines = self.raw_text.split('\n')
        all_linked_data = []

        table_starts = [i for i, line in enumerate(lines) if self.table_regex.search(line)]

        if not table_starts:
            print("🔴 Nenhuma tabela no formato 'Tabela XX - ...' foi encontrada.")
            return pd.DataFrame()

        for i, start_index in enumerate(table_starts):
            end_index = table_starts[i + 1] if i + 1 < len(table_starts) else len(lines)
            block_lines = lines[start_index:end_index]

            table_match = self.table_regex.search(block_lines[0])
            table_number = table_match.group(1)
            table_title = table_match.group(2).strip()
            print(f"\n  -> Processando Tabela {table_number}: {table_title}")
            print(table_number, type(table_number))

                # critério de parada ANTES de extrair anotações
            if table_number != "01":
                print("⏹️ Ignorando porque só queremos a Tabela 1.")
                break


            annotations_map = self._extract_annotations_from_block(block_lines)
            if not annotations_map:
                print("    - Nenhuma definição de anotação encontrada para esta tabela.")
                continue

            processed_lines = self._merge_wrapped_data_lines(block_lines)

            for line in processed_lines:
                match = self.data_row_regex.match(line)

                if match:
                    data = match.groupdict()
                    cod_ons = data['cod_ons']
                    instalacao = data['instalacao'].strip()
                    must_data = data['must_data']

                    found_letters = set(re.findall(r'\(([A-Z])\)', must_data))

                    if found_letters:
                        for letter in sorted(list(found_letters)):
                            if letter in annotations_map:
                                all_linked_data.append({
                                    "Num_Tabela": table_number,
                                    "Cód ONS": cod_ons,
                                    "Instalação": instalacao,
                                    "Letra": letter,
                                    "Anotacao": annotations_map[letter]
                                })

        if not all_linked_data:
            print("\n🔴 Nenhuma anotação foi encontrada dentro das colunas de dados das tabelas.")
            return pd.DataFrame()

        print(f"\n📊 {len(all_linked_data)} vínculos entre Cód ONS e anotações foram criados.")
        return pd.DataFrame(all_linked_data)

    def _merge_wrapped_data_lines(self, block_lines: list) -> list:
        """
        Junta linhas de dados que foram quebradas no PDF.
        """
        merged_lines = []
        i = 0
        while i < len(block_lines):
            line = block_lines[i].strip()
            if self.row_start_regex.match(line):
                j = i + 1
                while j < len(block_lines):
                    next_line = block_lines[j].strip()
                    if next_line and not any([
                        self.table_regex.search(next_line),
                        self.annotation_regex.match(next_line),
                        self.row_start_regex.match(next_line)
                    ]):
                        line += " " + next_line
                        j += 1
                    else:
                        break
                merged_lines.append(line)
                i = j
            else:
                i += 1
        return merged_lines

    def _extract_annotations_from_block(self, block_lines: list) -> dict:
        """
        Extrai anotações de um bloco de texto.

        Returns:
            dict: Mapeamento de letras de anotações para seus textos completos.
        """
        annotations = {}
        i = 0
        while i < len(block_lines):
            line = block_lines[i].strip()
            match = self.annotation_regex.match(line)
            if match:
                letter = match.group(1)
                text = match.group(2).strip()

                j = i + 1
                while j < len(block_lines):
                    next_line = block_lines[j].strip()
                    if next_line and not self.annotation_regex.match(next_line):
                        text += " " + next_line
                        j += 1
                    else:
                        break
                annotations[letter] = text
                i = j
            else:
                i += 1
        return annotations
