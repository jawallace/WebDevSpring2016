(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ReadingController', ReadingController);

    ReadingController.$inject = [ 'BookService', 'ReadingService', 'DiscussionService', 'UserService', '$state', '$scope' ];
    function ReadingController(BookService, ReadingService, DiscussionService, UserService, $state, $scope) {
        var vm = this;

        vm.book;
        vm.discussions;
        vm.newDiscussionTopic;

        vm.selectBook = selectBook;
        vm.addNewDiscussion = addNewDiscussion;
        vm.removeDiscussion = removeDiscussion;
        vm.goToDiscussion = goToDiscussion;

        $scope.$watch(function() {
            return vm.bcReading;
        }, function() {
            activate();
        });

        activate();

        //////////////////////////////////////

        function activate() {
            vm.reading = vm.bcReading;
            _getBook();
            _getDiscussions();
        }
       
        function selectBook() {
            var params = {
                selecting: true,
                onSelect: _createOnSelect(vm.bcLoc, vm.reading)
            };

            $state.go('search', params);    
        }

        function _createOnSelect(loc, theReading) {
            var reading = angular.copy(theReading);
            return function(book) {
                reading.book = book;
                ReadingService
                    .updateReading(loc, reading._id, reading)
                    .then(function() {
                        $state.go('group.detail', { groupId: loc.group });
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            };
        }

        function addNewDiscussion() {
            DiscussionService
                .createDiscussion(vm.bcLoc, vm.newDiscussionTopic)
                .then(function(discussion) {
                    _getDiscussions();
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function removeDiscussion(discussion) {
            DiscussionService
                .deleteDiscussion(vm.bcLoc, discussion._id)
                .then(function(discussions) {
                    _getDiscussions();
                })
                .catch(function(err) {
                    // TODO
                    console.log(err);
                });
        }

        function goToDiscussion(discussion) {
            $state.go('discussion', { discussionId: discussion._id, loc: vm.bcLoc });
        }

        function _getBook() {
                BookService
                    .getBookById(vm.reading.book)
                    .then(function(book) {
                        book.description = book.description.replace(/\" \"/g, '');
                        vm.book = book;
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
              
        }

        function _getDiscussions() {
            DiscussionService
                .getDiscussionsForReading(vm.bcLoc) 
                .then(function(discussions) {
                    discussions.forEach(function(d) {
                        UserService
                            .findUserById(d.user)
                            .then(function(user) {
                                d.userDetails = user;
                            })
                            .catch(function(err) {
                                //TODO
                                console.log(err);
                            });
                    });
                    vm.discussions = discussions;
                    console.log(discussions);
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    }

}());
