module.exports = function(app) {
    var BookModel = require('./models/book.model.server.js')();
    
    require('./services/book.service.server.js')(app, BookModel);
};

