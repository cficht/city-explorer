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
        const portlandWeather = await getWeatherData(latitude, longitude);
        res.json(portlandWeather);

    } catch (err) {
        next(err);
    }
});


app.get('/yelp', async(req, res, next) => {
    try {
        const yelpStuff = await request
            .get(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${latitude}&longitude=${longitude}`)
            .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);
            
        const yelpObject = JSON.parse(yelpStuff.text);
        const yelpBusinesses = yelpObject.businesses.map(business => {
            return {
                name: business.name,
                image_url: business.image_url,
                price: business.price,
                rating: business.rating,
                url: business.url
            };
        });

        res.json(yelpBusinesses);
    } catch (err) {
        next(err);
    }
});

app.get('/events', async(req, res) => {
    try {

        const eventful = await request
            .get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&where=${latitude},${longitude}&within=25`); 

        const eventfulObject = JSON.parse(eventful.text);
        const eventfulMap = eventfulObject.events.event.map(event => {
            return {
                link: event.url,
                name: event.title,
                date: event.start_time,
                summary: event.description,
            };
        });
    
        res.json(eventfulMap);
    } catch (err) {
        res.status(500).send('Sorry something went wrong, please try again');
    }
});


app.get('*', (req, res) => {
    res.json({
        onNo: '404'
    });
});

// app.listen(3000, () => { console.log('running...'); });

module.exports = {
    app: app
};