(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = [ '$rootScope', '$state' ];
    function HeaderController($rootScope, $state) {
        var vm = this;
      
        vm.searchQuery = ''; // ng-model

        vm.logout = logout;
        vm.search = search;

        function logout() {
            $rootScope.user = undefined; 
            $state.go('home');
        }

        function search() {
            if (vm.searchQuery) {
                $state.go('search', { q: vm.searchQuery, page: 1 });
            }
        }
    }

}());
