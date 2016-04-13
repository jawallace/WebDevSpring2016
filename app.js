'use strict';

module.exports = function(mongoose) {
    var express = require('express');
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var passport = require('passport');

    var app = express();

    // Express Configuration
    app.use(express.static(__dirname + '/public'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(multer());

    app.use(session({ 
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    require('./config/passportConfig.js')(passport);

    require('./public/assignment/server/app.js')(app, mongoose, passport);
    require('./public/project/server/app.js')(app, mongoose, passport);

    return app;
}

