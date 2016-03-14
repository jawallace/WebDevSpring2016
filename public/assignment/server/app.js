module.exports = function(app) {
    'use strict';

    var UserModel = require('./models/user.model.js')();
    var FormModel = require('./models/form.model.js')();

    require('./services/user.service.server.js')(app, UserModel);
    require('./services/form.service.server.js')(app, FormModel);
    require('./services/field.service.server.js')(app, FormModel);
}
