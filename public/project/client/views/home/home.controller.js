(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('HomeController', HomeController);

    HomeController.$inject = [ 'UserService', 'DiscussionService', 'BookService', 'ReadingService', 'user', '$q'];
    function HomeController(UserService, DiscussionService, BookService, ReadingService, user, $q) {
        var vm = this;

        vm.groups;

        activate();

        ///////////////////////////////////
        
        function activate() {
            if (user) {
                UserService
                    .getGroupsForUser(user._id)
                    .then(function(groups) {
                        var groupArray = [].concat(groups.admin || []).concat(groups.member || []);
                        vm.groups = groupArray.map(getLatestReading);
                    });
            }
        }

        function getLatestReading(group) {
            ReadingService 
                .getReadingsForGroup({ group: group._id })
                .then(function(readings) {
                    if (! readings.length) {
                        return;
                    }

                    group.currentReading = resolveReading(readings[0]);
                });

            return group;
        }

        function resolveReading(reading) {
            var bookDeferred = $q.defer();
            BookService
                .getBookById(reading.book)
                .then(function(book) {
                    reading.book = book;
                    bookDeferred.resolve();
                });

            var discussionDeferred = $q.defer();
            DiscussionService
                .getDiscussionsForReading(reading._id)
                .then(function(discussions) {
                    reading.discussions = discussions;
                    discussionDeferred.resolve();
                });

            return $q
                .all(bookDeferred.promise, discussionDeferred.promise)
                .then(function() {
                    return reading;
                });
        }
    }

}());
