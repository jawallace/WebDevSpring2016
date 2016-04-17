module.exports = function(passport, UserModel) {
    'use strict';

    var LocalStrategy = require('passport-local').Strategy;

    passport.use('project', new LocalStrategy(passportStrategy));

    return passport.authenticate('project');

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

}
