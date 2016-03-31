(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .factory('UserService', UserService);

    UserService.$inject = [ '$http' ];
    function UserService($http) {
        
        var baseUrl = '/api/assignment/user';

        var service = {
            findByUsername: findByUsername,
            findByUsernameAndPassword: findByUsernameAndPassword,
            findAllUsers: findAllUsers,
            createUser: createUser,
            updateUser: updateUser,
            deleteUserById: deleteUserById
        };

        return service;

        //////////////////////////////////
       
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
