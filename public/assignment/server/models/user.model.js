module.exports = function(mongoose) {
    'use strict';

    var utils = require('./util.js')();
    var UserSchema = require('./user.schema.server.js')(mongoose);

    var User = mongoose.model('User', UserSchema);
    
    var NO_PASSWORD = { password: 0 };

    var service = {
        create:             utils.defer(createUser),
        findAll:            utils.defer(findAllUsers),
        findById:           utils.defer(findUserById),
        findByUsername:     utils.defer(findByUsername),
        findByCredentials:  utils.defer(findByCredentials),
        update:             utils.defer(updateUser),
        delete:             utils.defer(deleteUser)
    };

    activate();

    return service;

    ////////////////////////////////////////

    function activate() { 
        var admin = {
            username: process.env.CS4550_ADMIN_USERNAME,
            password: process.env.CS4550_ADMIN_PASSWORD,
            firstName: 'Admin',
            emails: [],
            phones: [],
            roles: ['admin']
        };

        service.findByUsername(admin.username)
            .then(function(user) {
                if (user) {
                    console.info('Admin user found, not inserting a new admin into db.');
                    return;
                }

                console.info('Did not find admin user, inserting new admin...');
                User.create(admin, function(err, user) {
                    if (err || !user) {
                        console.warn('Failed to create admin user.', err, user);
                    } else {
                        console.info('Successfully created admin user.');
                    }
                });
            })
            .catch(function(err) {
                console.warn('Error while attempting to find admin user.', err);
            });
    }

    function createUser(resolve, reject, user) {
        User.create(user, function(err, doc) {
            doc.password = undefined;
            return err ? reject(err) : resolve(doc);
        });
    }

    function findAllUsers(resolve, reject) {
        User.find({}, NO_PASSWORD, function(err, docs) {
            return err ? reject(err) : resolve(docs);
        });
    }

    function findUserById(resolve, reject, id) {
        User.findById(id, NO_PASSWORD, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findByUsername(resolve, reject, username) {
        User.findOne({ username: username }, NO_PASSWORD, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findByCredentials(resolve, reject, credentials) {
        User.findOne({ username: credentials.username }, function(err, user) {
            if (err) {
                return reject(err);
            }

            user
                .comparePassword(credentials.password)
                .then(function(isMatch) {
                    user.password = undefined;
                    return isMatch ? resolve(user) : resolve(false);
                })
                .catch(function(err) {
                    return reject(err);
                });
        });
    }

    function updateUser(resolve, reject, id, user) {
        User.findById(id, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                utils.extend(doc, user);

                doc.save(function(err, doc) {
                    doc.password = undefined;
                    return err ? reject(err) : resolve(doc);
                });
            }
        });
    }

    function deleteUser(resolve, reject, id) {
        User.findById(id).remove(function(err) {
            if (err) {
                reject(err);
            } else {
                User.find({}, NO_PASSWORD, function(err, docs) {
                    return err ? reject(err) : resolve(docs);    
                });
            }
        });
    }

}
