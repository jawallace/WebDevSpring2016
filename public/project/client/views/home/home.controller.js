(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('HomeController', HomeController);

    HomeController.$inject = [ 'UserService', 'GroupService', 'BookService', 'ReadingService', 'user', '$q'];
    function HomeController(UserService, GroupService, BookService, ReadingService, user, $q) {
        var vm = this;

        vm.groups;

        activate();

        ///////////////////////////////////
        
        function activate() {
            if (user) {
                UserService
                    .getGroupsForUser(user.id)
                    .then(function(groups) {
                        vm.groups = groups.map(getLatestReading);
                    });
            }
        }

        function getLatestReading(group) {
            GroupService
                .getReadingsForGroup(group.id)
                .then(function(readings) {
                    if (! readings.length) {
                        return;
                    }

                    readings.sort(function(a, b) { 
                        return b - a;
                    });

                    resolveReading(readings[0]).then(function(r) {
                        group.currentReading = r;
                    });
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
            ReadingService
                .getDiscussionsForReading(reading.id)
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
