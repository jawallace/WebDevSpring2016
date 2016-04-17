module.exports = function(app) {

    app.use('/api/project/group/:groupId', guardGroupAccess);

    return {
        auth: requireAuthentication,
        admin: requireAdmin,
        canManageComment: canManageComment,
        canManageDiscussion: canManageDiscussion,
        canManageUser: canManageUser,
        isGroupMember: isGroupMember
    };

    ////////////////////////////////////
    
    function requireAuthentication(req, res, next) {
        if (! req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function requireAdmin(req, res, next) {
        if (userIsAdminOfGroup(req) || isSuperUser(req)) {
            return next();
        }

        res.status(403).send('User (' + req.user._id + ') is not an admin of group (' + req.target.group._id + ')');
    }

    function canManageComment(req, res, next) {
        if (userIsAdminOfGroup(req) || isSuperUser(req)) {
            return next();
        }

        if (req.target.comment.user.toString() === req.user._id.toString()) {
            return next();
        }

        res.status(403).send('User (' + req.user._id + ') cannot modify comment (' + req.target.comment._id + ')');
    }

    function canManageDiscussion(req, res, next) {
        if (userIsAdminOfGroup(req) || isSuperUser(req)) {
            return next();
        }

        if (req.target.discussion.user.toString() === req.user._id.toString()) {
            return next();
        }

        res.status(403).send('User (' + req.user._id + ') cannot modify discussion (' + req.target.discussion._id + ')');
    }

    function canManageUser(req, res, next) {
        if (isSuperUser(req)) {
            return next();
        }

        if (req.target.user._id.toString() === req.user._id.toString()) {
            return next();
        }
        
        res.status(403).send('You cannot modify another user\'s information.');
    }

    function isGroupMember(req, res, next) {
        if (isSuperUser(req)) {
            return next();
        }

        if (isGroupMember(req)) {
            return next();
        }

        res.status(403).send('User (' + req.user._id + ') is not a member of group (' + req.target.group._id + ')');
    }

    function guardGroupAccess(req, res, next) {
        if (isPublicGroup(req)) {
            return next();
        }

        if (! req.isAuthenticated()) {
            res.status(401).send();
            return;
        }

        if (userIsMemberOfGroup(req)) {
            return next();
        }

        if (isSuperUser(req)) {
            return next();
        }

        res.status(403).send();
    }
    
    function userIsAdminOfGroup(req) {
        return req.target.group.admins.indexOf(req.user._id.toString()) > -1;
    }
    
    function userIsMemberOfGroup(req) {
        return req.user.groups.indexOf(req.target.group._id.toString()) > -1;
    }

    function isPublicGroup(req) {
        return req.target.group.visibility === 'PUBLIC';
    }

    function isSuperUser(req) {
        return req.user.sudo;
    }
}
