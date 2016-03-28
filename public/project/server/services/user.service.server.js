module.exports = function(app, UserModel) {
    'use strict';

    var utils = require('./util.js')();

    var BASE_URL = '/api/project/user';
    var ID_PARAM_URL = BASE_URL + '/:id';
    
    var LOGIN_URL = '/api/project/login';
    var LOGGED_IN_URL = '/api/project/loggedIn';
    var LOGOUT_URL = '/api/project/logout';

    var errorMsg = 'User not found';

    app.post(BASE_URL, createUser);
    app.get(BASE_URL, getUser);
   
    app.get(ID_PARAM_URL, getUserById);
    app.put(ID_PARAM_URL, updateUser);
   
    app.delete(ID_PARAM_URL, deleteUser);

    app.post(LOGIN_URL, login);
    app.get(LOGGED_IN_URL, loggedIn);
    app.post(LOGOUT_URL, logout);

    /////////////////////////////////////////
    
    function createUser(req, res) {
        var user = UserModel.create(req.body);
        
        if (user) {
            res.send(user);
        } else {
            res.status(400).send('User with username ' + req.body.username + ' already exists');
        }
    }

    function getUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if (username) {
            getUserByUsername(username, res);
        } else {
            getAllUsers(res);
        }
    }

    function getUserById(req, res) {
        var id = req.params.id;
        utils.sendOr404(UserModel.findById(id), res, errorMsg);
    }

    function updateUser(req, res) {
        var id = req.params.id;

        if (req.session.currentUser) {
            res.status(401).send('Not authorized');
        } else if (req.session.currentUser.id !== id) {
            res.status(403).send('You cannot update another user.');
        } else {
            utils.sendOr404(UserModel.update(id, req.body), res, errorMsg);
        }
    }

    function deleteUser(req, res) {
        var id = req.params.id;
        
        if (req.session.currentUser) {
            res.status(401).send('Not authorized');
        } else if (req.session.currentUser.id !== id) {
            res.status(403).send('You cannot update another user.');
        } else {
            utils.sendOr404(UserModel.delete(id), res, errorMsg);
        }
    }

    function login(req, res) {
        var credentials = req.body;
        var user = UserModel.findByCredentials(credentials);

        if (user) {
            req.session.currentUser = user;
            res.json(user);
        } else {
            res.status(404).send(errorMsg);
        }
    }

    function loggedIn(req, res) {
        res.json(req.session.currentUser);
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }

    function getUserByCredentials(credentials, res) {
        utils.sendOr404(UserModel.findByCredentials(credentials), res, errorMsg);
    }

    function getUserByUsername(username, res) {
        utils.sendOr404(UserModel.findByUsername(username), res, errorMsg);
    }

    function getAllUsers(res) {
        var users = UserModel.findAll();

        res.json(users);
    }

}
