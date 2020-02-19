const express = require('express');

const app = express();


app.get('/location', (request, response) => {
    response.json({
        some: 'json'
    });
});

app.get('*', (request, response) => {
    response.json({
        onNo: '404'
    });
});

app.listen(3000, () => { console.log('running...'); });