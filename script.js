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

    //looks to see if theres anything in the local storage and will populate the most recent ones
    pullCitiesInLocalStorage();

    //Calls the APIS when the search button is clicked
    $(".searchBtn").on("click", function (event) {
        event.preventDefault();
        let cityTitle = $("#inputCity").val();

        ajaxCalls(cityTitle, function () {
            ajaxCalls(cityTitle);
            addCitiesLS(cityTitle);
            $("ul.citiesCatalog").clear();
            pullCitiesInLocalStorage();
        });
    });

    //Clears local storage when the button is clicked
    $(".clearBtn").on("click", function () {
        localStorage.clear();
    });

    // when city in list clicked, populate most recent search on screen
    $("button.buttonCity").on("click", function (event) {
        event.preventDefault();
        cityTitle = $(this).text();
        ajaxCalls(cityTitle);
        primaryCity.html(`${cityTitle} &nbsp (${todaysDate})`);
    });

    function ajaxCalls(city, callBack) {
        blank = "";

        // clears text in input spot when search button is clicked
        $("#inputCity").val(blank);

        let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c8fbc9fa3913556e3139dc773732726d`;

        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                let lat = response.coord.lat;
                let lon = response.coord.lon;

                if (callBack) {
                    callBack();
                }
                //gets temperature
                temp = response.main.temp;
                temp = Math.floor((temp - 273.15) * 9 / 5 + 32);
                temp = `${temp}`;
                tempEl.html(temp);

                //gets humidity
                humidity = response.main.humidity;
                humidity = `${humidity} %`;
                humidityEl.html(humidity);

                //gets Wind Speed
                windSpeed = response.wind.speed;
                windSpeed = `${windSpeed} mph`;
                windSpeedEl.html(windSpeed);

                //gets weather icon
                icon = response.weather[0].icon;
                $(".weatherIcon").attr("src", `http://openweathermap.org/img/wn/${icon}.png`).attr("alt", response.weather[0].description);

                // for the forecasted weather API
                let forecastedWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
                exclude=&appid=25d3fdfe342a19e8d55725db62d19795`;
                
                $.ajax({
                    url: forecastedWeatherURL,
                    method: "GET"
                })
                    .then(function (response) {
                        console.log(response);
                        //iterates through the icons, descriptions, temp and humidity
                        for (let i = 1; i < 6; i++) {
                            $(`span.date${i}`).text(moment().add(i - 1, 'd').format('l'));
                            let icon5 = response.daily[i - 1].weather[0].icon;
                            let description5 = response.daily[i - 1].weather[0].description;
                            $(`img.icon${i}`).attr('src', `http://openweathermap.org/img/wn/${icon5}.png`).attr("alt", description5);
                            let temp5 = response.daily[i - 1].temp.day;
                            $(`span.temperature${i}`).text(Math.round((temp5 - 273.15) * 9 / 5 + 32));
                            let humidity5 = response.daily[i - 1].humidity
                            $(`span.humidity${i}`).text(humidity5);
                            let windSpeed5 = response.daily[i - 1].windSpeed
                            $(`span.windSpeed${i}`).text(windSpeed5);
                        }
                    });
                //adds most recent city name and todays date
                primaryCity.html(`${city} &nbsp (${todaysDate})`);
            })
        };

    // add cities to the page
    function addCitiesLS(citySearch) {
                    // adds to the local storage
                    cityList = localStorage.getItem("cityTitles");
                    cityList = JSON.parse(cityList) || [];
                    cityList.push(citySearch);
                    // looks at local storage and sets an item from the area
                    localStorage.setItem("cityTitles", JSON.stringify(cityList));
                    //adds list items and city names to the screen
                    let listItem = $("<li class='cityTitleinList'>");
                    let buttonElement = $(`<button class='buttonCity ${citySearch}'>`);
                        //adds most recent city name and today's date to the dashboard
                        primaryCity.html(`${citySearch} &nbsp (${todaysDate})`);
                        citiesCatalog.append(listItem);
                        listItem.append(buttonElement);
                        buttonElement.html(citySearch);
                }

    //Gets most recent searches from local storage and shows on screen
    function pullCitiesInLocalStorage() {
                    let weatherInfoArray = [];
                    weatherInfoArray = JSON.parse(localStorage.getItem("cityTitles"));
                    //if there is something in the weather array local storage then it will pull it up
                    if (weatherInfoArray !== null) {
                        for (let i = 0; i < weatherInfoArray.length; i++) {
                            let listItem = $("<li class='cityTitleinList'>");
                            let buttonElement = $("<button class='buttonCity'>");
                            citiesCatalog.append(listItem);
                            listItem.append(buttonElement);
                            buttonElement.html(weatherInfoArray[i]);
                        }
                        if (weatherInfoArray[0]) {
                            cityTitle = weatherInfoArray[weatherInfoArray.length - 1];
                            ajaxCalls(weatherInfoArray[weatherInfoArray.length - 1]);
                            primaryCity.html(`${cityTitle} &nbsp (${todaysDate})`);
                        }
                    }
                }
});