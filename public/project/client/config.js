(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .config(Configuration);

    Configuration.$inject = [ '$stateProvider', '$urlRouterProvider'];
    function Configuration($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise('/');

        var resolveUser = {
            user: isLoggedIn
        };

        var requireLogin = {
            user: forceLogin
        };

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home/home.view.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                resolve: resolveUser
            })
            .state('search', {
                url: '/search?q&page',
                templateUrl: 'views/search/search.view.html',
                controller: 'SearchController',
                controllerAs: 'vm',
                params: {
                    selecting: false,
                    onSelect: function() { }
                }
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
                controllerAs: 'vm',
                resolve: resolveUser
            })
            .state('group', {
                url: '/group',
                template: '<ui-view></ui-view>'
            })
            .state('group.create', {
                url: '/',
                templateUrl: 'views/group/group.view.html',
                controller: 'GroupController',
                controllerAs: 'vm',
                resolve: requireLogin 
            })
            .state('group.detail', {
                url: '/:groupId',
                templateUrl: 'views/group/group.detail.view.html',
                controller: 'GroupDetailController',
                controllerAs: 'vm',
                resolve: requireLogin
            })
            .state('discussion', {
                url: '/discussion/:discussionId',
                templateUrl: 'views/discussion/discussion.view.html',
                controller: 'DiscussionController',
                controllerAs: 'vm',
                resolve: requireLogin,
                params: {
                    loc: { group: undefined, reading: undefined }
                }
            });
        ;

        isLoggedIn.$inject = [ 'UserService' ];
        function isLoggedIn(UserService) {
            return UserService.isLoggedIn();
        }

        // This is a bit funky. Adapted from http://stackoverflow.com/a/28267504
        forceLogin.$inject = [ '$q', 'UserService', '$timeout', '$state' ];
        function forceLogin($q, UserService, $timeout, $state) {
            var deferred = $q.defer();
            UserService
                .isLoggedIn()
                .then(function(user) {
                    if (user) {
                        deferred.resolve(user);
                    } else {
                        deferred.reject({});
                        $timeout(function() {
                            $state.go('login');
                        });
                    }
                }, function(err) {
                    deferred.reject({});
                    $timeout(function() {
                        $state.go('login');
                    });
                });

            return deferred.promise;
        }
    }
})();
