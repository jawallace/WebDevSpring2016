(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .factory('FormService', FormService);

    function FormService() {
        return {
            forms : [
                { '_id' : '000', 'title' : 'Contacts', 'userId': 123 },
                { '_id' : '010', 'title' : 'ToDo', 'userId': 123 },
                { '_id' : '020', 'title' : 'CDs', 'userId': 234 }
            ],

            /**
             * Create a form with the given information
             *
             * @param userId, integer, the id of the user
             * @param form, object, the form object
             * @param callback, function(form), the function that will be called when done
             */
            createFormForUser: function(userId, form, callback) {
                form.userId = userId;
                form['_id'] = String((new Date()).getTime());

                this.forms.push(form);

                callback(form);
            },

            /**
             * Find forms for the given user
             *
             * @param userId, integer, the id of the user
             * @param callback, function(forms), the function that will be called when done
             */
            findAllFormsForUser: function(userId, callback) {
                var userForms = [];

                var numForms = this.forms.length;
                for (var i = 0; i < numForms; i++) {
                    if (this.forms[i].userId === userId) {
                        userForms.push(this.forms[i]);
                    }
                }

                callback(userForms);
            },

            /**
             * Delete the form with the given id, if it exists
             *
             * @param formId, integer, the id of the form to delete
             * @param callback, function(forms), the function that will be called when done
             */
            deleteFormById: function(formId, callback) {
                var index;

                var numForms = this.forms.length;
                for (var i = 0; i < numForms; i++) {
                    if (this.forms[i]['_id'] === formId) {
                        index = i;
                        break;
                    }
                }

                if (index !== undefined) {
                    this.forms.splice(index, 1);
                }

                callback(this.forms);
            },

            /**
             * Update the form with the given information
             *
             * @param formId, integer, the id of the form to update 
             * @param newForm, object, the new form data
             * @param callback, function(form), the function that will be called when done
             */
            updateFormById: function(formId, newForm, callback) {
                var form;

                var numForms = this.forms.length;
                for (var i = 0; i < numForms; i++) {
                    if (this.forms[i]['_id'] === formId) {
                        form = this.forms[i];
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
        };
    }

}());
