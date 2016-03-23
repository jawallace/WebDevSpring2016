module.exports = function(app) {
    var BookModel = require('./models/book.model.server.js')();
    var UserModel = require('./models/user.model.js')();

    require('./services/book.service.server.js')(app, BookModel);
    require('./services/user.service.server.js')(app, UserModel);
};

