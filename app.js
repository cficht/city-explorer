const express = require('express');
const darkSkyData = require('./data/darksky.json');
const geoData = require('./data/geo.json');

const app = express();

const getLatGetLong = (number) => {
    const data = geoData.results;

    const dataMapped = data.map(address => {
        const addresses = {};

        addresses.formatted_query = address.formatted_address;
        addresses.latitude = address.geometry.location.lat;
        addresses.longitude = address.geometry.location.lng;
        
        return addresses;
    });
    return dataMapped[number];
};

app.get('/location', (request, response) => {
    const mungLatAndLong = getLatGetLong(0);
    response.json({
        name: request.query.name,
        formatted_query: mungLatAndLong.formatted_query,
        latitude: mungLatAndLong.latitude,
        longitude: mungLatAndLong.longitude,
    });
});

const getWeatherData = (latitude, longitude) => {
    return darkSkyData.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time)
        };
    });
};

app.get('/weather', (request, response) => {
    // use the lat and long from earlier to get weather data for the selected area
    const portlandWeather = getWeatherData(request.query.latitude, request.query.longitude);

    // res.js that weather data in the appropriate form
    response.json(portlandWeather);
});

app.get('*', (request, response) => {
    response.json({
        onNo: '404'
    });
});

// app.listen(3000, () => { console.log('running...'); });

// console.log(getLatGetLong(0));

module.exports = {
    app: app
};