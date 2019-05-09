const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get('/test', (request, response) => {
    return response.status(200).send("<h1>I'm the NodeJS Backend</h1>");
});

module.exports = app;