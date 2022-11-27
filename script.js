$(function () {

    //These will be my const variables
    const citiesCatalog = $(".citiesCatalog");
    const primaryCity = $("h3.citySearch");
    const tempEl = $(".temp");
    const humidityEl = $(".humidity");
    const windSpeedEl = $(".windSpeed");

    //These will be my let variables
    let todaysDate = moment().format("L");
    let cityList = [];
    let blank = "";
    let cityTitle = "";
    let icon = "";
    let temp = "";
    let humidity = "";
    let windSpeed = "";

    let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c8fbc9fa3913556e3139dc773732726d`;
}

