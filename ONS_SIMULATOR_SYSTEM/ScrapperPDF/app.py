from scripts.power_query_MUST_PDF_Tables import power_query, console
from scripts.script_read_text_MUST_PDF import process_PDF_text_folder_pdf, process_PDF_text_single_pdf
import os 


def run_extract_PDF_tables(intervalos_paginas,mode = "folder" ):
 
    
    print("\nIniciando extração de tabelas de PDFs...")

   
    output_folder = os.path.join(input_folder, "tabelas_extraidas")
    os.makedirs(output_folder, exist_ok=True)
    
    
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


def extract_text_from_must_tables(mode = "folder"):

    print("\nIniciando extração de texto dos PDFs MUST...")

    # Pasta para salvar os resultados
    output_folder = os.path.join(input_folder, "anotacoes_extraidas")
    os.makedirs(output_folder, exist_ok=True)

    # Execução
    if mode == "single":
        pdf_path = os.path.join(input_folder, single_file_name)
        if os.path.exists(pdf_path):
            process_PDF_text_single_pdf(pdf_path, output_folder)
        else:
            print(f"ERRO: O arquivo '{single_file_name}' não foi encontrado na pasta de entrada.")

    elif mode == "folder":
        process_PDF_text_folder_pdf(input_folder, output_folder)

    else:
        print(f"ERRO: Modo '{mode}' inválido. Use 'single' ou 'folder'.")

    print("\n🔚 Script concluído.")

# Caminho da pasta contendo os PDFs
#! windows
input_folder = r"C:\Users\pedrovictor.veras\OneDrive - Operador Nacional do Sistema Eletrico\Documentos\ESTAGIO_ONS_PVRV_2025\AUTOMACÕES ONS\arquivos"

#input_folder = r"C:\Users\pedrovictor.veras\OneDrive - Operador Nacional do Sistema Eletrico\Documentos\ESTAGIO_ONS_PVRV_2025\GitHub\Electrical-System-Simulator\ONS_SIMULATOR_SYSTEM\arquivos"

#!Linux
#input_folder = r"/home/pedrov12/Documentos/GitHub/Electrical-System-Simulator/ONS_SIMULATOR_SYSTEM/arquivos"

# Configuração dos arquivos PDF e intervalos de páginas
#! O nome dessa variavel é crucial para o modo "single" nas 2 funções
single_file_name = "CUST-2002-123-41 - JAGUARI - RECON 2025-2028.pdf"

intervalos_paginas = ["8-16", "8-24", "7-10", "10-32", "7-13", "7-9"]

if __name__ == "__main__":

    run_extract_PDF_tables(intervalos_paginas, mode="folder")

    extract_text_from_must_tables(mode ="folder")