import streamlit as st
from mvc.controller import PDFController
from mvc.components import tab_extract_text, tab_extract_text_ocr, tab_extract_tables, read_must_tables_page
from pdf2image import convert_from_path
from PyPDF2 import PdfReader
import os
import camelot

def DashboardONS():
    st.set_page_config(layout="wide", page_icon="📄", page_title="Dashboard ONS", initial_sidebar_state="expanded")
    st.title("📄 Dashboard ONS")

    # Sidebar configuration
    uploaded_file = st.sidebar.file_uploader("Escolha um arquivo PDF", type="pdf")

    if uploaded_file:
        # Salva o arquivo temporariamente
        temp_pdf_path = os.path.join(os.getcwd(), "temp_uploaded_file.pdf")
        with open(temp_pdf_path, "wb") as f:
            f.write(uploaded_file.getvalue())

        controller = PDFController(temp_pdf_path)

        # --- Análise e Visualização Automática na Sidebar ---
        with st.sidebar:
            with st.spinner("Analisando documento..."):
                try:
                    # Conta páginas
                    reader = PdfReader(temp_pdf_path)
                    num_pages = len(reader.pages)
                    st.info(f"Total de páginas: {num_pages}")

                    # Conta tabelas
                    tables = camelot.read_pdf(temp_pdf_path, pages='all', flavor='lattice')
                    st.info(f"Tabelas encontradas: {len(tables)}")

                except Exception as e:
                    st.error(f"Erro na análise: {e}")
                    num_pages = 0

            # Renderiza todas as páginas
            if num_pages > 0:
                st.subheader("Visualização do PDF")
                with st.spinner("Renderizando páginas..."):
                    try:
                        images = convert_from_path(temp_pdf_path)
                        for i, image in enumerate(images):
                            st.image(image, caption=f"Página {i + 1}", use_column_width=True)
                    except Exception as e:
                        st.error(f"Erro ao renderizar o PDF: {e}\n\nCertifique-se de que o Poppler está instalado e no PATH do sistema.")

        pages = st.text_input("Páginas para extração (ex: 1-3,5 ou 'all')", value='all')

        # Tabs for functionalities
        tab1, tab2, tab3, tab4 = st.tabs([
            "📂 Funcionalidades",
            "📄 Extrair Texto (PyPDF2)", 
            "👁️ Extrair Texto (OCR)", 
            "📊 Extrair Tabelas (Camelot)",
        ])

        with tab1:
            read_must_tables_page(controller, pages)

        with tab2:
            tab_extract_text(controller, pages)

        with tab3:
            tab_extract_text_ocr(controller)

        with tab4:
            tab_extract_tables(controller, pages)

            

DashboardONS()