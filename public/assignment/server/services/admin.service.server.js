module.exports = function(app, UserModel) {
    
    var passportConfig = require('../config/passport-config.js')(UserModel);
    var requireAuthentication = passportConfig.requireAuthentication;
    var isAdmin = isAdmin;

    var BASE_URL = '/api/assignment/admin/user';
    var USER_ID_URL = BASE_URL + '/:userId';

    app.post(BASE_URL,      requireAuthentication, isAdmin, createUser);
    app.get(BASE_URL,       requireAuthentication, isAdmin, getAllUsers);
    
    app.get(USER_ID_URL,    requireAuthentication, isAdmin, getUserById);
    app.delete(USER_ID_URL, requireAuthentication, isAdmin, deleteUser);
    app.put(USER_ID_URL,    requireAuthentication, isAdmin, updateUser);

    //////////////////////////////////////////////////
   
    function createUser(req, res) {
        UserModel
            .create(req.body)
            .then(function(user) {
                res.send(user);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    }

    function getAllUsers(req, res) {
        UserModel
            .findAll()
            .then(function(users) {
                res.send(users);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    }

    function getUserById(req, res) {
        UserModel
            .findById(req.params.userId)
            .then(function(user) {
                res.send(user);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    }

    function deleteUser(req, res) {
        UserModel
            .delete(req.params.userId)
            .then(function(users) {
                res.send(users);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    }

    function updateUser(req, res) {
        UserModel
            .update(req.params.userId, req.body)
            .then(function(user) {
                res.send(user);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    }

    function isAdmin(req, res, next) {
        if (req.user.roles.indexOf('admin') > -1) {
            next();
        } else {
            res.status(403).send();
        }
    }
}
