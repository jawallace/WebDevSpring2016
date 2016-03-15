(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('FormsController', FormsController);

    FormsController.$inject = [ '$state' ];
    function FormsController($state) {
        var vm = this;
    
        vm.title = $state.includes('forms.list') ? 'Forms'
                                                 : 'Fields';
    }

}());
