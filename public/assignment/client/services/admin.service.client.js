(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .factory('AdminService', AdminService);

    AdminService.$inject = [ '$http' ];
    function AdminService($http) {
        var vm = this;

        var BASE_URL = '/api/assignment/admin/user';

        return {
            findAll: findAllUsers,
            findById: findUserById,
            create: createUser,
            delete: removeUser,
            update: updateUser
        };

        //////////////////////////////////////
       
        function findAllUsers() {
            return $http
                .get(BASE_URL)
                .then(function(res) {
                    return res.data;
                });
        }
       
        function findUserById(id) {
            return $http
                .get(USER_ID_URL + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function createUser(user) {
            return $http
                .post(BASE_URL, user)
                .then(function(res) {
                    return res.data;
                });
        }

        function removeUser(id) {
            return $http
                .delete(BASE_URL + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function updateUser(id, user) {
            return $http
                .put(BASE_URL + '/' + id, user)
                .then(function(res) {
                    return res.data;
                });
        }

    }

}());
