(function () {
    'use strict';
    
    angular
        .module('FormBuilderApp')
        .controller('FieldsController', FieldsController);

    FieldsController.$inject = [ '$stateParams', 'FieldService' ];
    function FieldsController($stateParams, FieldService) {
        var vm = this;

        // Supported field types
        vm.fieldTypes = [
            { label: 'Single Line Text Field', value: 'TEXT' },
            { label: 'Multi Line Text Field', value: 'TEXTAREA' },
            { label: 'Date Field', value: 'DATE' },
            { label: 'Dropdown Field', value: 'OPTIONS' },
            { label: 'Checkboxes Field', value: 'CHECKBOXES' },
            { label: 'Radio Buttons Field', value: 'RADIOS' }
        ];

        vm.fieldType; // type of new field
        vm.fields = []; // the fields in the form 

        vm.addField = addField;
        vm.removeField = removeField;

        var formId = $stateParams.formId;
        activate(formId);

        //////////////////////////////

        function activate(formId) {
            FieldService
                .getFieldsForForm(formId)
                .then(function(fields) {
                    vm.fields = fields;
                    console.log(vm.fields);
                });
        }

        function addField(fieldType) {
            console.log(fieldType);
        }

        function removeField(field) {

        }
    }
}());
