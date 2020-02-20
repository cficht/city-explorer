require('dotenv').config();
const express = require('express');
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

app.get('/events', async(req, res, next) => {
    try {
        const eventful = await request
            .get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&where=${latitude},${longitude}&within=25`); 

        const eventfulObject = JSON.parse(eventful.text);
        const eventfulMap = eventfulObject.events.event.map(event => {
            return {
                link: event.url,
                name: event.title,
                event_date: event.start_time,
                summary: event.description === null ? 'N/A' : event.description,
            };
        });
    
        res.json(eventfulMap);
    } catch (err) {
        next(err);
    }
});


app.get('/reviews', async(req, res, next) => {
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

app.get('/trails', async(req, res, next) => {
    try {
        const trails = await request
            .get(`https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAILS_API_KEY}`); 

        const trailsObject = JSON.parse(trails.text);
        const trailsMap = trailsObject.trails.map(trail => {
            return {
                name: trail.name,
                location: trail.location,
                length: trail.length,
                stars: trail.stars,
                star_votes: trail.starVotes,
                summary: trail.summary,
                trail_url: trail.url,
                conditions: trail.conditionStatus,
                condition_date: trail.conditionDate.split(' ')[0],
                condition_time: trail.conditionDate.split(' ')[1]
            };
        });    
        res.json(trailsMap);
    } catch (err) {
        next(err);
    }
});


app.get('*', (req, res) => {
    res.json({
        onNo: '404'
    });
});

module.exports = {
    app: app
};