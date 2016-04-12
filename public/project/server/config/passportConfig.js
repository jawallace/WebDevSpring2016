module.exports = function(passport, UserModel) {
    'use strict';

    var LocalStrategy = require('passport-local').Strategy;

    passport.use('project', new LocalStrategy(passportStrategy));

    return {
        requireAuthentication: requireAuthentication,
        authenticate: passport.authenticate('project')
    };

    //////////////////////////////////////////
    
    function passportStrategy(username, password, next) {
        UserModel
            .findByCredentials({ username: username, password: password })
            .then(function(user) {
                return user ? next(null, user) : next(null, false);
            }, function(err) {
                return next(err); 
            });
    }

    function requireAuthentication(req, res, next) {
        if (! req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }
}
