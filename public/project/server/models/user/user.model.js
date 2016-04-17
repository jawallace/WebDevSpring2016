module.exports = function(mongoose) {
    'use strict';

    var utils = require('../../utils/util.js')();
    var User = require('./user.schema.js')(mongoose);
    
    var NO_PASSWORD = { password: 0 };

    var service = utils.deferService({
        create: createUser,
        findAll: findAllUsers,
        findById: findUserById,
        findByUsername: findByUsername,
        findByCredentials: findByCredentials,
        update: updateUser,
        delete: deleteUser,
        addGroup: addGroupToUser,
        removeGroup: removeGroupFromUser
    });

    activate();

    return service;

    /////////////////////////////////
    
    function activate() { 
        var admin = {
            username: process.env.CS4550_ADMIN_USERNAME,
            password: process.env.CS4550_ADMIN_PASSWORD,
            sudo: true
        };

        service
            .findByUsername(admin.username)
            .then(function(user) {
                if (user) {
                    return;
                }

                User.create(admin, function(err, user) {
                    if (err || !user) {
                        console.warn('Failed to create superuser.', err, user);
                    }
                });
            })
            .catch(function(err) {
                console.warn('Error while attempting to find superuser.', err);
            });
    }

    function createUser(resolve, reject, user) {
        if (user.sudo) {
            delete user.sudo;
        }

        User.create(user, function(err, doc) {
            if (err) {
                return reject(err);
            }

            doc.password = undefined;
            resolve(doc);
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
            
            if (! user) {
                return resolve(undefined);
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
        if (user.sudo) {
            delete user.sudo;
        }

        User.findById(id, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                utils.extend(doc, user);

                doc.save(function(err, updatedUser) {
                    if (err) {
                        return reject(err);
                    }

                    doc.password = undefined;
                    resolve(doc);
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

    function addGroupToUser(resolve, reject, userId, groupId) {
        User.findById(userId, function(err, user) {
            if (err) {
                return reject(err);
            }

            if (! user) {
                return reject({ error: 'Not found' });
            }

            user.groups.push(groupId);

            user.save(function(err, updatedUser) {
                return err ? reject(err) : resolve(user);
            });
        });
    }
    
    function removeGroupFromUser(resolve, reject, userId, groupId) {
        User.findById(userId, function(err, user) {
            if (err) {
                return reject(err);
            }

            var i = user.groups.indexOf(groupId);
            if (i < 0) {
                return resolve(user);
            }

            user.groups.splice(i, 1);

            user.save(function(err, updatedUser) {
                return err ? reject(err) : resolve(user);
            });
        });
    }
}
