module.exports = function(app, UserModel, authenticate, security) {
    'use strict';

    var utils = require('../utils/util.js')();

    var LOGIN_URL = '/api/project/login';
    var LOGOUT_URL = '/api/project/logout';
    var LOGGED_IN_URL = '/api/project/loggedIn';

    var BASE_URL = '/api/project/user';
    var ID_PARAM_URL = BASE_URL + '/:userId';
    var LIKE_URL = ID_PARAM_URL + '/like';
    var LIKE_ID_URL = LIKE_ID_URL + '/:likeId';
    var ERROR_MSG = 'User not found';
    
    app.post(LOGIN_URL,      authenticate,                           login);
    app.post(LOGOUT_URL,                                             logout);
    app.get(LOGGED_IN_URL,                                           isLoggedIn);

    app.post(BASE_URL,                                               createUser);
    app.get(BASE_URL,                                                getUser);
    app.get(ID_PARAM_URL,                                            getUserById);
    app.put(ID_PARAM_URL,    security.auth, security.canManageUser,  updateUser);
    app.delete(ID_PARAM_URL, security.auth, security.canManageUser,  deleteUser);

    ////////////////////////////////////////////////////
    
    function login(req, res, next) {
        var user = req.user;
        res.json(user); 
    }

    function logout(req, res, next) {
        req.logOut();
        res.status(200).send();
    }

    function isLoggedIn(req, res, next) {
        res.send(req.isAuthenticated() ? req.user : false);    
    }

    function createUser(req, res) {
        var user = UserModel
            .create(req.body)
            .then(function(user) {
                req.login(user, function(err) {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        utils.sendOr404(user, res, ERROR_MSG);
                    }
                });
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }

    function getUser(req, res) {
        var username = req.query.username;

        if (username) {
            getUserByUsername(username, res);
        } else {
            getAllUsers(res);
        }
    }

    function getUserById(req, res) {
        res.json(req.target.user);
    }

    function updateUser(req, res) {
        UserModel
            .update(req.target.user._id, req.body)
            .then(function(user) {
                req.login(user, function(err) {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        utils.sendOr404(user, res, ERROR_MSG);
                    }
                });
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }

    function deleteUser(req, res) {
        UserModel
            .delete(req.target.user._id)
            .then(function(users) {
                if (req.target.user._id.toString() === req.user._id.toString()) {
                    req.logOut();
                }

                utils.sendOr404(users, res, ERROR_MSG);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getUserByUsername(username, res) {
        UserModel
            .findByUsername(username)
            .then(function(user) {
                utils.sendOr404(user, res, ERROR_MSG);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getAllUsers(res) {
        UserModel
            .findAll()
            .then(function(users) {
                utils.sendOr404(users, res, ERROR_MSG);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

}
