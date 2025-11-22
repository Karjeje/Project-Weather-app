import "./styles.css";

console.log("Template");

let processedData = null;

async function getWeather() {
  const locationInput = document.getElementById("location");
  const location = locationInput.value || "ljubljana";

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3Q2HL7K9M833AEEYCPBTU7NPX`
    );

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    const processed = processData(data);

    localStorage.setItem("processedData", JSON.stringify(processed));
    localStorage.setItem("unprocessedData", JSON.stringify(data));

    console.log("Fetched and stored:", data);
    console.log("Fetched and stored:", processed);

    displayWeather();
  } catch (err) {
    console.error("Something went wrong:", err);
  }
}

const savedUnproccesed = localStorage.getItem("unprocessedData");
const savedProcessed = localStorage.getItem("processedData");
if (savedProcessed && savedUnproccesed) {
  const unprocessedData = JSON.parse(savedUnproccesed);
  processedData = JSON.parse(savedProcessed);
  console.log("Loaded from storage:", unprocessedData);
  console.log("Loaded from storage:", processedData);
}

function processData(data) {
  return {
    location: data.address,
    dates: data.days,
    description: data.currentConditions.conditions,
    temperature: data.currentConditions.temp,
    feelslike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
    windspeed: data.currentConditions.windspeed,
  };
}

const btn = document.querySelector("button");
btn.addEventListener("click", getWeather);

function displayWeather() {
  const dates = document.querySelectorAll(".date");
  dates.forEach((date, i) => (date.textContent = processedData.dates[i].datetime));
}

displayWeather();
