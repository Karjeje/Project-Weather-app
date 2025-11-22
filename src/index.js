import "./styles.css";

console.log("Template");

async function getWeather() {
  const locationInput = document.getElementById("location");
  const location = locationInput.value;

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3Q2HL7K9M833AEEYCPBTU7NPX`
    );

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);
    console.log(processData(data));
  } catch (err) {
    console.error("Something went wrong:", err);
  }
}

function processData(data) {
  return {
    location: data.address,
    date: data.days[0].datetime,
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
