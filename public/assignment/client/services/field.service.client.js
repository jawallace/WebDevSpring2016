(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .factory('FieldService', FieldService);

    FieldService.$inject = [ '$http' ];
    function FieldService($http) {

        var baseFieldUrl = '/api/assignment/form/';
        var fieldUrl = '/field'/;

        var service = {
            createFieldForForm: createFieldForForm,
            getFieldsForForm: getFieldsForForm,
            getFieldForForm: getFieldForForm,
            deleteFieldFromForm: deleteFieldFromForm,
            updateField: updateField
        };

        return service;

        ////////////////////////
       
        function createFieldForForm(formId, field) {
            return $http.post(formatUrl(formId), field);
        }

        function getFieldsForForm(formId) {
            return $http.get(formatUrl(formId));
        }

        function getFieldForForm(formId, fieldId) {
            return $http.get(formatUrl(formId, fieldId));
        }

        function deleteFieldFromForm(formId, fieldId) {
            return $http.delete(formatUrl(formId, fieldId));
        }

        function updateField(formId, fieldId, field) {
            return $http.put(formatUrl(formId, fieldId), field);
        }

        function formatUrl(formId, fieldId) {
            return baseFieldUrl + formId + fieldUrl + (fieldId || '');
        }
    }

}());
