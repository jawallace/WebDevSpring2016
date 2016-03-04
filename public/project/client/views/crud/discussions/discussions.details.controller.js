(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('DiscussionDetailsController', DiscussionDetailsController);

    DiscussionDetailsController.$inject = [ 'DiscussionService', 'CommentService', 'UserService', '$stateParams' ]
    function DiscussionDetailsController(DiscussionService, CommentService, UserService, $stateParams) {
        var vm = this;

        vm.comments = [];
        vm.users = [];
        vm.discussion = [];
        vm.newComment = { text: '', userDetails: { firstName: '' } }

        vm.deleteComment = deleteComment;
        vm.addComment = addComment;

        activate();

        function activate() {
            UserService.findAllUsers(function(users) {
                vm.users = users;
            });

            var id = parseInt($stateParams.id);
            DiscussionService.getDiscussionById(id, function(discussion) {
                resolveDiscussion(discussion);
            });
        }

        function deleteComment(comment) {
            DiscussionService.removeCommentFromDiscussion(vm.discussion.id, comment.id, function(discussion) {
                resolveDiscussion(discussion);
            });
        }

        function addComment() {
            var newComment = {
                user: vm.newComment.userDetails.id,
                text: vm.newComment.text
            };

            CommentService.createComment(newComment, function(comment) {
                DiscussionService.addCommentToDiscussion(vm.discussion.id, comment.id, function(discussion) {
                    resolveDiscussion(discussion);
                });
            });
        }

        function resolveDiscussion(discussion) {
            vm.discussion = discussion;

            vm.comments = [];
            var commentIds = discussion.comments;
            for (var i = 0; i < commentIds.length; i++) {
                CommentService.getCommentById(commentIds[i], function(comment) {
                    console.log(commentIds[i], comment);

                    UserService.findUserById(comment.user, function(user) {
                        comment.userDetails = user; 
                    });

                    vm.comments.push(comment);
                });
            }
        }
    }
}());
