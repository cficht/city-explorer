require('dotenv').config();
const express = require('express');
// const darkSkyData = require('./data/darksky.json');
// const geoData = require('./data/geo.json');
const cors = require('cors');
const request = require('superagent');

const app = express();
app.use(cors());

let latitude;
let longitude;

app.get('/location', async(req, res, next) => {
    try {
        const location = req.query.search;
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;
        const locationData = await request.get(URL);
    
        const firstResult = locationData.body[0];
    
        latitude = firstResult.lat;
        longitude = firstResult.lon;
    
        res.json({
            formatted_query: firstResult.display_name,
            latitude: latitude,
            longitude: longitude,
        });
    } catch (err) {
        next(err);
    }
});


// const getWeatherData = (latitude, longitude) => {
//     return darkSkyData.daily.data.map(forecast => {
//         return {
//             forecast: forecast.summary,
//             time: new Date(forecast.time * 1000)
//         };
//     });
// };

app.get('/weather', async(req, res, next) => {
    try {
        // latitude = 45.5234211;
        // longitude = -122.6809008;
        latitude = request.query.latitude;
        longitude = request.query.longitude;

        const URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${latitude},${longitude}`;

        const darkSkyData = await request.get(URL);
        const weatherData = darkSkyData.body.daily;
        const time = weatherData.data[0].time;
        console.log(weatherData);

        // const portlandWeather = getWeatherData(req.query.latitude, req.query.longitude);

        res.json({
            forecast: weatherData.summary,
            time: new Date(time * 1000) });

    } catch (err) {
        next(err);
    }

});


app.get('*', (req, res) => {
    res.json({
        onNo: '404'
    });
});

// app.listen(3000, () => { console.log('running...'); });

console.log(latitude);
console.log(longitude)

module.exports = {
    app: app
};