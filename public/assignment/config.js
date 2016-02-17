(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .config(Configuration);

    function Configuration($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.view.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'users/register.view.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'users/login.view.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'users/profile.view.html'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'admin/admin.view.html'
            })
            .state('forms', {
                url: '/forms',
                templateUrl: 'forms/forms.view.html'
            });
            
    }

})();
