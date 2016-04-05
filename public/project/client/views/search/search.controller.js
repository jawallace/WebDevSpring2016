(function () {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('SearchController', SearchController);
    
    var NO_RESULTS = "No results";
    var FETCHING = "Fetching results...";
    var NO_MSG = "";
    var ERR_MSG = "Something went wrong. Please try again.";

    SearchController.$inject = [ 'BookService', '$stateParams', '$state' ];
    function SearchController(BookService, $stateParams, $state) {
        var vm = this;

        var q = $stateParams.q;
        var page = parseInt($stateParams.page || "1");

        vm.browsing = true;
        vm.selecting = true;

        vm.page = page;
        vm.results = []; // search results
        vm.msg = FETCHING; // message for loading / no results / etc

        vm.nextPage = nextPage;
        vm.prevPage = prevPage;

        search(q, page);

        //////////////////////////////////
        
        function search(query, page) {
            vm.msg = FETCHING;
            vm.results = [];
            
            BookService
                .getBookByQuery(query, page)
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
                $state.go('search', { q: q, page: page + 1 });
            }
        }

        function prevPage() {
            if (page > 1) {
                $state.go('search', { q: q, page: page - 1 });            
            }

        }
    }

}());
