const weatherButton = document.querySelector('.weather-form__input_button');
const weatherGradus = document.querySelector('.weather-describe__text_gradus');
const weatherSearch = document.querySelector('.weather-form__input_search');
const weatherType = document.querySelector('.weather-describe__text_type');


const url = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiID = '&appid=248e2e1bc7ad8ac7b1d7f10d18947003';


weatherButton.addEventListener('click', weatherCheck);

let res;

async function weatherCheck() {
    const city = weatherSearch.value;
    const info = await fetch(url + city + apiID);
    res = await info.json();

    console.log(res);
    weatherGradus.innerText = Math.round(res['main']['temp']-273) + ' C';
    weatherType.innerText = res['weather'][0]['main']
}



