(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ReadingListController', ReadingListController);

    ReadingListController.$inject = [ 'ReadingService', 'DiscussionService' ]
    function ReadingListController(ReadingService, DiscussionService) {
        var vm = this;

        var selectedIndex;
        vm.selected = emptySelection();
        vm.readings = [];

        vm.addReading = addReading;
        vm.updateReading = updateReading;
        vm.deleteReading = deleteReading;
        vm.selectReading = selectReading;

        activate();

        function activate() {
            ReadingService
                .getAllReadings()
                .then(function(readings) {
                    setReadings(readings);
                });
        }

        function addReading() {
            console.log('TODO');
        }

        function updateReading() {
            var selectedReading = vm.readings[selectedIndex];

            var reading = {
                endDate: vm.selected.endDate,
                startDate: vm.selected.startDate,
                book: vm.selected.book,
                discussions: vm.selected.discussions
            };

            ReadingService
                .updateReading(selectedReading.id, reading)
                .then(function(updatedReading) {
                    vm.readings[selectedIndex] = updatedReading;
                    resetSelection();
                });
        }
        
        function deleteReading(reading) {
            console.log('TODO');
        }

        function selectReading(index) {
            selectedIndex = index;
            var selectedReading = vm.readings[index];

            vm.selected.id = selectedReading.id;
            vm.selected.startDate = selectedReading.startDate;
            vm.selected.endDate = selectedReading.endDate;
            vm.selected.book = selectedReading.book;
            vm.selected.discussions = selectedReading.discussions;
        }

        function emptySelection() {
            return {
                id: undefined,
                startDate: undefined,
                endDate: undefined,
                book: undefined
            };
        }

        function resetSelection() {
            vm.selected = emptySelection();
            selectedIndex = undefined;
        }

        function setReadings(readings) {
            vm.readings = readings.map(function(r) {
                r.startDate = new Date(r.startDate);
                r.endDate= new Date(r.endDate);

                return r;
            });
        }
    }

}());
