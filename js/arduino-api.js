// js/arduino-api.js

const API_KEY = "YOUR_ARDUINO_CLOUD_API_KEY";  // 🔐 Replace with your real API Key
const BASE_URL = "https://api2.arduino.cc/iot/v2";

// Get OAuth token from API Key
async function getToken() {
  const response = await fetch("https://api2.arduino.cc/iot/v1/clients/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=`
  });
  const data = await response.json();
  return data.access_token;
}

// Fetch variables from a Thing
export async function fetchSensorValues(thingId, token) {
  const url = `${BASE_URL}/things/${thingId}/properties`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await res.json();
}

// Send control value (Boolean or Timer)
export async function updateVariable(variableId, value, token) {
  const url = `${BASE_URL}/properties/${variableId}/publish`;
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ value })
  });
}
