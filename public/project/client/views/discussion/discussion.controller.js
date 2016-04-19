(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('DiscussionController', DiscussionController);

    DiscussionController.$inject = [ 'DiscussionService', 'UserService', 'CommentService', 'GroupService', '$stateParams', 'user' ];
    function DiscussionController(DiscussionService, UserService, CommentService, GroupService, $stateParams, loggedInUser) {
        var vm = this;
       
        var loc = $stateParams.loc;
        var locWithDiscussion = angular.copy(loc);
        locWithDiscussion.discussion = $stateParams.discussionId;

        vm.discussion;
        vm.comments = [];
        vm.newCommentText;
        vm.isAdmin;
        vm.user;

        vm.addComment = addComment;
        vm.onRemove = onRemove;

        activate();

        /////////////////////////////////////////

        function activate() {
            vm.user = loggedInUser;
            vm.isAdmin = _checkIfAdmin();
            _getDiscussion();
            _getComments();
        }

        function addComment() {
            CommentService
                .createComment(locWithDiscussion, vm.newCommentText)
                .then(function(c) {
                    c.loc = locWithDiscussion;
                    vm.comments.push(c);
                    vm.newCommentText = '';
                })
                .catch(function(err) {
                    console.log(err);
                });
        }

        function onRemove() {
            activate();
        }

        function _getDiscussion() {
            DiscussionService
                .getDiscussionById(loc, locWithDiscussion.discussion)
                .then(function(discussion) {
                    vm.discussion = discussion;
                    return UserService.findUserById(discussion.user);
                })
                .then(function(user) {
                    user.name = user.firstName ? user.firstName + ' ' + user.lastName : user.username;
                    vm.discussion.userDetails = user;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }

        function _getComments() {
            CommentService
                .getCommentsForDiscussion(locWithDiscussion) 
                .then(function(comments) {
                    comments.forEach(function(c) {
                        c.loc = locWithDiscussion;
                    });

                    vm.comments = comments;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
        
        function _checkIfAdmin() {
            GroupService
                .getGroupById({ group: loc.group })
                .then(function(group) {
                    vm.isAdmin = group.admins.indexOf(loggedInUser._id) > -1;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    }

}());
