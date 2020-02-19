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


const getWeatherData = async(latitude, longitude) => {
    const darkSkyData = await request.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${latitude},${longitude}`);

    return darkSkyData.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000)
        };
    });
};

app.get('/weather', async(req, res, next) => {
    try {
        // latitude = 45.5234211;
        // longitude = -122.6809008;
        latitude = req.query.latitude;
        longitude = req.query.longitude;

        const portlandWeather = await getWeatherData(latitude, longitude);
        res.json(portlandWeather);

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

// console.log(getWeatherData(45.5234211, -122.6809008));
// console.log(longitude);

module.exports = {
    app: app
};