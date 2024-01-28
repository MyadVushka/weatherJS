const weatherButton = document.querySelector('.weather-form__input_button');
const weatherGradus = document.querySelector('.weather-describe__text_gradus');
const weatherSearch = document.querySelector('.weather-form__input_search');
const weatherCity = document.querySelector('.weather-describe__city_name');
const weatherType = document.querySelector('.weather-describe__text_type');
const timeToPerm = document.querySelector('.weather-describe__text_img');
const weatherTime = document.querySelector('.weather-describe__city_time');

const url = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiID = '&appid=248e2e1bc7ad8ac7b1d7f10d18947003';

const WEATHER_TYPE = new Map([
    ['Clouds', './imgs/cloudy.svg'],
    ['Rain', './imgs/raining.svg'],
    ['Snow', './imgs/snow.svg'],
    ['Mist', './imgs/mist.svg'],
    ['Drizzle', './imgs/raining.svg'],
    //Clear 
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

let res;

const toValidValue = (value) => {
    value = value.split('').map((el, idx) => {
        if (idx == 0) {
            return el.toUpperCase();
        }
        else {
            return el.toLowerCase();
        }
    }).join('');

    return value;
}

const toValidDate = (timezone) => {
    const date = new Date();
    date.setHours(date.getHours() - 3 + timezone/3600);
    console.log(date.getMinutes());
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

async function weatherCheck() {
    let city = weatherSearch.value;
    const info = await fetch(url + city + apiID);
    res = await info.json();
    console.clear();
    console.log(res);
    if (!city.length || res['cod'] < 200 || res['cod'] > 299) {
        return;
    }
    else {
        city = toValidValue(city);
        weatherTime.innerText = toValidDate(res['timezone']);
        weatherGradus.innerText = Math.round(res['main']['temp']-273) + ' C';
        weatherType.innerText = res['weather'][0]['main'];
        weatherCity.innerText = res['name'];
        toValidWeather(res['weather'][0]['main']);
    }
}

weatherButton.addEventListener('click', weatherCheck);
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        weatherCheck();
    }
})




