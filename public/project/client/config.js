(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .config(Configuration);

    function Configuration($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise('/');
        $urlRouterProvider.when('/crud/discussions', '/crud/discussions/list');
        $urlRouterProvider.when('/crud/readings', '/crud/readings/list');
        $urlRouterProvider.when('/crud/groups', '/crud/groups/list');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home/home.view.html'
            })
            .state('search', {
                url: '/search?q&page',
                templateUrl: 'views/search/search.view.html',
                controller: 'SearchController',
                controllerAs: 'vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/users/login.view.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/users/register.view.html',
                controller: 'RegisterController',
                controllerAs: 'vm'
            })
            .state('profile', {
                url: '/profile/:userId',
                templateUrl: 'views/users/profile.view.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            })
            
            /* CRUD States (for Project POC) */
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
            .state('crud.discussions', {
                url: '/discussions',
                templateUrl: 'views/crud/discussions/discussions.view.html',
            })
            .state('crud.discussions.list', {
                url: '/list',
                templateUrl: 'views/crud/discussions/discussions.list.view.html',
                controller: 'DiscussionListController',
                controllerAs: 'vm'
            })
            .state('crud.discussions.details', {
                url: '/details/:id',
                templateUrl: 'views/crud/discussions/discussions.details.view.html',
                controller: 'DiscussionDetailsController',
                controllerAs: 'vm'
            })
            .state('crud.readings', {
                url: '/readings',
                templateUrl: 'views/crud/readings/readings.view.html'
            })
            .state('crud.readings.list', {
                url: '/list',
                templateUrl: 'views/crud/readings/readings.list.view.html',
                controller: 'ReadingListController',
                controllerAs: 'vm'
            })
            .state('crud.readings.details', {
                url: '/details/:id',
                templateUrl: 'views/crud/readings/readings.details.view.html',
                controller: 'ReadingDetailsController',
                controllerAs: 'vm'
            })
            .state('crud.groups', {
                url: '/groups',
                templateUrl: 'views/crud/groups/groups.view.html'
            })
            .state('crud.groups.list', {
                url: '/list',
                templateUrl: 'views/crud/groups/groups.list.view.html',
                controller: 'GroupListController',
                controllerAs: 'vm'
            })
            .state('crud.groups.details', {
                url: '/details/:id',
                templateUrl: 'views/crud/groups/groups.details.view.html',
                controller: 'GroupDetailsController',
                controllerAs: 'vm'
            })
        ;
            
    }

})();
