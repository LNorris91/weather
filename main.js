const input = document.getElementById('input');
const searchBtn = document.getElementById('searchBtn');
const unitBtn = document.getElementById('unitBtn');
const locationName = document.getElementById('name');
const locationTime = document.getElementById('time');
const locationCondition = document.getElementById('condition');
const locationTemp = document.getElementById('temp');
const locationFeelsLike = document.getElementById('feelsLike');
const locationDescription = document.getElementById('description');
const locationUv = document.getElementById('uv');
const img = document.querySelector('img');
const loader = document.querySelector('.loaderContainer');

async function getWeather(location) {
  showLoader();
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3RUT7DGF8DMF3DT52R42KBN4J`,
      { mode: 'cors' }
    );
    if (response.ok) {
      const weatherData = await response.json();
      results = {
        condition: weatherData.currentConditions.conditions,
        description: weatherData.days[0].description,
        feelslike: weatherData.currentConditions.feelslike,
        name: weatherData.resolvedAddress,
        timezone: weatherData.timezone,
        temp: weatherData.currentConditions.temp,
        uv: weatherData.currentConditions.uvindex,
      };

      console.log(results);
      console.log(weatherData);

      await getGif(results.condition);
      updateInfo();
      hideLoader();
    } else {
      if (response.status === 400) alert('Not a valid location');
    }
  } catch (err) {
    console.log(err.status);
    alert(err);
  }
  return results;
}

function validateForm() {
  if (!input.value) {
    alert('please enter a location');
  } else {
    getWeather(input.value);
    input.value = '';
  }
}

function updateInfo() {
  locationName.textContent = results.name;
  locationTime.textContent = getTime(results.timezone);
  locationCondition.textContent = results.condition;
  locationTemp.textContent = results.temp + '°';

  if (results.feelslike !== results.temp) {
    locationFeelsLike.textContent = 'Feels like ' + results.feelslike + '°';
  } else {
    locationFeelsLike.textContent = 'Feels exactly like it says.';
  }

  locationDescription.textContent = results.description;

  if (results.uv < 3) {
    locationUv.textContent =
      'The UV index is ' + results.uv + '. No need to bother with sunscreen.';
  } else if (2 < results.uv && results.uv < 8) {
    locationUv.textContent = 'The UV index is ' + results.uv + ". Sunscreen wouldn't hurt.";
  } else if (results.uv > 7) {
    locationUv.textContent = 'The UV index is ' + results.uv + '. Better lather it on THICK.';
  }
}

async function getGif(search) {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=c8c0GTCiq0bIrcW667RjAoS6zwYSAXJY&s=${search}`,
      { mode: 'cors' }
    );
    const gifData = await response.json();
    img.src = gifData.data.images.original.url;
  } catch (err) {
    alert(err);
    img.src = 'icons8-emoji-64.png';
  }
}

function toggleUnits() {
  if (unitBtn.textContent === '°F') {
    results.temp = convertToC(results.temp).toFixed(1);
    results.feelslike = convertToC(results.feelslike).toFixed(1);
    updateInfo();
    unitBtn.textContent = '°C';
  } else if (unitBtn.textContent === '°C') {
    results.temp = convertToF(results.temp).toFixed(1);
    results.feelslike = convertToF(results.feelslike).toFixed(1);
    updateInfo();
    unitBtn.textContent = '°F';
  }
}

function getTime(timezone) {
  const date = new Date();
  return date.toLocaleString('en-US', { timeZone: timezone, timeStyle: 'short' });
}

function convertToC(temp) {
  return ((temp - 32) * 5) / 9;
}

function convertToF(temp) {
  return (temp * 9) / 5 + 32;
}

function showLoader() {
  loader.classList.add('visible');
}

function hideLoader() {
  loader.classList.remove('visible');
}

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') validateForm();
});
searchBtn.addEventListener('click', validateForm);
unitBtn.addEventListener('click', toggleUnits);

getWeather('mooloolaba');
