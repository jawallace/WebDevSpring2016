module.exports = function(mongoose) {
    'use strict';

    var utils = require('./util.js')();
    var UserSchema = require('./user.schema.server.js')(mongoose);
    
    var User = mongoose.model('User', UserSchema);

    var service = {
        create: utils.defer(createUser),
        findAll: utils.defer(findAllUsers),
        findById: utils.defer(findUserById),
        findByUsername: utils.defer(findByUsername),
        findByCredentials: utils.defer(findByCredentials),
        update: utils.defer(updateUser),
        delete: utils.defer(deleteUser)
    };

    activate();

    return service;

    ////////////////////////////////////////

    function activate() { }

    function createUser(resolve, reject, user) {
        User.create(user, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findAllUsers(resolve, reject) {
        User.find(function(err, docs) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findUserById(resolve, reject, id) {
        User.findById(id, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findByUsername(resolve, reject, username) {
        User.findOne({ username: username }, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findByCredentials(resolve, reject, credentials) {
        User.findOne(credentials, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function updateUser(reject, resolve, id, user) {
        User.findById(id, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                utils.extend(doc, user);

                doc.save(function(err, doc) {
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
                User.find(function(err, docs) {
                    return err ? reject(err) : resolve(docs);    
                });
            }
        });
    }
}
