var bcrypt = require('bcrypt');
var q = require('q');
var uniqueValidator = require('mongoose-unique-validator');
var SALT_WORK_FACTOR = 10;

module.exports = function(mongoose) {

    var LikeSchema = mongoose.Schema({
        group: { type: mongoose.Schema.ObjectId, required: true },
        reading: { type: mongoose.Schema.ObjectId, required: true },
        discussion: { type: mongoose.Schema.ObjectId, required: true },
        comment: { type: mongoose.Schema.ObjectId, required: true }
    });

    var UserSchema = mongoose.Schema({
        username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
        password: { type: String, required: true },
        firstName: String,
        lastName: String,
        groups: [mongoose.Schema.ObjectId],
        sudo: { type: Boolean, default: false },
        likes: { type: [LikeSchema], default: [ ] }
    }, { collection: 'project.user' });
    
    UserSchema.plugin(uniqueValidator);

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

    return mongoose.model('ProjectUser', UserSchema);

}

