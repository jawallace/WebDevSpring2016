module.exports = function(app, UserModel) {
    'use strict';

    var utils = require('./util.js')();

    var baseUrl = '/api/assignment/user';
    var idParam = baseUrl + '/:id';
    var errorMsg = 'User not found';

    app.post(baseUrl, createUser);
    app.get(baseUrl, getUser);
    app.get(idParam, getUserById);
    app.put(idParam, updateUser);
    app.delete(idParam, deleteUser);

    function createUser(req, res) {
        var user = UserModel
            .create(req.body)
            .then(function(user) {
                utils.sendOr404(user, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function getUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if (username && password) {
            getUserByCredentials({ username: username, password: password }, res);
        } else if (username) {
            getUserByUsername(username, res);
        } else {
            getAllUsers(res);
        }
    }

    function getUserById(req, res) {
        UserModel
            .findById(req.params.id)
            .then(function(user) {
                utils.sendOr404(user, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function updateUser(req, res) {
        UserModel
            .update(req.params.id, req.body)
            .then(function(user) {
                utils.sendOr404(user, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function deleteUser(req, res) {
        UserModel
            .delete(req.params.id)
            .then(function(users) {
                utils.sendOr404(users, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function getUserByCredentials(credentials, res) {
        UserModel
            .findByCredentials(credentials)
            .then(function(user) {
                utils.sendOr404(user, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function getUserByUsername(username, res) {
        UserModel
            .findByUsername(username)
            .then(function(user) {
                utils.sendOr404(user, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function getAllUsers(res) {
        UserModel
            .findAllUsers()
            .then(function(users) {
                utils.sendOr404(users, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

}
