const inputBlock = document.querySelector('.weather-form__input');
const weatherButton = document.querySelector('.weather-form__input_update-button');
const weatherGradus = document.querySelector('.weather-describe__text_gradus');
const weatherSearch = document.querySelector('.weather-form__input_search');
const weatherCity = document.querySelector('.weather-describe__city_name');
const weatherType = document.querySelector('.weather-describe__text_type');
const timeToPerm = document.querySelector('.weather-describe__text_img');
const weatherTime = document.querySelector('.weather-describe__city_time');
const wrapper = document.querySelector('.wrapper');

const URLCitiesList = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const URLExactCity = 'https://api.openweathermap.org/data/2.5/weather?lat='
const LON = '&lon=';
const limit = '&limit=10';
const apiID = '&appid=248e2e1bc7ad8ac7b1d7f10d18947003';

const WEATHER_TYPE = new Map([
    ['Clouds', './imgs/cloudy.svg'],
    ['Rain', './imgs/raining.svg'],
    ['Snow', './imgs/snow.svg'],
    ['Mist', './imgs/mist.svg'],
    ['Drizzle', './imgs/raining.svg'],
    ['Thunderstorm', './imgs/thunder.svg'],
]);

document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    date = date.getHours()
    if (date >= 6 && date <= 19 ) {
        timeToPerm.src = './imgs/day.svg';   
    } else {
        timeToPerm.src = './imgs/night.svg';
    }
})

const toValidDate = (timezone) => {
    const date = new Date();
    date.setHours(date.getHours() - 3 + timezone/3600);
    return date.getMinutes() < 10 ? date.getHours() + ':0' + date.getMinutes() : date.getHours() + ':' + date.getMinutes();
}

const toValidWeather = (weatherType) => {
    if (WEATHER_TYPE.has(weatherType)) {
        timeToPerm.src = WEATHER_TYPE.get(weatherType)
    }
    else if (weatherType === 'Clear') {
        let TIME = weatherTime.innerText.split(':');
        TIME = Number(TIME[0]);
        timeToPerm.src = TIME >= 6 && TIME <= 19 ? './imgs/day.svg' : './imgs/night.svg';
    }
}

document.addEventListener('click', (event) => {
    const cityList = document.querySelector('.test');
    if (event.target.classList.contains('weather-form__input_search') || event.target.classList.contains('test')) {
        if (cityList) {
            cityList.style.display = 'block';
        }
    }
    else {
        if (cityList) {
            cityList.style.display = 'none';
        }
    }
})

async function weatherCheck(...args) {
    const info = await fetch(URLExactCity + args[1] + LON + args[0] + apiID);
    const res = await info.json();
    console.clear();
    console.log(res);
    weatherTime.innerText = toValidDate(res['timezone']);
    weatherGradus.innerText = Math.round(res['main']['temp']-273) + ' C';
    weatherType.innerText = res['weather'][0]['main'];
    weatherCity.innerText = res['name'];
    toValidWeather(res['weather'][0]['main']);
}

const updateWeather = () => {
    
}

weatherButton.addEventListener('click', updateWeather);

const debounce = (func, delay) => {
    let timeInterval;
    return function(...args) {
        clearTimeout(timeInterval);
        timeInterval = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

const clearList = () => {
    const test = document.querySelector('.test');
    if (test) {
        test.remove();
    }
}

const citiesList = async(cities) => {
    clearList();
    if (!cities.length) {
        return;
    }
    const list = document.createElement('ul');
    list.classList.add('test');
    cities.forEach((el, idx) => {
        const listElement = document.createElement('li');
        listElement.setAttribute('tabindex', `${idx+1}`);
        const cityTemplate = el.name + ' ' + el.country;
        listElement.textContent = el.state === undefined ? cityTemplate : cityTemplate + " " + el.state;
        listElement.addEventListener('click', () => weatherCheck(el.lon, el.lat));
        listElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && document.activeElement === listElement) {
                weatherCheck(el.lon, el.lat);
            }
        });
        list.appendChild(listElement);
    })

    inputBlock.appendChild(list);
    list.firstChild.focus();
    
}

const citiesQuery = async(citiesValue) => {
    if (citiesValue.length <= 1) {
        clearList();
        return;
    }
    const cities = await fetch(URLCitiesList + citiesValue + limit + apiID);
    const response = await cities.json();
    citiesList(response);
}

const debounceHandler = debounce(function() {
    citiesQuery(this.value);
}, 500);

weatherSearch.addEventListener('input', debounceHandler);
