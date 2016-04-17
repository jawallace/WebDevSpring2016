module.exports = function(app, User, Comment, Discussion, Reading, Group) {

    var services = {
        'user': User,
        'comment': Comment,
        'discussion': Discussion,
        'reading': Reading,
        'group': Group
    };

    app.param('userId', lookupByIdOnParam('user'));
    app.param('commentId', lookupByIdOnParam('comment'));
    app.param('discussionId', lookupByIdOnParam('discussion'));
    app.param('readingId', lookupByIdOnParam('reading'));
    app.param('groupId', lookupByIdOnParam('group'));

    ///////////////////////////////////////////////////
    
    function lookupByIdOnParam(field) {
        var service = services[field];
        return function(req, res, next, id) {
            service
                .findById(id)
                .then(function(value) {
                    if (! value) {
                        res.status(404).send(field + ' with id (' + id + ') not found.');
                        return;
                    }

                    if (! req.target) {
                        req.target = {};
                    }

                    req.target[field] = value;
                    next();
                })
                .catch(function(err) {
                    res.status(500).json(err);
                });
        };
    }

}
