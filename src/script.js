function timeFormat(timestamp, timezone) {
  let date = new Date(timestamp);
  let timestampFixDate = timestamp;
  let hours = date.getUTCHours() + timezone;
  if (hours > 23) {
    hours = hours - 24;
    timestampFixDate = timestampFixDate + 1000 * 60 * 60 * 24;
  }
  if (hours <= 0) {
    hours = 24 - hours;
    timestampFixDate = timestampFixDate - 1000 * 60 * 60 * 24;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function dateFormat(timestamp) {
  let myDate = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
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
  let day = days[myDate.getDay()];
  let month = months[myDate.getMonth()];
  let date = myDate.getUTCDate();
  let suffix = dateSuffix(date);
  let year = myDate.getFullYear();

  return `${day} - ${month} ${date}${suffix}, ${year}`;
}

function dateSuffix(d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
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

function displayTemperature(response) {
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let feelElement = document.querySelector("#feel");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let dateElement = document.querySelector("#date");
  let localTime = document.querySelector("#date");
  let timeZone = response.data.timezone;

  celciusTemperature = response.data.main.temp;
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  temperatureElement.innerHTML = Math.round(celciusTemperature);
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  dateElement.innerHTML = dateFormat(response.data.dt * 1000);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
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
  let now = new Date(
    Date.now() +
      (`${timeZone}` - new Date().getTimezoneOffset() * -1 * 60) * 1000
  );
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let suffix = dateSuffix(date);
  let year = now.getFullYear();

  localTime.innerHTML = ` 📅 ${day}- ${month} ${date}${suffix}, ${year} <br /> 🕒 ${hours}:${minutes} hours`;
}

function timeofForecast(timestamp) {
  let date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];

    forecastElement.innerHTML += `
        <div class ="col-4 col-sm-2 mb-3 mb-sm-0">
          <h5>${timeofForecast(forecast.dt * 1000)}</h5> 
          <img src = "http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png" alt = "icon" class = "w-100" />
          <div class = "weather-forecast-temperature">
            <strong>${Math.round(
              forecast.main.temp_max
            )}°C</strong> ${Math.round(forecast.main.temp_min)}°C
            </div>
            </div>
            `;
  }
}

function searchForMyLocation(location) {
  let apiKey = "a8bb545115365cdae986d0ebd7521ddb";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function search(city) {
  let apiKey = "a8bb545115365cdae986d0ebd7521ddb";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
function displayLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchForMyLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

let celciusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let myLocationButton = document.querySelector("#my-location-button");
myLocationButton.addEventListener("click", displayLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

search("Auckland");
