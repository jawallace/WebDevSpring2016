(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .factory('FormService', FormService);

    FormService.$inject = [ '$http' ];
    function FormService($http) {

        var baseFormUrl = '/api/assignment/form';
        var baseUserUrl = '/api/assignment/user/';

        var service = {
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById
        };

        return service;
        
        /////////////////////////////
       
        function createFormForUser(userId, form) {
            return $http
                .post(baseUserUrl + userId + '/form', form)
                .then(function(res) {
                    return res.data;
                });
        }

        function findAllFormsForUser(userId) {
            return $http
                .get(baseUserUrl + userId + '/form')
                .then(function(res) {
                    return res.data;
                });
        }

        function deleteFormById(formId) {
            return $http.delete(baseFormUrl + '/' + formId);
        }

        function updateFormById(formId, newForm) {
            return $http
                .put(baseFormUrl + '/' + formId, newForm)
                .then(function(res) {
                    return res.data;
                });
        }
    }

}());
