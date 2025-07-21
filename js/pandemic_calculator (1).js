// Parameters (using default values)
const params = {
    Population_Size: 1000000,
    Initial_Infected: 10,
    Blob_Speed: 50, // meters per day
    Infection_Chance: 0.1,
    Recovery_Time: 14,
    Death_Chance: 0.03,
    City_Size: 1000000, // in square meters
    Movement_Pattern: "random"
};

// Initialize counters
let infected = params.Initial_Infected;
let recovered = 0;
let dead = 0;
let healthy = params.Population_Size - infected;

// Track peak values
let peak_infection = infected;
let peak_time = 0;

// Track daily rates
let infection_rate_per_day = [];
let death_rate_per_day = [];
let recovery_rate_per_day = [];

// Simulation loop
let day = 0;
while (infected > 0) {
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
    infection_rate_per_day.push(new_infections);
    death_rate_per_day.push(new_deaths);
    recovery_rate_per_day.push(new_recoveries);
    
    day++;
    
    // Stop if no more infections
    if (infected === 0) break;
}

// Calculate final results
const results = {
    Total_Infections: params.Initial_Infected + infection_rate_per_day.reduce((a, b) => a + b, 0),
    Total_Deaths: dead,
    Total_Recovered: recovered,
    Peak_Infection_Rate: peak_infection,
    Time_to_Peak: peak_time,
    Duration_of_Outbreak: day,
    Final_Healthy_Count: healthy,
    Final_Infected_Count: infected,
    Final_Recovered_Count: recovered,
    Final_Dead_Count: dead,
    Maximum_Infected_Simultaneously: peak_infection,
    Infection_Rate_Per_Day: infection_rate_per_day.reduce((a, b) => a + b, 0) / day,
    Death_Rate_Per_Day: death_rate_per_day.reduce((a, b) => a + b, 0) / day,
    Recovery_Rate_Per_Day: recovery_rate_per_day.reduce((a, b) => a + b, 0) / day
};

// Print results
console.log("Parameters:");
for (const [key, value] of Object.entries(params)) {
    console.log(`${key}: ${value}`);
}
console.log("\nResults:");
for (const [key, value] of Object.entries(results)) {
    console.log(`${key}: ${value}`);
}
