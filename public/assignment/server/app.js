module.exports = function(app, mongoose, passport) {
    'use strict';

    var UserModel = require('./models/user.model.js')(mongoose);
    var FormModel = require('./models/form.model.js')(mongoose);

    var passportConfig = require('./config/passport-config.js')(passport, UserModel);

    require('./services/user.service.server.js')(app, UserModel, passportConfig);
    require('./services/admin.service.server.js')(app, UserModel, passportConfig);
    require('./services/form.service.server.js')(app, FormModel);
    require('./services/field.service.server.js')(app, FormModel);
}
