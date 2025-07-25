// Attempt to get control values from the simulation tab
const simControl = window.opener?.simControl;

if (!simControl) {
  console.error("❌ Cannot access simulation values. Please open this file using the simulation's button.");
  alert("Open this from the simulation by clicking the 'Run Basic JS Calculator' button.");
  throw new Error("Control object not available.");
}

// Extract values from control panel
const params = {
  Population_Size: simControl.peopleCount * 1000, // e.g., 100 x 1000 = 100,000
  Initial_Infected: simControl.infectedBlobs,
  Blob_Speed: simControl.tSpeed * 10000, // scale for realism
  Infection_Chance: simControl.infectionChance / 100, // convert % to decimal
  Recovery_Time: 14, // default days to recover
  Death_Chance: simControl.selectedDisease === "Ebola" ? 0.7 :
                simControl.selectedDisease === "Flu" ? 0.001 :
                simControl.selectedDisease === "COVID-19" ? 0.02 : 0.03,
  City_Size: 1000000, // square meters
  Movement_Pattern: "random",
  Selected_Disease: simControl.selectedDisease
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
while (infected > 0 && healthy >= 0 && day < 1000) {
  const potential_contacts = healthy * infected * (params.City_Size / 1000000);
  let new_infections = Math.floor(potential_contacts * params.Infection_Chance);
  new_infections = Math.min(healthy, Math.max(0, new_infections));

  let new_recoveries = Math.min(infected, Math.floor(infected / params.Recovery_Time));
  new_recoveries = Math.max(0, new_recoveries);

  let new_deaths = Math.floor(new_recoveries * params.Death_Chance);
  new_deaths = Math.min(new_recoveries, Math.max(0, new_deaths));

  if (
    isNaN(new_infections) || isNaN(new_recoveries) || isNaN(new_deaths)
  ) {
    console.warn("⚠️ Simulation aborted due to invalid values");
    break;
  }

  healthy = Math.max(0, healthy - new_infections);
  infected = Math.max(0, infected + new_infections - new_recoveries - new_deaths);
  recovered = Math.max(0, recovered + new_recoveries - new_deaths);
  dead += new_deaths;

  if (infected > peak_infection) {
    peak_infection = infected;
    peak_time = day;
  }

  infection_rate_per_day.push(new_infections);
  death_rate_per_day.push(new_deaths);
  recovery_rate_per_day.push(new_recoveries);

  day++;

  if (infected <= 0 || (healthy <= 0 && new_infections === 0)) {
    break;
  }
}

// Prevent divide by zero
const total_days = Math.max(day, 1);

// Calculate final results
const results = {
  Selected_Disease: params.Selected_Disease,
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
  Infection_Rate_Per_Day: infection_rate_per_day.reduce((a, b) => a + b, 0) / total_days,
  Death_Rate_Per_Day: death_rate_per_day.reduce((a, b) => a + b, 0) / total_days,
  Recovery_Rate_Per_Day: recovery_rate_per_day.reduce((a, b) => a + b, 0) / total_days
};

// Display results in HTML console
console.log("📌 Parameters:");
for (const [key, value] of Object.entries(params)) {
  console.log(`${key}: ${value}`);
}

console.log("\n📊 Results:");
for (const [key, value] of Object.entries(results)) {
  const formatted = typeof value === "number" ? value.toLocaleString() : value;
  console.log(`${key}: ${formatted}`);
}
