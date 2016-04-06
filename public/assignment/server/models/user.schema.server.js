var bcrypt = require('bcrypt');
var q = require('q');

var SALT_WORK_FACTOR = 10;

module.exports = function(mongoose) {
    'use strict';

    var UserSchema = mongoose.Schema({
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        firstName: String,
        lastName: String,
        emails: [String],
        phones: [String],
        roles: [{
            type: String,
            enum: [ "user", "admin" ]
        }]
    }, { collection: 'assignment.user' });

    // Password Hashing middleware.
    // Adopted from http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
    UserSchema.pre('save', function(next) {
        var user = this;

        if (! user.isModified('password')) {
            return next();
        }

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }

                user.password = hash;
                next();
            });
        });
    });

    UserSchema.methods.comparePassword = function(candidatePassword, cb) {
        var user = this;
        var deferred = q.defer();

        bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(isMatch);
            }
        });

        return deferred.promise;
    };

    return UserSchema;

}
