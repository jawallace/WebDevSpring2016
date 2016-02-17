(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .service('FormService', FormService);

    function FormService() {
        var self = this;

        self.forms = [
            { '_id' : '000', 'title' : 'Contacts', 'userId': 123 },
            { '_id' : '010', 'title' : 'ToDo', 'userId': 123 },
            { '_id' : '020', 'title' : 'CDs', 'userId': 234 }
        ];

        self.createFormForUser = createFormForUser;
        self.findAllFormsForUser = findAllFormsForUser;
        self.deleteFormById = deleteFormById;
        self.updateFormById = updateFormById;

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

            self.forms.push(form);

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

            var numForms = self.forms.length;
            for (var i = 0; i < numForms; i++) {
                if (self.forms[i].userId === userId) {
                    userForms.push(self.forms[i]);
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

            var numForms = self.forms.length;
            for (var i = 0; i < numForms; i++) {
                if (self.forms[i]['_id'] === formId) {
                    index = i;
                    break;
                }
            }

            if (index !== undefined) {
                self.forms.splice(index, 1);
            }

            callback(self.forms);
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

            var numForms = self.forms.length;
            for (var i = 0; i < numForms; i++) {
                if (self.forms[i]['_id'] === formId) {
                    form = self.forms[i];
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
