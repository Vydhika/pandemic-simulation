import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os
import sys
import numpy as np

def process_custom_csv(csv_file):
    diseases = []
    current_disease = None
    current_data = {}
    capture_array = False
    array_key = ""
    array_values = []

    with open(csv_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            # New disease block
            if line.startswith("Disease:"):
                if current_disease:
                    diseases.append({"name": current_disease, "data": current_data})
                current_disease = line.split(":", 1)[1].strip()
                current_data = {}
                continue

            # Start of Parameters or Results
            if line in ["Parameters", "Results"]:
                continue

            # Check if line contains key-value pair
            if "," in line and not line.startswith("Daily_"):
                key, value = line.split(",", 1)
                key = key.strip()
                value = value.strip()
                try:
                    current_data[key] = float(value) if '.' in value else int(value)
                except:
                    current_data[key] = value  # Keep as string if cannot convert

            # Handle large array fields like Daily_Infection_Rates
            elif line.startswith("Daily_"):
                array_key, values_str = line.split(",", 1)
                array_values = [float(x) for x in values_str.split(",") if x.strip() != ""]
                current_data[array_key.strip()] = array_values

    if current_disease:
        diseases.append({"name": current_disease, "data": current_data})

    return diseases

def generate_plots(csv_file, output_dir):
    try:
        os.makedirs(output_dir, exist_ok=True)
        diseases = process_custom_csv(csv_file)
        print(f"Found {len(diseases)} diseases")

        for disease in diseases:
            print(f"\nProcessing {disease['name']}...")
            data = disease['data']

            fig = make_subplots(
                rows=3, cols=2,
                subplot_titles=(
                    'Key Metrics',
                    'Infection Rates',
                    'Death Rates',
                    'Recovery Rates',
                    'Time Metrics',
                    'Population Impact'
                ),
                vertical_spacing=0.15,
                horizontal_spacing=0.1
            )

            # Subplot 1: Key Metrics
            fig.add_trace(go.Bar(
                x=['Total_Infections', 'Total_Deaths', 'Total_Recovered'],
                y=[data.get('Total_Infections', 0), data.get('Total_Deaths', 0), data.get('Total_Recovered', 0)],
                name='Counts'
            ), row=1, col=1)

            # Subplot 2: Rates
            fig.add_trace(go.Bar(
                x=['Infection_Rate_Per_Day', 'Death_Rate_Per_Day', 'Recovery_Rate_Per_Day'],
                y=[data.get('Infection_Rate_Per_Day', 0), data.get('Death_Rate_Per_Day', 0), data.get('Recovery_Rate_Per_Day', 0)],
                name='Rates'
            ), row=1, col=2)

            # Subplot 3: Infections
            fig.add_trace(go.Bar(
                x=['Initial_Infected', 'Peak_Infection_Rate', 'Maximum_Infected_Simultaneously'],
                y=[data.get('Initial_Infected', 0), data.get('Peak_Infection_Rate', 0), data.get('Maximum_Infected_Simultaneously', 0)],
                name='Infections'
            ), row=2, col=1)

            # Subplot 4: Time
            fig.add_trace(go.Bar(
                x=['Time_to_Peak', 'Duration_of_Outbreak'],
                y=[data.get('Time_to_Peak', 0), data.get('Duration_of_Outbreak', 0)],
                name='Time'
            ), row=2, col=2)

            # Subplot 5: Final status
            fig.add_trace(go.Bar(
                x=['Final_Healthy_Count', 'Final_Infected_Count', 'Final_Recovered_Count', 'Final_Dead_Count'],
                y=[data.get('Final_Healthy_Count', 0), data.get('Final_Infected_Count', 0), data.get('Final_Recovered_Count', 0), data.get('Final_Dead_Count', 0)],
                name='Final Counts'
            ), row=3, col=1)

            fig.update_layout(
                title=f'Epidemic Progression - {disease["name"]}',
                height=1200,
                width=1600,
                showlegend=True
            )

            output_file = os.path.join(output_dir, f'{disease["name"].replace(" ", "_")}_plots.png')
            fig.write_image(output_file, engine='kaleido')
            print(f"Saved plot to {output_file}")

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python generate_plots.py <csv_file> <output_directory>")
        sys.exit(1)

    csv_file = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(csv_file):
        print(f"Error: CSV file {csv_file} does not exist")
        sys.exit(1)

    generate_plots(csv_file, output_dir)
