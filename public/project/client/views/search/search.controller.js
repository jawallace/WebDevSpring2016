(function () {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('SearchController', SearchController);
    
    var NO_RESULTS = "No results";
    var FETCHING = "Fetching results...";
    var ENTER_SEARCH = "Search to see results.";
    var SELECTION_MSG = "Find and select a book to use it for your reading.";
    var NO_MSG = "";
    var ERR_MSG = "Something went wrong. Please try again.";

    SearchController.$inject = [ 'BookService', '$stateParams', '$state' ];
    function SearchController(BookService, $stateParams, $state) {
        var vm = this;

        var q = $stateParams.q;
        var page = parseInt($stateParams.page || "1");

        vm.query = q || '';
        vm.allowSelection = $stateParams.selecting;
        
        var defaultMessage = vm.allowSelection ? SELECTION_MSG : ENTER_SEARCH;

        vm.page = (page < 1) ? 1 : page;
        vm.results = []; // search results
        vm.msg = vm.query ? FETCHING : defaultMessage; // message for loading / no results / etc

        vm.nextPage = nextPage;
        vm.prevPage = prevPage;
        vm.search = search;
        vm.onSelect = onSelect;

        search();

        //////////////////////////////////
        
        function search() {
            if (! vm.query) {
                vm.msg = defaultMessage;
                return;
            }

            vm.msg = FETCHING;
            vm.results = [];
            
            BookService
                .getBookByQuery(vm.query, vm.page)
                .then(function (res) {
                    vm.msg = NO_MSG;
                    vm.results = res;

                    if (! vm.results || !vm.results.length) {
                        vm.msg = NO_RESULTS;
                    }

                }, function(res) {
                    vm.msg = ERR_MSG;    
                });
        }

        function nextPage() {
            if (vm.results.length) {
                vm.page = vm.page + 1;
                search();
            }
        }

        function prevPage() {
            if (vm.page > 1) {
                vm.page = vm.page - 1;
                search();
            }
        }

        function onSelect(book) {
            $stateParams.onSelect(book);
        }
    }

}());
