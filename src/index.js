import "./styles.css";

console.log("Template");

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3Q2HL7K9M833AEEYCPBTU7NPX`
    );
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("fukem");
  }
}

getWeather("london");
