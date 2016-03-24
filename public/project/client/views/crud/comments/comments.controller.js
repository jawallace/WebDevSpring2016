(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('CRUDCommentsController', CRUDCommentsController);

    CRUDCommentsController.$inject = [ 'CommentService', 'UserService' ];
    function CRUDCommentsController(CommentService, UserService) {
        var vm = this;

        var selectedIndex;
        vm.selected = emptySelection(); // ng-model for selected comment
        vm.comments = []; // the comments to render
        vm.users = []; // the available users

        vm.addComment = addComment;
        vm.updateComment = updateComment;
        vm.deleteComment = deleteComment;
        vm.selectComment = selectComment;

        activate();

        return;

        function activate() {
            UserService
                .findAllUsers()
                .then(function(users) {
                    vm.users = users;
                });
            
            CommentService
                .getAllComments()
                .then(function(comments) {
                    normalizeComments(comments);
                });
        }

        function addComment() {
            var newComment = {
                user: vm.selected.userDetails.id,
                text: vm.selected.text,
                parentComment: vm.selected.parentComment
            };

            CommentService.createComment(newComment, function(comment) {
                comment.userDetails = vm.selected.userDetails;
                vm.comments.push(comment);

                resetSelection();
            });
        }

        function updateComment() {
            var selectedComment = vm.comments[selectedIndex];

            var updated = {
                user: vm.selected.userDetails.id,
                text: vm.selected.text,
                parentComment: vm.selected.parentComment
            };

            CommentService
                .updateComment(selectedComment.id, updated)
                .then(function(updatedComment) {
                    updatedComment.userDetails = vm.selected.userDetails;
                    vm.comments[selectedIndex] = updatedComment;

                    resetSelection();
                });
        }

        function deleteComment(comment) {
            CommentService
                .deleteComment(comment.id, function(comments) {
                    normalizeComments(comments);
                });
        }

        function selectComment(index) {
            selectedIndex = index;
            var comment = vm.comments[selectedIndex];

            vm.selected.id = comment.id;
            vm.selected.user = comment.user;
            vm.selected.userDetails = comment.userDetails;
            vm.selected.text = comment.text;
            vm.selected.parentComment = comment.parentComment || '';
        }

        function normalizeComments(comments) {
            var normalized = [];
            
            var length = comments.length;
            for (var i = 0; i < length; i++) {
                var theComment = comments[i];

                (function(c) {
                    UserService
                        .findUserById(c.user)
                        .then(function(user) {
                            c.userDetails = user;
                            normalized.push(c);
                        });
                }(theComment));
            }

            vm.comments = normalized;
        }

        function emptySelection() {
            return { id: '', user: 0, userDetails: { firstName: '' }, text: '', parentComment: '' };
        }

        function resetSelection() {
            selectedIndex = 0;
            vm.selected = emptySelection();
        };
    }

}());
