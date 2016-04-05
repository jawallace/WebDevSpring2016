'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');

var connectionString = 'mongodb://localhost/cs4550';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = 
        process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString);

var app = express();

// Express Configuration
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUnititialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;

require('./public/project/server/app.js')(app);
require('./public/assignment/server/app.js')(app, mongoose);

// Kick off Express server
app.listen(PORT, IP_ADDRESS);

