const weatherButton = document.querySelector('.weather-form__input_button');
const weatherGradus = document.querySelector('.weather-describe__text_gradus');
const weatherSearch = document.querySelector('.weather-form__input_search');
const weatherType = document.querySelector('.weather-describe__text_type');
const timeToPerm = document.querySelector('.weather-describe__text_img');

const url = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiID = '&appid=248e2e1bc7ad8ac7b1d7f10d18947003';

document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    date = date.getHours()
    if (date >= 8 && date <= 19 ) {
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
    return date;
}

async function weatherCheck() {
    let city = weatherSearch.value;
    if (!city.length) {
        return;
    }
    else {
        city = toValidValue(city);
        const info = await fetch(url + city + apiID);
        res = await info.json();
        console.clear();
        console.log(res);
        console.log(toValidDate(res['timezone']));
        weatherGradus.innerText = Math.round(res['main']['temp']-273) + ' C';
        weatherType.innerText = res['weather'][0]['main']
    }
}

weatherButton.addEventListener('click', weatherCheck);




