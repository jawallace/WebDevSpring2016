module.exports = function(mongoose) {
    'use strict';

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        emails: [String],
        phones: [String],
        roles: [{
            type: String,
            enum: [ "user", "admin" ]
        }]
    }, { collection: 'assignment.user' });

    return UserSchema;

}
