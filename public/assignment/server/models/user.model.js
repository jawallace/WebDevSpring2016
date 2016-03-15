module.exports = function() {
    'use strict';

    var utils = require('./util.js')();
    
    var users = [];

    var service = {
        create: createUser,
        findAll: findAllUsers,
        findById: findUserById,
        findByUsername: findByUsername,
        findByCredentials: findByCredentials,
        update: updateUser,
        delete: deleteUser
    };

    activate();

    return service;

    function activate() {
        var mockData = require('./user.mock.json');
        
        for (var i = 0; i < mockData.length; i++) {
            users.push(mockData[i]);
        }
    }

    function createUser(user) {
        user['_id'] = new Date().getTime();
        users.push(user);

        return users;
    }

    function findAllUsers() {
        return users;
    }

    function findUserById(id) {
        var u = findUser(id);

        if (u) {
            return u.user;
        }
    }

    function findByUsername(username) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                return users[i];
            }
        }
    }

    function findByCredentials(credentials) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].username === credentials.username && users[i].password === credentials.password) {
                return users[i];
            }
        }
    }

    function updateUser(id, user) {
        var u = findUser(id);

        if (u) {
            utils.extend(u.user, user);
            return u.user;
        }
    }

    function deleteUser(id) {
        var u = findUser(id);

        if (u) {
            users.splice(u.index, 1);
            return users;
        }
    }

    function findUser(id) {
        for (var i = 0; i < users.length; i++) {
            if (users[i]['_id'] === id) {
                return {
                    index: i,
                    user: users[i]
                };
            }
        }
    }
}
