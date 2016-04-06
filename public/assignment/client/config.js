(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .config(Configuration);

    Configuration.$inject = [ '$stateProvider', '$urlRouterProvider'];
    function Configuration($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise("/");
        $urlRouterProvider.when('/forms', '/forms/list');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home/home.view.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/users/register.view.html',
                controller: 'RegisterController',
                controllerAs: 'vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/users/login.view.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'views/users/profile.view.html',
                controller: 'ProfileController',
                controllerAs: 'vm',
                resolve:  {
                    user: isLoggedIn
                }
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'views/admin/admin.view.html',
                controller: 'AdminController',
                controllerAs: 'vm',
                resolve:  {
                    isAdmin: isAdmin
                }
            })
            .state('forms', {
                url: '/form',
                templateUrl: 'views/forms/forms.view.html',
                controller: 'FormsController',
                controllerAs: 'vm',
                resolve:  {
                    user: isLoggedIn
                }
            })
            .state('forms.list', {
                url: '/list',
                templateUrl: 'views/forms/forms.list.view.html',
                controller: 'FormsListController',
                controllerAs: 'vm'
            })
            .state('forms.fields', {
                url: '/:formId/fields',
                templateUrl: 'views/forms/fields.view.html',
                controller: 'FieldsController',
                controllerAs: 'vm'
            });
    }

    // This is a bit funky. Adapted from http://stackoverflow.com/a/28267504
    isLoggedIn.$inject = [ '$q', 'UserService', '$timeout', '$state' ];
    function isLoggedIn($q, UserService, $timeout, $state) {
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

    isAdmin.$inject = [ '$q', 'UserService', '$timeout', '$state' ];
    function isAdmin($q, UserService, $timeout, $state) {
        var deferred = $q.defer();
        UserService
            .isLoggedIn()
            .then(function(user) {
                if (user && user.roles.indexOf('admin') > -1) {
                    deferred.resolve(user);
                } else if (user) {
                    deferred.reject({});
                    $timeout(function() {
                        $state.go('home');
                    });
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

})();
