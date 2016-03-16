(function() {
    'use strict';
    
    angular
        .module('FormBuilderApp')
        .directive('fbaSortable', FBASortable);

    function FBASortable() {
        return {
            restrict: 'EA',
            scope: {
                fbaOnChange: '&'
            },
            link: linkSortable
        };

        function linkSortable($scope, element, attrs) {
            element.sortable({
                axis: 'y',
                handle: '.js-controls .js-handle',
                start: start($scope, element, attrs),
                stop: stop($scope, element, attrs),
                placeholder: 'fba-sortable-placeholder',
                cancel: ''
            });
        }

        function start($scope, element, attrs) {
            return function(e, ui) {
                ui.placeholder.html(ui.item.html());
                ui.item.startIndex = ui.item.index();
            };
        }

        function stop($scope, element, attrs) {
            return function(e, ui) {
                $scope.fbaOnChange()(ui.item.startIndex, ui.item.index());
            };
        }
    }

}());
