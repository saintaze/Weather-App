window.addEventListener('load', async () => {
  let geoLat = null;
  let geoLng = null;

  const placeEl = document.querySelector('.place');
  const celciusEl = document.querySelector('.celcius');
  const celciusDegreeEl = document.querySelector('.celcius sup');
  const celciusUnitEl = document.querySelector('.celcius sub');
  const fahrenheitEl = document.querySelector('.fahrenheit');
  const fahrenheitDegreeEl = document.querySelector('.fahrenheit sup');
  const fahrenheitUnitEl = document.querySelector('.fahrenheit sub');
  const inputEl = document.querySelector('input');
  const btnEl = document.querySelector('.btn');
  const todayH2El = document.querySelector('.today h2');
  const tomorrowH2El = document.querySelector('.tomorrow h2');
  const svgEl = document.querySelector('svg');
  
  const todayCondition = document.querySelector('.today .condition');
  const todayHigh = document.querySelector('.today .high');
  const todayLow = document.querySelector('.today .low');
  const todayHumidity = document.querySelector('.today .humidity');
  const todayWind = document.querySelector('.today .wind');
  const todayRain = document.querySelector('.today .rain');

  const tomorrowCondition = document.querySelector('.tomorrow .condition');
  const tomorrowHigh = document.querySelector('.tomorrow .high');
  const tomorrowLow = document.querySelector('.tomorrow .low');
  const tomorrowHumidity = document.querySelector('.tomorrow .humidity');
  const tomorrowWind = document.querySelector('.tomorrow .wind');
  const tomorrowRain = document.querySelector('.tomorrow .rain');

  const weatherApiKey = '7caadd8c151af9ea593bfc2cd0746ebe';
  const convertToCelcius = fahr => (fahr - 32) * (5/9) 

  const convertNameToCoords = async (cityName="london") => {
    const apikey = '81059bbe9281463a9034986438b03482';
    const base_url = 'https://api.opencagedata.com/geocode/v1/json' 
    const request_url = base_url + '?' + 'key=' + apikey + '&q=' + cityName
    return fetch(request_url)
      .then(res =>  res.json())
      .then(data => data)
  }

  const getWeatherData = async (coords) => {
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const weatherApiUrl = `${proxy}https://api.darksky.net/forecast/${weatherApiKey}/${coords.lat},${coords.lng}`
    return fetch(weatherApiUrl)
      .then(res => res.json())
      .then(data => data)
  }

  const getGeoLoc = () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        
      })
    }
  }

  const toTitleCase = (phrase) => {
    return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const setIcon = (id, iconName) => {
    let skycons = new Skycons({ "color": "#f5a623" });
    skycons.set(id, iconName);
    skycons.play();
  }
  getGeoLoc();
  console.log('he', geoLng, geoLat)

  btnEl.addEventListener('click', async (e) => {
    const coordsData = await convertNameToCoords(inputEl.value);
    let cityName = inputEl.value
    inputEl.value = ''
    const locationInfo  = coordsData.results[0];
    const { city, continent, country, country_code } = locationInfo.components
    console.log(locationInfo)
    
    if (geoLat && geoLng){
      var weatherData = await getWeatherData({lng: geoLng, lat:geoLat});
    }else{
      var weatherData = await getWeatherData(locationInfo.geometry);
    }

    const todayTemp = weatherData.currently.temperature;
    const firstDay =  weatherData.daily.data[0];
    const secondDay =  weatherData.daily.data[1];
    placeEl.textContent = toTitleCase(cityName) + ', ' + country;
    todayH2El.style.display = 'block';
    tomorrowH2El.style.display = 'block';
    svgEl.style.display = 'block';

    fahrenheitEl.innerHTML = `
      ${Math.floor(todayTemp)}
      <span class="unit">
        <div class="box">
          <sup>°</sup>
          <sub>Fahrenheit</sub>
        </div> 
      </span>
    `
    celciusEl.innerHTML = `
      ${Math.floor(convertToCelcius(todayTemp))}
      <div class="unit">
        <div class="box">
          <sup>°</sup>
          <sub>Celcius</sub>
        </div> 
      </div>
    `

    // FIRST DAY
    todayCondition.textContent = firstDay.summary.replace('.', '');
    todayHigh.textContent = 'High: ' + Math.floor(firstDay.temperatureHigh) + '°F' + ' / ' + Math.floor(convertToCelcius(firstDay.temperatureHigh)) + '°C'
    todayLow.textContent = 'Low: ' + Math.floor(firstDay.temperatureLow) + '°F' + ' / ' + Math.floor(convertToCelcius(firstDay.temperatureLow)) + '°C'
    todayHumidity.textContent = 'Humidity: ' + Math.floor(firstDay.humidity * 100) + '%'
    todayWind.textContent = 'Wind: ' + firstDay.windSpeed + "mph"
    todayRain.textContent = 'Rain: ' + firstDay.precipProbability * 100 + '% chance'
    setIcon(icon1, firstDay.icon)


    // SECOND DAY
    tomorrowCondition.textContent = secondDay.summary.replace('.', '');
    tomorrowHigh.textContent = 'High: ' + Math.floor(secondDay.temperatureHigh) + '°F' + ' / ' + Math.floor(convertToCelcius(secondDay.temperatureHigh)) + '°C'
    tomorrowLow.textContent = 'Low: ' + Math.floor(secondDay.temperatureLow) + '°F' + ' / ' + Math.floor(convertToCelcius(secondDay.temperatureLow)) + '°C'
    tomorrowHumidity.textContent = 'Humidity: ' + Math.floor(secondDay.humidity * 100) + '%'
    tomorrowWind.textContent = 'Wind: ' +  secondDay.windSpeed + "mph"
    tomorrowRain.textContent = 'Rain: ' + Math.floor(secondDay.precipProbability * 100) + '% chance'
    setIcon(icon2, secondDay.icon)

    console.log(weatherData)
  });

  
})

