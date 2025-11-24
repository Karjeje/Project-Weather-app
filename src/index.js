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
    processedData = processed;

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
    currenttime: getLocalTime(data.timezone),
    description: data.currentConditions.conditions,
    temperature: Math.round(toCelsius(data.currentConditions.temp)),
    feelslike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
    windspeed: data.currentConditions.windspeed,
  };
}

const btn = document.querySelector("button");
btn.addEventListener("click", getWeather);

//Helper functions

function toCelsius(f) {
  return ((f - 32) * 5) / 9;
}

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

function shortenHour(hour) {
  if (!hour) return;
  return hour.slice(0, 5);
}

function getLocalTime(timezone) {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  });
}

const container = document.getElementById("hourlyContainer");

document.querySelector(".arrow.right").addEventListener("click", () => {
  container.scrollBy({ left: 464, behavior: "smooth" });
});

document.querySelector(".arrow.left").addEventListener("click", () => {
  container.scrollBy({ left: -464, behavior: "smooth" });
});

//Function for displaying the weather

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
    const dailyIcons = document.querySelectorAll(".dayicon");
    dailyIcons.forEach((icon) => {
      icon.textContent = "Icon";
    });
    lastThree.forEach((day, i) => {
      const rawDate = processedData.dates[i + 2].datetime;
      day.textContent = getDayName(rawDate);
    });
  }
  displayDays();

  function displayBasic() {
    const iconSpanBasic = document.querySelector(".currenticon.basic");
    const tempSpan = document.querySelector(".currenttemp");
    const locationSpan = document.querySelector(".location");
    iconSpanBasic.textContent = "Icon";
    tempSpan.textContent = `${processedData.temperature} ºC`;
    locationSpan.textContent = capitalize(processedData.location);
  }
  displayBasic();

  function displayLeftMain() {
    const cityTime = document.querySelector(".citytime");
    const desc = document.querySelector(".desc");
    const temps = document.querySelectorAll(".currenttemp");
    const secondTemp = temps[1];
    const iconSpanMain = document.querySelector(".currenticon.main");
    const windSpeed = document.querySelector(".windspeed");
    const humiditySpan = document.querySelector(".humidityspan");

    cityTime.textContent = `${capitalize(processedData.location)}, ${processedData.currenttime}`;
    desc.textContent = processedData.description;
    secondTemp.textContent = processedData.temperature;
    iconSpanMain.textContent = "Icon";
    windSpeed.textContent = `${processedData.windspeed} km/h`;
    humiditySpan.textContent = `${processedData.humidity} %`;
  }
  displayLeftMain();

  function createHourlyTable(hours) {
    const container = document.getElementById("hourlyContainer");
    container.innerHTML = "";

    hours.forEach((h) => {
      const box = document.createElement("div");
      box.classList = "hour-box";

      box.innerHTML = `
      <span class="hour">${shortenHour(h.datetime)}</span>
      <span class="weathericon">Icon</span>
      <span class="temp">${Math.round(toCelsius(h.temp))} ºC</span>
      <span class="wind">${h.windspeed} km/h</span>
      `;
      container.appendChild(box);
    });
  }
  createHourlyTable(processedData.dates[0].hours);

  function displaySunInfo() {
    const dayAndDateSpan = document.querySelector(".dayanddate");
    const sunriseSpan = document.querySelector(".sunrise");
    const sunsetSpan = document.querySelector(".sunset");

    const currentDate = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayAndDateSpan.textContent = `${days[currentDate.getDay()]}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}`;

    sunriseSpan.textContent = `↑🌅 ${shortenHour(processedData.sunrise)}`;
    sunsetSpan.textContent = `↓🌅 ${shortenHour(processedData.sunset)}`;
  }
  displaySunInfo();
}

displayWeather();
