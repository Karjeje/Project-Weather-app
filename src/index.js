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

function getDaySuffix(day) {
  if (day > 3 && day < 21) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  return `${day}${suffix} ${month}`;
}

function getDayName(isoString) {
  const date = new Date(isoString);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = days[date.getDay()];
  return day;
}

function capitalize(city) {
  if (!city) return;
  return city[0].toUpperCase() + city.slice(1).toLowerCase();
}

function displayWeather() {
  if (!processedData) return;

  function displayDates() {
    const dates = document.querySelectorAll(".date");
    dates.forEach((date, i) => {
      const rawDate = processedData.dates[i].datetime;
      date.textContent = formatDate(rawDate);
    });
  }
  displayDates();

  function displayDays() {
    const allDays = document.querySelectorAll(".day");
    const lastThree = Array.from(allDays).splice(-3);
    lastThree.forEach((day, i) => {
      const rawDate = processedData.dates[i + 2].datetime;
      day.textContent = getDayName(rawDate);
    });
  }
  displayDays();

  function displayBasic() {
    const tempSpan = document.querySelector(".currenttemp");
    const locationSpan = document.querySelector(".location");
    tempSpan.textContent = `${processedData.temperature} ºC`;
    locationSpan.textContent = capitalize(processedData.location);
  }
  displayBasic();
}

displayWeather();
