module.exports = function(app, UserModel) {

    var baseUrl = '/api/assignment/user';
    var idParam = baseUrl + '/:id';

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
        sendOr404(UserModel.findById(id), res);
    }

    function updateUser(req, res) {
        var id = parseInt(req.params.id);
        sendOr404(UserModel.update(id, req.body), res);
    }

    function deleteUser(req, res) {
        var id = parseInt(req.params.id);
        sendOr404(UserModel.delete(id), res);
    }

    function getUserByCredentials(credentials, res) {
        sendOr404(UserModel.findByCredentials(credentials), res);
    }

    function getUserByUsername(username, res) {
        sendOr404(UserModel.findByUsername(username), res);
    }

    function getAllUsers(res) {
        var users = UserModel.findAll();

        res.json(users);
    }

    function sendOr404(result, res) {
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
}
