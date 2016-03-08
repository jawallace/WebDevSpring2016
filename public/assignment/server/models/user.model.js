module.exports = function(app) {

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
        var mockData = require('user.mock.json');
        
        for (var i = 0; i < mockData.length; i++) {
            users.push(mockData[i]);
        }
    }

    function createUser(user) {
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
            for (var key in user) {
                if (user.hasOwnProperty(key)) {
                    u.user[key] = user[key];    
                }
            }

            return u.user;
        }
    }

    function deleteUser(id) {
        var u = findUser(id);

        if (u) {
            users.splice(u.index, 1);
            return u.user;
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
}
