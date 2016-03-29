(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = [ '$rootScope', '$state', 'UserService' ];
    function HeaderController($rootScope, $state, UserService) {
        var vm = this;
      
        vm.searchQuery = ''; // ng-model

        vm.logout = logout;
        vm.search = search;

        activate();

        //////////////////////////////////////
        
        function activate() {
            UserService
                .isLoggedIn()
                .then(function(user) {
                    $rootScope.user = user;
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function() {
                    $rootScope.user = undefined; 
                    $state.go('home');
                });
        }

        function search() {
            if (vm.searchQuery) {
                $state.go('search', { q: vm.searchQuery, page: 1 });
            }
        }
    }

}());
