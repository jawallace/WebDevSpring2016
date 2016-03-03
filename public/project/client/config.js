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
            .state('search', {
                url: '/search',
                templateUrl: 'views/search/search.view.html',
                controller: 'SearchController',
                controllerAs: 'vm'
            })
            .state('crud', {
                url: '/crud',
                templateUrl: 'views/crud/crud.view.html',
                controller: 'CRUDController',
                controllerAs: 'vm'
            })
            .state('crud.comments', {
                url: '/comments',
                templateUrl: 'views/crud/comments/comments.view.html',
                controller: 'CRUDCommentsController',
                controllerAs: 'vm'
            })
        ;
            
    }

})();
