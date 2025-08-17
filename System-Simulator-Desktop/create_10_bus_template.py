import pandas as pd
import numpy as np

# Create DataFrames for each component

# Buses
df_buses = pd.DataFrame({
    'name': [f'Bus {i}' for i in range(1, 11)],
    'vn_kv': [20.0] * 10,  # 20kV base voltage
    'type': ['b'] + ['n'] * 9,  # First bus is slack, others are PQ
    'zone': ['Zone1'] * 10,
    'in_service': [True] * 10
})

# Slack bus (reference)
df_buses.loc[0, 'type'] = 'b'  # Slack bus

# Generators (one at bus 1 - slack)
df_generators = pd.DataFrame({
    'name': ['Gen1'],
    'bus': [0],  # Connected to bus 1 (0-indexed)
    'p_mw': [0],  # Will be adjusted by power flow
    'vm_pu': [1.02],  # Voltage setpoint
    'vn_kv': [20.0],
    'min_p_mw': [0],
    'max_p_mw': [100],
    'min_q_mvar': [-50],
    'max_q_mvar': [50],
    'in_service': [True]
})

# Loads (distributed across buses)
df_loads = pd.DataFrame({
    'name': [f'Load{i+1}' for i in range(10)],
    'bus': list(range(10)),  # One load per bus
    'p_mw': np.random.uniform(0.5, 5, 10).round(2),  # 0.5-5 MW per load
    'q_mvar': np.random.uniform(0.1, 1, 10).round(2),  # 0.1-1 MVar per load
    'vn_kv': [20.0] * 10,
    'in_service': [True] * 10
})

# Lines (create a ring topology)
line_data = []
for i in range(9):
    line_data.append({
        'name': f'Line {i+1}-{i+2}',
        'from_bus': i,
        'to_bus': i+1,
        'length_km': 10.0,
        'r_ohm_per_km': 0.2,
        'x_ohm_per_km': 0.4,
        'c_nf_per_km': 10.0,
        'max_i_ka': 0.4,
        'from_vn_kv': 20.0,
        'to_vn_kv': 20.0,
        'in_service': True
    })
# Close the ring
line_data.append({
    'name': 'Line 10-1',
    'from_bus': 9,
    'to_bus': 0,
    'length_km': 10.0,
    'r_ohm_per_km': 0.2,
    'x_ohm_per_km': 0.4,
    'c_nf_per_km': 10.0,
    'max_i_ka': 0.4,
    'from_vn_kv': 20.0,
    'to_vn_kv': 20.0,
    'in_service': True
})
df_lines = pd.DataFrame(line_data)

# Write to Excel
with pd.ExcelWriter('10_bus_network_template.xlsx') as writer:
    df_buses.to_excel(writer, sheet_name='buses', index=False)
    df_generators.to_excel(writer, sheet_name='generators', index=False)
    df_loads.to_excel(writer, sheet_name='loads', index=False)
    df_lines.to_excel(writer, sheet_name='lines', index=False)

print("10-bus network template created: 10_bus_network_template.xlsx")
