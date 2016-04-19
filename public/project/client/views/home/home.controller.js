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
            var loc = { group: group._id };
            ReadingService 
                .getReadingsForGroup(loc)
                .then(function(readings) {
                    if (! readings.length) {
                        return;
                    }

                    resolveReading(loc, readings[0])
                        .then(function(reading) {
                            group.currentReading = reading;
                        });
                });

            return group;
        }

        function resolveReading(loc, reading) {
            var bookDeferred = $q.defer();
            BookService
                .getBookById(reading.book)
                .then(function(book) {
                    reading.book = book;
                    bookDeferred.resolve();
                });

            var discussionDeferred = $q.defer();
            loc.reading = reading._id;
            DiscussionService
                .getDiscussionsForReading(loc)
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
