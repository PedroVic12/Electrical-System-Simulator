import pandas as pd
import numpy as np
from typing import Union, Dict, List, Optional
import re
import sqlite3
from pathlib import Path

class DataFrameController:
    """Controller for handling data loading and cleaning for power system data."""
    
    @staticmethod
    def load_file(file_path: str) -> pd.DataFrame:
        """Load data from Excel, TXT, or SQL file."""
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
            
        if file_path.suffix.lower() == '.xlsx':
            return pd.read_excel(file_path)
        elif file_path.suffix.lower() == '.txt':
            return DataFrameController._load_txt_file(file_path)
        elif file_path.suffix.lower() == '.db' or file_path.suffix.lower() == '.sqlite':
            return DataFrameController._load_sql_file(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_path.suffix}")
    
    @staticmethod
    def _load_txt_file(file_path: Path) -> pd.DataFrame:
        """Load data from a text file with space/tab delimiters."""
        # Try to detect the best separator
        with open(file_path, 'r') as f:
            first_line = f.readline()
            
        # Count number of spaces and tabs in first line
        space_count = first_line.count(' ')
        tab_count = first_line.count('\t')
        
        # Use tab if there are tabs, otherwise use space
        sep = '\t' if tab_count > space_count else r'\s+'
        
        # Read the file with the detected separator
        return pd.read_csv(file_path, sep=sep, engine='python')
    
    @staticmethod
    def _load_sql_file(file_path: Path, table_name: Optional[str] = None) -> pd.DataFrame:
        """Load data from SQLite database."""
        conn = sqlite3.connect(file_path)
        
        # If table_name is not provided, get the first table
        if table_name is None:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            if not tables:
                raise ValueError("No tables found in the database")
            table_name = tables[0][0]
        
        query = f"SELECT * FROM {table_name}"
        return pd.read_sql_query(query, conn)
    
    @staticmethod
    def clean_power_system_data(df: pd.DataFrame) -> pd.DataFrame:
        """Clean and standardize power system data."""
        # Make a copy to avoid modifying the original
        df_clean = df.copy()
        
        # Convert column names to lowercase and strip whitespace
        df_clean.columns = df_clean.columns.str.lower().str.strip()
        
        # Remove empty rows and columns
        df_clean = df_clean.dropna(how='all').dropna(axis=1, how='all')
        
        # Convert numeric columns to appropriate types
        for col in df_clean.select_dtypes(include=['object']).columns:
            # Try to convert to numeric, coerce errors to NaN
            numeric_col = pd.to_numeric(df_clean[col], errors='coerce')
            if not numeric_col.isna().all():  # If conversion worked for at least some values
                df_clean[col] = numeric_col
        
        # Standardize missing value representations
        df_clean = df_clean.replace(['', 'NA', 'N/A', 'NaN', 'nan', 'None'], np.nan)
        
        return df_clean
    
    @staticmethod
    def extract_bus_voltages(df: pd.DataFrame) -> Dict[int, float]:
        """Extract bus voltage mapping from the dataframe."""
        bus_voltages = {}
        
        # Check for common column naming patterns
        voltage_cols = [col for col in df.columns if any(term in col.lower() for term in ['v_kv', 'voltage', 'vbase', 'basekv'])]
        bus_cols = [col for col in df.columns if any(term in col.lower() for term in ['bus', 'node', 'number'])]
        
        if voltage_cols and bus_cols:
            voltage_col = voltage_cols[0]
            bus_col = bus_cols[0]
            
            for _, row in df.iterrows():
                try:
                    bus_num = int(row[bus_col])
                    voltage = float(row[voltage_col])
                    bus_voltages[bus_num] = voltage
                except (ValueError, TypeError):
                    continue
        
        return bus_voltages
