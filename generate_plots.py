import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os
import sys
import numpy as np

def process_csv_data(csv_file):
    """Process the CSV file to extract data for each disease"""
    diseases = []
    
    # Read the file line by line
    current_disease = None
    current_data = []
    
    with open(csv_file, 'r') as f:
        # Skip header
        next(f)
        
        for line in f:
            try:
                # Split the line by comma
                parts = line.strip().split(',')
                
                if len(parts) >= 2:
                    # Get Parameter and Value
                    parameter = parts[0].strip()
                    value = parts[1].strip()
                    
                    # Check if this is a new disease section
                    if parameter == 'Parameter':
                        if current_disease and current_data:
                            diseases.append({
                                'name': current_disease,
                                'data': pd.DataFrame(current_data)
                            })
                            current_data = []
                        
                        current_disease = f"Disease_{len(diseases) + 1}"
                        continue
                    
                    # Only process numeric values
                    if not value.replace('.', '', 1).isdigit():
                        continue
                    
                    # Convert value to number
                    try:
                        if '.' in value:
                            value = float(value)
                        else:
                            value = int(value)
                        
                        current_data.append({
                            'Metric': parameter,
                            'Value': value
                        })
                    except ValueError:
                        continue
            except Exception as e:
                continue
    
    # Add last disease
    if current_disease and current_data:
        diseases.append({
            'name': current_disease,
            'data': pd.DataFrame(current_data)
        })
    
    return diseases

def generate_plots(csv_file, output_dir):
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Process CSV data
        diseases = process_csv_data(csv_file)
        print(f"Found {len(diseases)} diseases")
        
        for disease in diseases:
            print(f"\nProcessing {disease['name']}...")
            
            # Create subplot figure
            fig = make_subplots(
                rows=3, cols=2,
                subplot_titles=(
                    'Infections',
                    'Recoveries',
                    'Deaths',
                    'Rates',
                    'Time',
                    'Impact'
                ),
                vertical_spacing=0.15,
                horizontal_spacing=0.1
            )
            
            df = disease['data']
            
            # Get numeric values
            numeric_values = df['Value'].tolist()
            
            # Create bar charts
            fig.add_trace(
                go.Bar(
                    x=['Total_Infections', 'Total_Deaths', 'Total_Recovered'],
                    y=numeric_values[:3],
                    name='Counts'
                ),
                row=1, col=1
            )
            
            fig.add_trace(
                go.Bar(
                    x=['Infection_Rate', 'Death_Rate', 'Recovery_Rate'],
                    y=numeric_values[3:6],
                    name='Rates'
                ),
                row=1, col=2
            )
            
            # Update layout
            fig.update_layout(
                height=900,
                width=1200,
                showlegend=True
            )
            
            # Save as PNG
            output_file = os.path.join(output_dir, f'{disease["name"]}_plots.png')
            fig.write_image(output_file, engine='kaleido', scale=2)
            print(f'Successfully generated plot for {disease["name"]} at {output_file}')
            
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        sys.exit(1)

def generate_plots(csv_file, output_dir):
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Process CSV data
        diseases = process_csv_data(csv_file)
        print(f"Found {len(diseases)} diseases")
        
        for disease in diseases:
            print(f"\nProcessing {disease['name']}...")
            
            # Create subplot figure
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
            
            df = disease['data']
            
            # Add traces
            fig.add_trace(
                go.Bar(
                    x=['Total_Infections', 'Total_Deaths', 'Total_Recovered'],
                    y=[df[df['Metric'] == 'Total_Infections']['Value'].iloc[0],
                       df[df['Metric'] == 'Total_Deaths']['Value'].iloc[0],
                       df[df['Metric'] == 'Total_Recovered']['Value'].iloc[0]],
                    name='Counts'
                ),
                row=1, col=1
            )
            
            fig.add_trace(
                go.Bar(
                    x=['Infection_Rate_Per_Day', 'Death_Rate_Per_Day', 'Recovery_Rate_Per_Day'],
                    y=[df[df['Metric'] == 'Infection_Rate_Per_Day']['Value'].iloc[0],
                       df[df['Metric'] == 'Death_Rate_Per_Day']['Value'].iloc[0],
                       df[df['Metric'] == 'Recovery_Rate_Per_Day']['Value'].iloc[0]],
                    name='Rates'
                ),
                row=1, col=2
            )
            
            fig.add_trace(
                go.Bar(
                    x=['Initial_Infected', 'Peak_Infection_Rate', 'Maximum_Infected_Simultaneously'],
                    y=[df[df['Metric'] == 'Initial_Infected']['Value'].iloc[0],
                       df[df['Metric'] == 'Peak_Infection_Rate']['Value'].iloc[0],
                       df[df['Metric'] == 'Maximum_Infected_Simultaneously']['Value'].iloc[0]],
                    name='Infections'
                ),
                row=2, col=1
            )
            
            fig.add_trace(
                go.Bar(
                    x=['Time_to_Peak', 'Duration_of_Outbreak'],
                    y=[df[df['Metric'] == 'Time_to_Peak']['Value'].iloc[0],
                       df[df['Metric'] == 'Duration_of_Outbreak']['Value'].iloc[0]],
                    name='Time'
                ),
                row=2, col=2
            )
            
            fig.add_trace(
                go.Bar(
                    x=['Final_Healthy_Count', 'Final_Infected_Count', 'Final_Recovered_Count', 'Final_Dead_Count'],
                    y=[df[df['Metric'] == 'Final_Healthy_Count']['Value'].iloc[0],
                       df[df['Metric'] == 'Final_Infected_Count']['Value'].iloc[0],
                       df[df['Metric'] == 'Final_Recovered_Count']['Value'].iloc[0],
                       df[df['Metric'] == 'Final_Dead_Count']['Value'].iloc[0]],
                    name='Final Counts'
                ),
                row=3, col=1
            )
            
            # Update layout
            fig.update_layout(
                title=f'Epidemic Progression - {disease["name"]}',
                height=1200,
                width=1600,
                showlegend=True
            )
            
            # Save as PNG
            output_file = os.path.join(output_dir, f'{disease["name"]}_plots.png')
            fig.write_image(output_file, engine='kaleido')
            print(f'Successfully generated plot for {disease["name"]} at {output_file}')
            
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
