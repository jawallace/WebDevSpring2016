(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .config(Configuration);

    function Configuration($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home/home.view.html'
            })
        /*
            .state('search', {
                url: '/search',
                templateUrl: 'users/register.view.html',
                controller: 'RegisterController',
                controllerAs: 'vm'
            })
        */
        ;
            
    }

})();
