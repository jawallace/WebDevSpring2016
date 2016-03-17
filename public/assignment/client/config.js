(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .config(Configuration);

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
                controllerAs: 'vm'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'views/admin/admin.view.html'
            })
            .state('forms', {
                url: '/form',
                templateUrl: 'views/forms/forms.view.html',
                controller: 'FormsController',
                controllerAs: 'vm'
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

})();
