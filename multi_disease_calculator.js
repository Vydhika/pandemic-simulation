// Disease Types and their parameter ranges
const diseases = [
    {
        name: "COVID-19",
        params: {
            Population_Size: 1000000,
            Initial_Infected: 20,
            Blob_Speed: 50,                     // speedMultiplier: 1.0
            Infection_Chance: 0.25,             // matches infectionChance
            Recovery_Time: 50,                  // adjusted for simulation scale
            Death_Chance: 0.02,
            City_Size: 1000000,
            Movement_Pattern: "random"
        }
    },
    {
        name: "Ebola",
        params: {
            Population_Size: 1000000,
            Initial_Infected: 10,
            Blob_Speed: 40,                     // speedMultiplier: 0.8 → 50 * 0.8
            Infection_Chance: 0.5,
            Recovery_Time: 70,                  // scaled from 700 to 70
            Death_Chance: 0.7,
            City_Size: 1000000,
            Movement_Pattern: "restricted"
        }
    },
    {
        name: "Flu",
        params: {
            Population_Size: 1000000,
            Initial_Infected: 30,
            Blob_Speed: 60,                     // speedMultiplier: 1.2
            Infection_Chance: 0.1,
            Recovery_Time: 30,                  // scaled from 300 to 30
            Death_Chance: 0.001,
            City_Size: 1000000,
            Movement_Pattern: "free"
        }
    },
    {
        name: "Disease A",
        params: {
            Population_Size: 1000000,
            Initial_Infected: Math.floor(Math.random() * 50) + 10,
            Blob_Speed: Math.floor(Math.random() * 100) + 10,
            Infection_Chance: (Math.random() * 0.2) + 0.05,
            Recovery_Time: Math.floor(Math.random() * 10) + 7,
            Death_Chance: (Math.random() * 0.1) + 0.01,
            City_Size: 1000000,
            Movement_Pattern: "random"
        }
    },
    {
        name: "Disease B",
        params: {
            Population_Size: 1000000,
            Initial_Infected: Math.floor(Math.random() * 50) + 10,
            Blob_Speed: Math.floor(Math.random() * 100) + 10,
            Infection_Chance: (Math.random() * 0.2) + 0.05,
            Recovery_Time: Math.floor(Math.random() * 10) + 7,
            Death_Chance: (Math.random() * 0.1) + 0.01,
            City_Size: 1000000,
            Movement_Pattern: "random"
        }
    },
    {
        name: "Disease C",
        params: {
            Population_Size: 1000000,
            Initial_Infected: Math.floor(Math.random() * 50) + 10,
            Blob_Speed: Math.floor(Math.random() * 100) + 10,
            Infection_Chance: (Math.random() * 0.2) + 0.05,
            Recovery_Time: Math.floor(Math.random() * 10) + 7,
            Death_Chance: (Math.random() * 0.1) + 0.01,
            City_Size: 1000000,
            Movement_Pattern: "random"
        }
    },
    {
        name: "Disease D",
        params: {
            Population_Size: 1000000,
            Initial_Infected: Math.floor(Math.random() * 50) + 10,
            Blob_Speed: Math.floor(Math.random() * 100) + 10,
            Infection_Chance: (Math.random() * 0.2) + 0.05,
            Recovery_Time: Math.floor(Math.random() * 10) + 7,
            Death_Chance: (Math.random() * 0.1) + 0.01,
            City_Size: 1000000,
            Movement_Pattern: "random"
        }
    }
];

// Function to create table
function createTable(title, data) {
    const table = document.createElement('table');
    const header = document.createElement('thead');
    const body = document.createElement('tbody');
    
    // Create header row
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    header.appendChild(headerRow);
    
    // Create data rows
    data.forEach(row => {
        const rowElement = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            rowElement.appendChild(td);
        });
        body.appendChild(rowElement);
    });
    
    table.appendChild(header);
    table.appendChild(body);
    return table;
}

// Function to calculate results
function calculateDiseaseResults(params) {
    const results = {
        Total_Infections: 0,
        Total_Deaths: 0,
        Total_Recovered: 0,
        Peak_Infection_Rate: 0,
        Time_to_Peak: 0,
        Duration_of_Outbreak: 0,
        Final_Healthy_Count: 0,
        Final_Infected_Count: 0,
        Final_Recovered_Count: 0,
        Final_Dead_Count: 0,
        Maximum_Infected_Simultaneously: 0,
        Infection_Rate_Per_Day: 0,
        Death_Rate_Per_Day: 0,
        Recovery_Rate_Per_Day: 0,
        Daily_Infection_Rates: [],
        Daily_Death_Rates: [],
        Daily_Recovery_Rates: [],
        Daily_Healthy_Count: [],
        Daily_Infected_Count: [],
        Daily_Recovered_Count: [],
        Daily_Dead_Count: []
    };

    // Initialize counters
    let infected = params.Initial_Infected;
    let recovered = 0;
    let dead = 0;
    let healthy = params.Population_Size - infected;
    
    // Track peak values
    let peak_infection = infected;
    let peak_time = 0;
    
    // Simulation loop
    let day = 0;
    while (infected > 0 && day < 365) {
        // Calculate new infections
        const potential_contacts = healthy * infected * (params.City_Size / 1000000);
        const new_infections = Math.min(healthy, Math.floor(potential_contacts * params.Infection_Chance));
        
        // Calculate recoveries and deaths
        const new_recoveries = Math.min(infected, Math.floor(infected / params.Recovery_Time));
        const new_deaths = Math.min(infected, Math.floor(new_recoveries * params.Death_Chance));
        
        // Update counters
        healthy -= new_infections;
        infected += new_infections - new_recoveries - new_deaths;
        recovered += new_recoveries - new_deaths;
        dead += new_deaths;
        
        // Track peak
        if (infected > peak_infection) {
            peak_infection = infected;
            peak_time = day;
        }
        
        // Track daily rates
        results.Daily_Infection_Rates.push(new_infections);
        results.Daily_Death_Rates.push(new_deaths);
        results.Daily_Recovery_Rates.push(new_recoveries);
        results.Daily_Healthy_Count.push(healthy);
        results.Daily_Infected_Count.push(infected);
        results.Daily_Recovered_Count.push(recovered);
        results.Daily_Dead_Count.push(dead);
        
        day++;
    }
    
    // Calculate final results
    results.Total_Infections = params.Initial_Infected + results.Daily_Infection_Rates.reduce((a, b) => a + b, 0);
    results.Total_Deaths = dead;
    results.Total_Recovered = recovered;
    results.Peak_Infection_Rate = peak_infection;
    results.Time_to_Peak = peak_time;
    results.Duration_of_Outbreak = day;
    results.Final_Healthy_Count = healthy;
    results.Final_Infected_Count = infected;
    results.Final_Recovered_Count = recovered;
    results.Final_Dead_Count = dead;
    results.Maximum_Infected_Simultaneously = peak_infection;
    results.Infection_Rate_Per_Day = results.Daily_Infection_Rates.reduce((a, b) => a + b, 0) / day;
    results.Death_Rate_Per_Day = results.Daily_Death_Rates.reduce((a, b) => a + b, 0) / day;
    results.Recovery_Rate_Per_Day = results.Daily_Recovery_Rates.reduce((a, b) => a + b, 0) / day;
    
    return results;
}

// Display all diseases
const diseasesDiv = document.getElementById('diseases');

diseases.forEach(disease => {
    // Create section for each disease
    const diseaseSection = document.createElement('div');
    diseaseSection.className = 'section';
    
    // Add disease header
    const header = document.createElement('div');
    header.className = 'disease-header';
    header.textContent = disease.name;
    diseaseSection.appendChild(header);
    
    // Calculate results
    const results = calculateDiseaseResults(disease.params);
    
    // Create parameters table
    const paramsTable = createTable('Parameters', [{
        'Parameter': 'Population_Size',
        'Value': disease.params.Population_Size
    }, {
        'Parameter': 'Initial_Infected',
        'Value': disease.params.Initial_Infected
    }, {
        'Parameter': 'Blob_Speed',
        'Value': disease.params.Blob_Speed
    }, {
        'Parameter': 'Infection_Chance',
        'Value': disease.params.Infection_Chance.toFixed(3)
    }, {
        'Parameter': 'Recovery_Time',
        'Value': disease.params.Recovery_Time
    }, {
        'Parameter': 'Death_Chance',
        'Value': disease.params.Death_Chance.toFixed(3)
    }, {
        'Parameter': 'City_Size',
        'Value': disease.params.City_Size
    }, {
        'Parameter': 'Movement_Pattern',
        'Value': disease.params.Movement_Pattern
    }]);
    diseaseSection.appendChild(paramsTable);
    
    // Create results table
    const resultsTable = createTable('Results', [{
        'Metric': 'Total_Infections',
        'Value': results.Total_Infections
    }, {
        'Metric': 'Total_Deaths',
        'Value': results.Total_Deaths
    }, {
        'Metric': 'Total_Recovered',
        'Value': results.Total_Recovered
    }, {
        'Metric': 'Peak_Infection_Rate',
        'Value': results.Peak_Infection_Rate
    }, {
        'Metric': 'Time_to_Peak',
        'Value': results.Time_to_Peak
    }, {
        'Metric': 'Duration_of_Outbreak',
        'Value': results.Duration_of_Outbreak
    }, {
        'Metric': 'Final_Healthy_Count',
        'Value': results.Final_Healthy_Count
    }, {
        'Metric': 'Final_Infected_Count',
        'Value': results.Final_Infected_Count
    }, {
        'Metric': 'Final_Recovered_Count',
        'Value': results.Final_Recovered_Count
    }, {
        'Metric': 'Final_Dead_Count',
        'Value': results.Final_Dead_Count
    }, {
        'Metric': 'Maximum_Infected_Simultaneously',
        'Value': results.Maximum_Infected_Simultaneously
    }, {
        'Metric': 'Infection_Rate_Per_Day',
        'Value': results.Infection_Rate_Per_Day.toFixed(2)
    }, {
        'Metric': 'Death_Rate_Per_Day',
        'Value': results.Death_Rate_Per_Day.toFixed(2)
    }, {
        'Metric': 'Recovery_Rate_Per_Day',
        'Value': results.Recovery_Rate_Per_Day.toFixed(2)
    }]);
    diseaseSection.appendChild(resultsTable);
    
    // Add to diseases container
    diseasesDiv.appendChild(diseaseSection);
});

// Add CSV download functionality
function downloadCSV() {
let csvContent = "data:text/csv;charset=utf-8,";
    
    diseases.forEach((disease, index) => {
        const results = calculateDiseaseResults(disease.params);
        
        // Add disease header
        csvContent += `\n\nDisease: ${disease.name}\n`;
        
        // Add parameters
        csvContent += "Parameters\n";
        csvContent += Object.entries(disease.params).map(([key, value]) => 
            `${key},${value}`
        ).join("\n");
        
        // Add results
        csvContent += "\n\nResults\n";
        csvContent += Object.entries(results).map(([key, value]) => 
            `${key},${value}`
        ).join("\n");
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pandemic_simulation_multiple_diseases.csv");
    document.body.appendChild(link);
    link.click();
}
