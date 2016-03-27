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
            UserService
                .findAllUsers()
                .then(function(users) {
                    vm.users = users;
                });

            var id = stateParams.id;
            DiscussionService
                .getDiscussionById(id)
                .then(function(discussion) {
                    resolveDiscussion(discussion);
                });
        }

        function deleteComment(comment) {
            DiscussionService
                .removeCommentFromDiscussion(vm.discussion.id, comment.id)
                .then(function(discussion) {
                    resolveDiscussion(discussion);
                });
        }

        function addComment() {
            var newComment = {
                user: vm.newComment.userDetails.id,
                text: vm.newComment.text
            };


            DiscussionService
                .addCommentToDiscussion(vm.discussion.id, newComment)
                .then(function(discussion) {
                    resolveDiscussion(discussion);
                }, function(err) {
                    console.log(err.data);    
                });
        }

        function resolveDiscussion(discussion) {
            vm.discussion = discussion;

            vm.comments = [];
            DiscussionService
                .getCommentsForDiscussion(discussion.id)
                .then(function(comments) {
                    for (var i = 0; i < comments.length; i++) {
                        var comment = comments[i];
                        (function(c) {
                            UserService
                                .findUserById(c.user)
                                .then(function(user) {
                                    c.userDetails = user; 
                                });
                        }(comment));
                        vm.comments.push(comment);
                    }
                });
        }
    }

}());
