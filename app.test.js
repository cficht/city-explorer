const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('It should respond with correct latitude and longitude',
        async(done) => {
            const response = await request(app)
                .get('/location');
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
    test('It should respond with correct forecast and time',
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