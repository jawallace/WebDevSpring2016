module.exports = function(app, UserModel) {

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
        var users = UserSerivce.create(req.body);

        res.send(users);
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
        var id = parseInt(req.params.id);
        console.log(id);
        utils.sendOr404(UserModel.findById(id), res, errorMsg);
    }

    function updateUser(req, res) {
        var id = parseInt(req.params.id);
        utils.sendOr404(UserModel.update(id, req.body), res, errorMsg);
    }

    function deleteUser(req, res) {
        var id = parseInt(req.params.id);
        utils.sendOr404(UserModel.delete(id), res, errorMsg);
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
