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
            vm.hasLiked = vm.bcUser.likes.indexOf(vm.bcComment._id) > -1;
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
       
            vm.bcUser.likes.push(vm.bcComment._id);
            UserService
                .updateUser(vm.bcUser._id, { likes: vm.bcUser.likes })
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
           
            var i = vm.bcUser.likes.indexOf(vm.bcComment._id);
            vm.bcUser.likes.splice(i, 1);

            UserService
                .updateUser(vm.bcUser._id, { likes: vm.bcUser.likes })
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
