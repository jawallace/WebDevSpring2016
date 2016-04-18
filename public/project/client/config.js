(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .config(Configuration);

    Configuration.$inject = [ '$stateProvider', '$urlRouterProvider'];
    function Configuration($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home/home.view.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                resolve: {
                    user: function(UserService) {
                        return UserService.isLoggedIn();
                    }
                }
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
            .state('group', {
                url: '/group',
                templateUrl: 'views/group/group.view.html',
                controller: 'GroupController',
                controllerAs: 'vm'
            })
            .state('group.detail', {
                url: '/group/:groupId',
                templateUrl: 'views/group/group.detail.view.html',
                controller: 'GroupDetailController',
                controllerAs: 'vm'
            });
        ;

    }
})();
