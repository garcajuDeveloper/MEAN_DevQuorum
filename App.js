const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', topicRoutes);

module.exports = app;