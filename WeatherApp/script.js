const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const API_KEY = "adc9bf65b4d2c63749954ef4d33d488b";

const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    try {
        const response = await fetch(GEOCODING_API_URL);
        const data = await response.json();
        console.log("City Coordinates Response:", data); // Debugging

        if (data.length === 0) {
            alert("City not found!");
            return;
        }
        const { lat, lon } = data[0];
        getWeatherData(lat, lon);
    } catch (error) {
        console.error("Error fetching city coordinates:", error);
    }
};

const getWeatherData = async (lat, lon) => {
    const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(CURRENT_WEATHER_URL),
            fetch(FORECAST_URL)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        console.log("Current Weather Response:", weatherData); // Debugging
        console.log("Forecast Response:", forecastData); // Debugging

        updateCurrentWeather(weatherData);
        update5DayForecast(forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};

const updateCurrentWeather = (data) => {
    const currentWeatherContainer = document.querySelector(".current-weather");
    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    const weatherDescription = data.weather[0].description;
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    currentWeatherContainer.innerHTML = `
        <div class="details">
            <h2>${data.name} (${new Date(data.dt * 1000).toISOString().split('T')[0]})</h2>
            <h4>Temperature: ${temperature}°C</h4>
            <h4>Wind: ${windSpeed} M/S</h4>
            <h4>Humidity: ${humidity}%</h4>
        </div>
        <div class="icon">
            <img src="${weatherIcon}" alt="weather-icon">
            <h4>${weatherDescription}</h4>
        </div>
    `;
};

const update5DayForecast = (data) => {
    const forecastContainer = document.querySelector(".weather-cards");
    forecastContainer.innerHTML = "";

    const forecastDays = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    forecastDays.forEach(day => {
        const temperature = day.main.temp;
        const windSpeed = day.wind.speed;
        const humidity = day.main.humidity;
        const weatherDescription = day.weather[0].description;
        const weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const date = new Date(day.dt * 1000).toISOString().split('T')[0];

        const card = document.createElement("li");
        card.className = "card";
        card.innerHTML = `
            <h2>${date}</h2>
            <img src="${weatherIcon}" alt="weather-icon">
            <h4>Temperature: ${temperature}°C</h4>
            <h4>Wind: ${windSpeed} M/S</h4>
            <h4>Humidity: ${humidity}%</h4>
        `;
        forecastContainer.appendChild(card);
    });
};

searchButton.addEventListener("click", getCityCoordinates);
