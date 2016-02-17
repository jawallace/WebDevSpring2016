(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .controller('MainController', MainController);

    MainController.$inject = [ '$state', '$rootScope' ];

    function MainController($state, $rootScope) {
        var vm = this;

        this.state = $state;
    }

}());
