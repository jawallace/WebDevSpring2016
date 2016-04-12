module.exports = function(passport) {
    'use strict';
   
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    /////////////////////////////

    function serializeUser(user, next) {
        if (user.password) {
            user.password = undefined;
        }
        return next(null, user);
    }

    function deserializeUser(user, next) {
        next(null, user);
    }

}
