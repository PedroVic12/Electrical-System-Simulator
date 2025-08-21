# -*- coding: utf-8 -*-
import streamlit as st
import pandas as pd

class PDFView:
    """
    Classe responsável por gerenciar a interface do usuário com Streamlit.
    """

    @staticmethod
    def display_pdf_details(file_name: str, num_pages: int):
        """
        Exibe os detalhes do PDF na interface.

        Args:
            file_name (str): Nome do arquivo PDF.
            num_pages (int): Número de páginas no PDF.
        """
        st.subheader("Detalhes do PDF")
        st.write(f"**Nome:** {file_name}")
        st.write(f"**Páginas:** {num_pages}")
        st.markdown("---")

    @staticmethod
    def display_extracted_text(text: str):
        """
        Exibe o texto extraído na interface.

        Args:
            text (str): Texto extraído do PDF.
        """
        st.text_area("Texto Extraído", text, height=300)

    @staticmethod
    def display_extracted_tables(tables: list):
        """
        Exibe as tabelas extraídas na interface.

        Args:
            tables (list): Lista de DataFrames com as tabelas extraídas.
        """
        for i, df in enumerate(tables):
            st.write(f"**Tabela {i + 1}**")
            st.dataframe(df)

    @staticmethod
    def display_error(message: str):
        """
        Exibe uma mensagem de erro na interface.

        Args:
            message (str): Mensagem de erro.
        """
        st.error(message)
