const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const https = require("https");
const moment = require('moment');

const app = express();
const optionsDate = { month: 'long', day: 'numeric' };
const optionsDay = { weekday: 'long' };
const currentDate = new Date().toLocaleDateString('en-US', optionsDate);
const currentDay = new Date().toLocaleString('en-US', optionsDay);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentTime = moment().format('h:mm:ss A'); // Initialize current time with moment.js

app.get('/', (req, res) => {
  res.render('homepage', { currTime: currentTime });
});

// Update currentTime every second
setInterval(() => {
  currentTime = moment().format('h:mm:ss A');
}, 1000);

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "66d42596dbefb882f16981f98be36c54";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=metric";

  https.get(url, function (response) {
    response.on("data", function (data) {
      let weatherData = JSON.parse(data);
      if (weatherData.cod === "404") {
        // Handle error when city is not found
        res.render("homepage", { error: "City not found :(" });
        res.locals.hideError = true;
        return;
      }

      let cityName = weatherData.name;

      let temperature = weatherData.main.temp;
      let desc = weatherData.weather[0].description;
      let icon = weatherData.weather[0].icon;
      let imageURL =
        "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      let feelLike = weatherData.main.feels_like;
      let tempimg =
        "https://cdn.pixabay.com/photo/2013/07/13/12/12/hot-159386_960_720.png";

      let timezone = weatherData.timezone;
      let sr = weatherData.sys.sunrise;
      let ss = weatherData.sys.sunset;
      let sunrise = moment.utc(sr, "X").add(timezone, "seconds").format("hh:mm A");
      let sunset = moment.utc(ss, "X").add(timezone, "seconds").format("hh:mm A");

      let humidity = weatherData.main.humidity;
      let visibility = weatherData.visibility / 1000;
      let airpressure = weatherData.main.pressure;
      let windspeed = weatherData.wind.speed;

      res.render("weather", {
        city : cityName,
        currTime: currentTime,
        currDate: currentDate,
        currDay: currentDay,
        condition: desc,
        currTemp: temperature,
        tempImg: tempimg,
        feelsLike: feelLike,
        image: imageURL,
        sunRise: sunrise,
        sunSet: sunset,
        humiDity: humidity,
        visiBility: visibility,
        windSpeed: windspeed,
      });
    });
  }).on("error", (error) => {
    // Handle error when there's an issue with the request
    console.error("Error retrieving weather data:", error);
    res.render("homepage", { currTime: currentTime, error: "Error retrieving weather data" });
  });
});

app.listen(3000, () => {
    console.log('App is running at port 3000 🥥');
});

// Update currentTime every second
setInterval(() => {
    currentTime = moment().format('h:mm:ss A');
}, 1000);


// updated code 🌸