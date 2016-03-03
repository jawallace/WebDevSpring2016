(function () {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('SearchController', SearchController);

    SearchController.$inject = [ 'BookService' ];

    var NO_RESULTS = "No results";
    var FETCHING = "Fetching results...";
    var NO_MSG = "";

    function SearchController(BookService) {
        var vm = this;

        vm.query = ""; // ng-model for search query
        vm.results = []; // search results
        vm.page = 0;
        vm.msg = NO_RESULTS; // message for loading / no results / etc

        vm.search = search;
        vm.nextPage = nextPage;

        function search(query, page) {
            vm.msg = FETCHING;
            vm.results = [];

            BookService
                .getBookByQuery(query, page)
                .then(function (res) {
                    vm.msg = NO_MSG;
                    vm.results = res.data;
                    vm.page = page;
                });
        }

        function nextPage() {
            search(vm.query, vm.page + 1);
        }
    }

}());
