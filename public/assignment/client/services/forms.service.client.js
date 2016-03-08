(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .factory('FormService', FormService);

    function FormService() {
        var theForms = [];

        var service = {
            forms: theForms,
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById
        };

        activate();

        return service;
        
        /////////////////////////////
       
        function activate() {
            theForms.push({ '_id' : '000', 'title' : 'Contacts', 'userId': 123 });
            theForms.push({ '_id' : '010', 'title' : 'ToDo', 'userId': 123 });
            theForms.push({ '_id' : '020', 'title' : 'CDs', 'userId': 234 });
        };

        /**
         * Create a form with the given information
         *
         * @param userId, integer, the id of the user
         * @param form, object, the form object
         * @param callback, function(form), the function that will be called when done
         */
        function createFormForUser(userId, form, callback) {
            form.userId = userId;
            form['_id'] = String((new Date()).getTime());

            theForms.push(form);

            callback(form);
        }

        /**
         * Find forms for the given user
         *
         * @param userId, integer, the id of the user
         * @param callback, function(forms), the function that will be called when done
         */
        function findAllFormsForUser(userId, callback) {
            var userForms = [];

            var numForms = theForms.length;
            for (var i = 0; i < numForms; i++) {
                if (theForms[i].userId === userId) {
                    userForms.push(theForms[i]);
                }
            }

            callback(userForms);
        }

        /**
         * Delete the form with the given id, if it exists
         *
         * @param formId, integer, the id of the form to delete
         * @param callback, function(forms), the function that will be called when done
         */
        function deleteFormById(formId, callback) {
            var index;

            var numForms = theForms.length;
            for (var i = 0; i < numForms; i++) {
                if (theForms[i]['_id'] === formId) {
                    index = i;
                    break;
                }
            }

            if (index !== undefined) {
                theForms.splice(index, 1);
            }

            callback(theForms);
        }

        /**
         * Update the form with the given information
         *
         * @param formId, integer, the id of the form to update 
         * @param newForm, object, the new form data
         * @param callback, function(form), the function that will be called when done
         */
        function updateFormById(formId, newForm, callback) {
            var form;

            var numForms = theForms.length;
            for (var i = 0; i < numForms; i++) {
                if (theForms[i]['_id'] === formId) {
                    form = theForms[i];
                    break;
                }
            }

            if (form) {
                for (var prop in newForm) {
                    if (newForm.hasOwnProperty(prop)) {
                        form[prop] = newForm[prop];
                    }
                }
            }

            callback(form);
        }
    }

}());
