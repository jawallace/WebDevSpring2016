(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('CommentController', CommentController);

    CommentController.$inject = [ 'CommentService', 'UserService' ];
    function CommentController(CommentService, UserService) {
        var vm = this;

        vm.canModify;
        vm.editing;
        vm.editedText;
        vm.hasLiked;
        
        vm.removeComment = removeComment;
        vm.toggleEdit = toggleEdit;
        vm.likeComment = likeComment;
        vm.unlikeComment = unlikeComment;
        vm.cancelEdit = cancelEdit;
        vm.commitEdit = commitEdit;

        activate();

        ////////////////////////////////////////////

        function activate() {
            vm.canModify = (vm.bcComment.user === vm.bcUser._id) || vm.bcIsAdmin;
            vm.editing = false;
            vm.editedText = vm.bcComment.text;
            var l = angular.copy(vm.bcLoc);
            l.comment = vm.bcComment._id;
            vm.hasLiked = UserService.likesComment(vm.bcUser, l);
            _getUser();
        }

        function removeComment() {
            CommentService
                .deleteComment(vm.bcLoc, vm.bcComment._id)
                .then(function() {
                    vm.bcOnRemove()();
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function toggleEdit() {
            if (vm.canModify) {
                if (! vm.editing) {
                    vm.editing = true;
                } else {
                    cancelEdit();
                }
            }
        }

        function likeComment() {
            if (vm.hasLiked) {
                return;
            }
      
            var l = angular.copy(vm.bcLoc);
            l.comment = vm.bcComment._id;
            UserService
                .likeComment(vm.bcUser, l)
                .then(function(updated) {
                    vm.hasLiked = true;
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }
        
        function unlikeComment() {
            if (! vm.hasLiked) {
                return;
            }
           
            var l = angular.copy(vm.bcLoc);
            l.comment = vm.bcComment._id;

            UserService
                .unlikeComment(vm.bcUser, l)
                .then(function(updated) {
                    vm.hasLiked = false;
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
            
        }

        function cancelEdit() {
            vm.editing = false;
            vm.editedText = vm.bcComment.text;
        }

        function commitEdit() {
            var updated = { text: vm.editedText };

            CommentService
                .updateComment(vm.bcLoc, vm.bcComment._id, updated)
                .then(function(comment) {
                    vm.bcComment.text = comment.text;
                    vm.editing = false;
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function _getUser() {
            UserService
                .findUserById(vm.bcComment.user)
                .then(function(user) {
                    user.name = user.firstName ? user.firstName + ' ' + user.lastName : user.username;
                    vm.bcComment.userDetails = user;
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }
    }

}());
