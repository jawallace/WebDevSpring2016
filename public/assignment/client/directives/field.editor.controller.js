(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('FieldEditorController', FieldEditorController);

    FieldEditorController.$inject = [ '$scope' ];
    function FieldEditorController($scope) {
        var vm = this;
   
        var typesConfig = initTypesConfig();
        vm.config = getConfig;
        vm.field;

        vm.onComplete = onComplete;
        vm.onCancel = onCancel;

        activate(vm.fbaField);
       
        $scope.$watch(function() {
            return vm.fbaField;
        }, function(value) {
            activate(value);
        });

        ///////////////////////////
        
        function activate(field) {
            if (! field) {
                vm.field = undefined;
                if ($scope.hide) {
                    $scope.hide();
                }
            } else {
                vm.field = angular.copy(field);
                createOptionsString();
                if ($scope.show) {
                    $scope.show();
                }
            }
        }

        function onComplete() {
            parseOptionsString();
            $scope.hide();
            vm.fbaOnComplete()(vm.field);
            vm.field = undefined;
        }

        function onCancel() {
            vm.field = undefined;
            $scope.hide();
            vm.fbaOnCancel()();
        }

        function getConfig(configField) {
            if (! vm.field) {
                return undefined;
            }
           
            return typesConfig[vm.field.type][configField];
        }

        function createOptionsString() {
            if (! vm.field || !vm.field.options) {
                return;
            } 
            
            var str = '';
            for (var i = 0; i < vm.field.options.length; i++) {
                var opt = vm.field.options[i];
                str = str + opt.label + ':' + opt.value + '\n';
            }

            vm.field.optionsString = str;
        }

        function parseOptionsString() {
            if (! vm.field || ! vm.field.optionsString) {
                return;
            }

            var optStrings = vm.field.optionsString.trim().split('\n');
            vm.field.options = optStrings.map(function(str) {
                var split = str.split(':');
                return {
                    label: split[0],
                    value: split[1]
                };
            });
        }

        function initTypesConfig() {
            return {
                TEXT: {
                    displayName: 'Single Line Text',
                    placeholder: true,
                    options: false
                },

                TEXTAREA: {
                    displayName: 'Multi Line Text',
                    placeholder: true,
                    options: false
                },

                DATE: {
                    displayName: 'Date',
                    placeholder: false,
                    options: false
                },

                OPTIONS: {
                    displayName: 'Dropdown',
                    placeholder: false,
                    options: true
                },

                CHECKBOXES: {
                    displayName: 'Checkbox',
                    placeholder: false,
                    options: true 
                },

                RADIOS: {
                    displayName: 'Radio Button',
                    placeholder: false,
                    options: true 
                }
            };
        }
    }
}());
