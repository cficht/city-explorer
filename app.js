const express = require('express');
// const darkSkyData = require('./data/darksky.json');
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
        formatted_query: mungLatAndLong.formatted_query,
        latitude: mungLatAndLong.latitude,
        longitude: mungLatAndLong.longitude,
    });
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