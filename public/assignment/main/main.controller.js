(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .controller('MainController', MainController);

    function MainController($state) {
        var vm = this;

        this.state = $state;
    }

}());
