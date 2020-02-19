const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('It should respond with correct latitude and longituden',
        async(done) => {
            const response = await request(app)
                .get('/location/0');
            expect(response.body).toEqual({
                formatted_query: '30 NW 10th Ave, Portland, OR 97209, USA',
                latitude: 45.5234211,
                longitude: -122.6809008,
            });
            expect(response.statusCode).toBe(200);
            done();
        });
});