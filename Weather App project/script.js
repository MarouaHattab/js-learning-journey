const weatherForm = document.querySelector(".weather-form");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "3e33948b9f80acd79c12815b18f284d0";
weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city ");
    return;
  }
});
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }

  return await response.json();
}
function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;


  const errorDisplay = document.querySelector(".errorDisplay");
  errorDisplay.style.display = "none";

  document.querySelector(".cityDisplay").textContent = city;
  document.querySelector(".tempDisplay").textContent = `${(
    (temp - 273.15) * (9 / 5) +
    32
  ).toFixed(1)}°F`;
  document.querySelector(
    ".humidityDisplay"
  ).textContent = `Humidity: ${humidity}%`;
  document.querySelector(".descDisplay").textContent = description;
  document.querySelector(".weatherEmoji").textContent = getWeatherEmoji(id);

  card.style.display = "flex";
}
function getWeatherEmoji(WeatherId) {
  switch (true) {
    case WeatherId >= 200 && WeatherId < 300:
      return "🌩️";
    case WeatherId >= 300 && WeatherId < 400:
      return "🌧️";
    case WeatherId >= 500 && WeatherId < 600:
      return "🌧️";
    case WeatherId >= 600 && WeatherId < 700:
      return "❄️";
    case WeatherId >= 700 && WeatherId < 800:
      return "🌫️";
    case WeatherId === 800:
      return "☀️";
    case WeatherId >= 801 && WeatherId < 810:
      return "☁️";
    default:
      return "❓";
  }
}

function displayError(message) {
  card.style.display = "none";

  const errorDisplay = document.querySelector(".errorDisplay");
  errorDisplay.textContent = message;
  errorDisplay.style.display = "block";
}
