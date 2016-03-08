module.exports = function(app) {
    var UserModel = require('./models/user.model.js')();
    var FormModel = require('./models/form.model.js')();

    require('./services/user.service.server.js')(app, UserModel);
}
