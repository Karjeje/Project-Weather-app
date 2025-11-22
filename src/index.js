import "./styles.css";

console.log("Template");

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3Q2HL7K9M833AEEYCPBTU7NPX`
    );
    const data = await response.json();
    console.log(data);
    return processData(data);
  } catch (err) {
    console.error("fukem");
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

getWeather("london").then((weather) => {
  console.log(weather);
});
