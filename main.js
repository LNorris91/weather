const input = document.getElementById('input');
const searchBtn = document.getElementById('searchBtn');

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3RUT7DGF8DMF3DT52R42KBN4J`,
      { mode: 'cors' }
    );
    const weatherData = await response.json();
    results = {
      condition: weatherData.currentConditions.conditions,
      description: weatherData.description,
      feelslike: weatherData.currentConditions.feelslike,
      name: weatherData.resolvedAddress,
      uv: weatherData.currentConditions.uvindex,
      temp: weatherData.currentConditions.temp,
    };
    console.log(weatherData);
  } catch (err) {
    alert(err);
  }
  console.log(results);
}

searchBtn.addEventListener('click', () => {
  getWeather(input.value);
});
