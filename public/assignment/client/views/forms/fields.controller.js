(function () {
    'use strict';
    
    angular
        .module('FormBuilderApp')
        .controller('FieldsController', FieldsController);

    FieldsController.$inject = [ '$stateParams', 'FieldService' ];
    function FieldsController($stateParams, FieldService) {
        var vm = this;

        // Supported field types
        vm.fieldTypes = _populateFieldTypes();
        vm.fieldType; // type of new field
        vm.fields = []; // the fields in the form 
        vm.editing = undefined; // the field currently being edited

        vm.addField = addField;
        vm.removeField = removeField;
        vm.reorder = reorder;
        vm.edit = editField;
        vm.onFinishEdit = onFinishEdit;
        vm.onCancelEdit = resetEditing;

        var formId = $stateParams.formId;
        activate(formId);

        //////////////////////////////

        function activate(formId) {
            FieldService
                .getFieldsForForm(formId)
                .then(function(fields) {
                    vm.fields = fields;
                });
        }

        function addField(field) {
            FieldService
                .createFieldForForm(formId, field)
                .then(function(field) {
                    vm.fields.push(field);
                });
        }

        function removeField(field, $index) {
            FieldService
                .deleteFieldFromForm(formId, field['_id'])
                .then(function(field) {
                    vm.fields.splice($index, 1); 
                });
        }

        function reorder(oldIndex, newIndex) {
            vm.fields.splice(newIndex, 0, vm.fields.splice(oldIndex, 1)[0]);
            FieldService 
                .setFieldsForForm(formId, vm.fields)
                .then(function(fields) {
                    vm.fields = fields;
                });
        }

        function editField($index) {
            vm.editing = vm.fields[$index];
            vm.editingIndex = $index;
        }

        function onFinishEdit(updatedField) {
            var id = vm.editing['_id'];

            FieldService
                .updateField(formId, id, updatedField)
                .then(function(updated) {
                    vm.fields[vm.editingIndex] = updated;

                    resetEditing();
                }, resetEditing);
        }

        function resetEditing() {
            vm.editing = undefined;
            vm.editingIndex = undefined;
        }

        function _populateFieldTypes() {
            return [
                { 
                    label: 'Single Line Text Field', 
                    value: {
                        label: 'New Text Field',
                        type: 'TEXT',
                        placeholder: 'New Field'
                    }
                },
                { 
                    label: 'Multi Line Text Field', 
                    value: {
                        label: 'New Text Field',
                        type: 'TEXTAREA',
                        placeholder: 'New Field'
                    }
                },
                { 
                    label: 'Date Field', 
                    value: {
                        label: 'New Date Field',
                        type: 'DATE'
                    }
                },
                { 
                    label: 'Dropdown Field', 
                    value: {
                        label: 'New Dropdown Field',
                        type: 'OPTIONS',
                        options: [
                            { label: 'Option 1', value: 'OPTION_1' },
                            { label: 'Option 2', value: 'OPTION_2' },
                            { label: 'Option 3', value: 'OPTION_3' }
                        ]
                    }
                },
                { 
                    label: 'Checkboxes Field', 
                    value: {
                        label: 'New Checkboxes Field',
                        type: 'CHECKBOXES',
                        options: [
                            { label: 'Option A', value: 'OPTION_A' },
                            { label: 'Option B', value: 'OPTION_B' },
                            { label: 'Option C', value: 'OPTION_C' }
                        ]
                    }
                },
                { 
                    label: 'Radio Buttons Field', 
                    value: {
                        label: 'New Radio Buttons Field',
                        type: 'RADIOS',
                        options: [
                            { label: 'Option X', value: 'OPTION_X' },
                            { label: 'Option Y', value: 'OPTION_Y' },
                            { label: 'Option Z', value: 'OPTION_Z' }
                        ]
                    }
                }
            ];
        }
    }
}());
