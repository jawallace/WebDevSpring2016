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

    /////////////////////////////////
    
    function activate() {
        var mockData = require('./user.mock.json');
        
        for (var i = 0; i < mockData.length; i++) {
            users.push(mockData[i]);
        }
    }

    function createUser(user) {
        user.username = user.username.toLowerCase();

        function sameUsername(u) {
            return u.username === user.username;
        }

        if (users.filter(sameUsername).length) {
            // do not create user with a username that already exists
            return;
        }

        user.id = utils.guid();
        users.push(user);

        return protectDetails(user);
    }

    function findAllUsers() {
        return users.map(function (u) { return protectDetails(u); });
    }

    function findUserById(id) {
        var u = findUser(id);

        if (u) {
            return protectDetails(u.user);
        }
    }

    function findByUsername(username) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                return protectDetails(users[i]);
            }
        }
    }

    function findByCredentials(credentials) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].username === credentials.username && users[i].password === credentials.password) {
                return protectDetails(users[i]);
            }
        }
    }

    function updateUser(id, user) {
        var u = findUser(id);

        if (u) {
            utils.extend(u.user, user);
            return protectDetails(u.user);
        }
    }

    function deleteUser(id) {
        var u = findUser(id);

        if (u) {
            users.splice(u.index, 1);
            return users.map(function(u) { return protectDetails(u); });
        }
    }

    function findUser(id) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                return {
                    index: i,
                    user: users[i]
                };
            }
        }
    }

    function protectDetails(u) {
        var copy = utils.copy(u);
        copy.password = undefined;

        return copy;
    }
}
