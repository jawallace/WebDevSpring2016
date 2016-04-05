var initialized = false;

module.exports = function(UserModel) {
    'use strict';
    
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    
    if (! initialized) {
        passport.use(new LocalStrategy(passportStrategy));
        passport.serializeUser(serializeUser);
        passport.deserializeUser(deserializeUser);
        initialized = true;
    }

    return {
        requireAuthentication: requireAuthentication,
        authenticate: passport.authenticate('local'),
        passport: passport
    };

    ///////////////////////////////////////

    function passportStrategy(username, password, next) {
        UserModel
            .findByCredentials({ username: username, password: password })
            .then(function(user) {
                return user ? next(null, user) : next(null, false);
            }, function(err) {
                return next(err); 
            })
    }

    function serializeUser(user, next) {
        return next(null, user);
    }

    function deserializeUser(user, next) {
        UserModel
            .findById(user._id)
            .then(function(user) {
                return user ? next(null, user) : next(null, false);
            }, function(err) {
                return next(err);    
            })
    }

    function requireAuthentication(req, res, next) {
        if (! req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

}
