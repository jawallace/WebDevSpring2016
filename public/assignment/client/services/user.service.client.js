(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .factory('UserService', UserService);

    UserService.$inject = [ '$http' ];
    function UserService($http) {
        
        var baseUrl = '/api/assignment/user';

        var service = {
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            findByUsername: findByUsername,
            findByUsernameAndPassword: findByUsernameAndPassword,
            findAllUsers: findAllUsers,
            createUser: createUser,
            updateUser: updateUser,
            deleteUserById: deleteUserById
        };

        return service;

        //////////////////////////////////
      
        function login(username, password) {
            return $http
                .post('/api/assignment/login', { username: username, password: password })
                .then(function(res) {
                    return res.data;
                }, function(err) {
                    console.log(err);
                    return err;
                });
        }

        function logout() {
            return $http
                .post('/api/assignment/logout')
                .then(function(res) {
                    return res.data;
                });
        }

        function isLoggedIn() {
            return $http
                .get('/api/assignment/isLoggedIn')
                .then(function(res) {
                    return res.data;
                });
        }

        function findByUsername(username) {
            var config = {
                params: {
                    username: username
                }
            };

            return $http
                .get(baseUrl, config)
                .then(function(res) {
                    return res.data;
                });
        }

        function findByUsernameAndPassword(username, password) {
            var config = {
                params: {
                    username: username,
                    password: password
                }
            };

            return $http
                .get(baseUrl, config)
                .then(function (res) {
                    return res.data;
                });
        }
            
        function findAllUsers() {
            return $http
                .get(baseUrl)
                .then(function(res) {
                    return res.data;
                });
        }

        function createUser(user) {
            if (user.email && ! user.emails) {
                user.emails = [user.email];
            }

            return $http
                .post(baseUrl, user)
                .then(function(res) {
                    return res.data;
                });
        }

        function deleteUserById(id) {
            return $http
                .delete(baseUrl + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function updateUser(id, user) {
            return $http
                .put(baseUrl + '/' + id, user)
                .then(function(res) {
                    return res.data;
                }, function(err) {
                    console.log(err);   
                });
        }
    }
        
}());
