const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('It should respond with latitude and longitude',
        async(done) => {
            const response = await request(app)
                .get('/location?search=Portland');
            expect(response.body).toEqual({
                formatted_query: expect.any(String),
                latitude: expect.any(String),
                longitude: expect.any(String),
            });
            expect(response.statusCode).toBe(200);
            done();
        });
});

describe('/GET /weather', () => {
    test('It should respond with forecast and time',
        async(done) => {
            const response = await request(app)
                .get('/weather');
            expect(response.body[0]).toEqual({
                forecast: expect.any(String),
                time: expect.any(String),
            });
            expect(response.statusCode).toBe(200);
            done();
        });
});

describe('/GET /events', () => {
    test('It should respond with link, name, event date and summary',
        async(done) => {
            const response = await request(app)
                .get('/events');
            expect(response.body[0]).toEqual({
                link: expect.any(String),
                name: expect.any(String),
                event_date: expect.any(String),
                summary: expect.any(String)
            });
            expect(response.statusCode).toBe(200);
            done();
        });
});

describe('/GET /reviews', () => {
    test('It should respond with name, image url, price, rating and url',
        async(done) => {
            const response = await request(app)
                .get('/reviews');
            expect(response.body[0]).toEqual({
                name: expect.any(String),
                image_url: expect.any(String),
                price: expect.any(String),
                rating: expect.any(Number),
                url: expect.any(String)
            });
            expect(response.statusCode).toBe(200);
            done();
        });
});

describe('/GET /trails', () => {
    test('It should respond with name, location, stars, star votes, summary, trail url, coniditions, conditions date, conditions time',
        async(done) => {
            const response = await request(app)
                .get('/trails');
            expect(response.body[0]).toEqual({
                name: expect.any(String),
                location: expect.any(String),
                length: expect.any(Number),
                stars: expect.any(Number),
                star_votes: expect.any(Number),
                summary: expect.any(String),
                trail_url: expect.any(String),
                conditions: expect.any(String),
                condition_date: expect.any(String),
                condition_time: expect.any(String),
            });
            expect(response.statusCode).toBe(200);
            done();
        });
});