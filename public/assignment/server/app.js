module.exports = function(app, mongoose) {
    'use strict';

    var UserModel = require('./models/user.model.js')(mongoose);
    var FormModel = require('./models/form.model.js')(mongoose);

    require('./services/user.service.server.js')(app, UserModel);
    require('./services/form.service.server.js')(app, FormModel);
    require('./services/field.service.server.js')(app, FormModel);
}
