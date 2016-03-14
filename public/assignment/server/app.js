module.exports = function(app) {
    var utils = require('./utils/utils.server.js')();
    var UserModel = require('./models/user.model.js')();
    var FormModel = require('./models/form.model.js')();

    require('./services/user.service.server.js')(app, UserModel, utils);
    require('./services/form.service.server.js')(app, FormModel, utils);
}
