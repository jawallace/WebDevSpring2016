(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('FormsController', FormsController);

    FormsController.$inject = [ 'FormService', '$rootScope' ];

    function FormsController(FormService, $rootScope) {
        var vm = this;
        
        vm.forms = [];
        vm.formName = ""; // ng-model for form name field
        vm.selectedForm; // the currently selected form

        vm.addForm = addForm;
        vm.deleteForm = deleteForm;
        vm.updateForm = updateForm;
        vm.selectForm = selectForm;
        
        var userId = $rootScope.user['_id'];
        FormService.findAllFormsForUser(userId, function(forms) {
            for (var i = 0; i < forms.length; i++) {
                vm.forms.push(forms[i]);
            }
        });

        function addForm() {
            var form = {
                'title' : vm.formName    
            };

            FormService.createFormForUser(userId, form, function(newForm) {
                vm.forms.push(newForm);
                vm.selectedForm = vm.forms.length - 1;
            });
        }

        function deleteForm(index) {
            var form = vm.forms[index];

            FormService.deleteFormById(form['_id'], function() {
                vm.forms.splice(index, 1);
            });
        }

        function updateForm() {
            if (vm.selectedForm === undefined) {
                return;
            }

            var form = vm.forms[vm.selectedForm];
            var newForm= { title:  vm.formName };
            FormService.updateFormById(form['_id'], newForm, function(updatedForm) {
                vm.forms[vm.selectedForm] = updatedForm;
            });
        }

        function selectForm(index) {
            vm.selectedForm = index;
            vm.formName = vm.forms[index].title;
        }

    }

}());
