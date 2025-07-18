// js/dashboard.js

import { fetchSensorValues, updateVariable, getToken } from './arduino-api.js';

const role = sessionStorage.getItem("role");
const email = sessionStorage.getItem("email");
const plant = sessionStorage.getItem("plant");

document.getElementById("dashboard-title").textContent =
  role === "admin" ? "Admin Dashboard" : `Welcome, ${email} – ${plant}`;

const container = document.getElementById("dash-container");

// Replace with your actual Thing and variable IDs
const systems = [
  {
    user: "student1@email.com",
    label: "Tomato",
    thingId: "THING_ID_1"
  },
  {
    user: "student2@email.com",
    label: "Basil",
    thingId: "THING_ID_2"
  },
  {
    user: "student3@email.com",
    label: "Lettuce",
    thingId: "THING_ID_3"
  },
  {
    user: "student4@email.com",
    label: "Mint",
    thingId: "THING_ID_4"
  }
];

// Hardcoded mapping of variable IDs per Thing
function getVariableId(thingId, name) {
  const map = {
    "THING_ID_1": {
      pumpControl: "VAR_ID_1",
      lightControl: "VAR_ID_2",
      runPumpTimed: "VAR_ID_3",
      runLightTimed: "VAR_ID_4"
    },
    "THING_ID_2": {
      pumpControl: "VAR_ID_5",
      lightControl: "VAR_ID_6",
      runPumpTimed: "VAR_ID_7",
      runLightTimed: "VAR_ID_8"
    },
    // Repeat for all Thing IDs...
  };
  return map[thingId][name];
}

// Filter for current user if not admin
const filteredSystems = role === "admin"
  ? systems
  : systems.filter(sys => sys.user === email);

// Render dashboard cards
filteredSystems.forEach(sys => {
  const card = document.createElement("div");
  card.className = "col-md-6";
  card.innerHTML = `
    <div class="card shadow-sm p-3">
      <h5 class="card-title">${sys.label}</h5>
      <div id="sensor-${sys.thingId}">
        <p>🌡️ Temp: <span class="temp">...</span> °C</p>
        <p>💧 Humidity: <span class="humidity">...</span> %</p>
        <p>🌱 Soil Moisture: <span class="moisture">...</span></p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-success btn-sm" onclick="togglePump('${sys.thingId}', true)">Pump ON</button>
        <button class="btn btn-secondary btn-sm" onclick="togglePump('${sys.thingId}', false)">Pump OFF</button>
        <button class="btn btn-warning btn-sm" onclick="runPumpTimed('${sys.thingId}')">Pump Timer</button>
      </div>
      <div class="d-flex gap-2 mt-2">
        <button class="btn btn-success btn-sm" onclick="toggleLight('${sys.thingId}', true)">Light ON</button>
        <button class="btn btn-secondary btn-sm" onclick="toggleLight('${sys.thingId}', false)">Light OFF</button>
        <button class="btn btn-warning btn-sm" onclick="runLightTimed('${sys.thingId}')">Light Timer</button>
      </div>
    </div>
  `;
  container.appendChild(card);
});

const API_TOKEN = await getToken();

// Auto-refresh sensor values every 3 seconds
setInterval(async () => {
  for (const sys of filteredSystems) {
    const vars = await fetchSensorValues(sys.thingId, API_TOKEN);

    const temp = vars.find(v => v.name === "temperature")?.last_value ?? "...";
    const humidity = vars.find(v => v.name === "humidity")?.last_value ?? "...";
    const moisture = vars.find(v => v.name === "soilMoisture")?.last_value ?? "...";

    const container = document.querySelector(`#sensor-${sys.thingId}`);
    container.querySelector(".temp").textContent = temp;
    container.querySelector(".humidity").textContent = humidity;
    container.querySelector(".moisture").textContent = moisture;
  }
}, 3000);

// Control functions
window.togglePump = async (thingId, state) => {
  const id = getVariableId(thingId, "pumpControl");
  await updateVariable(id, state, API_TOKEN);
};

window.toggleLight = async (thingId, state) => {
  const id = getVariableId(thingId, "lightControl");
  await updateVariable(id, state, API_TOKEN);
};

window.runPumpTimed = async (thingId) => {
  const id = getVariableId(thingId, "runPumpTimed");
  await updateVariable(id, true, API_TOKEN);
};

window.runLightTimed = async (thingId) => {
  const id = getVariableId(thingId, "runLightTimed");
  await updateVariable(id, true, API_TOKEN);
};
