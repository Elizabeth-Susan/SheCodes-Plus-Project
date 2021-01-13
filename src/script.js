function displayTemperature(response) {
  console.log(response.data);
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let feelElement = document.querySelector("#feel");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");

  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
}
let apiKey = "a8bb545115365cdae986d0ebd7521ddb";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Auckland&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayTemperature);
