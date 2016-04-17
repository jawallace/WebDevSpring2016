module.exports = function(app, mongoose, passport) {

    var BookModel = require('./models/book/book.model.server.js')();
    var UserModel = require('./models/user/user.model.js')(mongoose);
    var CommentModel = require('./models/comment/comment.model.js')(mongoose);
    var DiscussionModel = require('./models/discussion/discussion.model.js')(mongoose);
    var ReadingModel = require('./models/reading/reading.model.js')(mongoose);
    var GroupModel = require('./models/group/group.model.js')(mongoose);

    var authenticate = require('./config/passportConfig.js')(passport, UserModel);

    require('./config/serviceParams.js')(app, UserModel, CommentModel, DiscussionModel, ReadingModel, GroupModel);
    var security = require('./config/serviceSecurity.js')(app, UserModel, GroupModel);

    require('./services/book.service.server.js')(app, BookModel);
    require('./services/user.service.server.js')(app, UserModel, authenticate, security);
    require('./services/comment.service.server.js')(app, CommentModel, security);
    require('./services/discussion.service.server.js')(app, DiscussionModel, security);
    require('./services/reading.service.server.js')(app, ReadingModel, security);
    require('./services/group.service.server.js')(app, GroupModel, UserModel, security);

};

