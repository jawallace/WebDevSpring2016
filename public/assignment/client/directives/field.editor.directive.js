(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .directive('fbaFieldEditor', FBAFieldEditor);

    function FBAFieldEditor() {

        return {
            restrict: 'E',
            scope: {
                fbaField: '=',
                fbaOnComplete: '&',
                fbaOnCancel: '&'
            },
            replace: true,
            link: link,
            controller: 'FieldEditorController',
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'directives/field.editor.template.html'
        };

        function link($scope, element, attrs) {
            element.modal({
                show: false
            });

            $scope.show = function() {
                element.modal('show');
            }
            
            $scope.hide = function() {
                element.modal('hide');
            }
        }
    }
    
}());
