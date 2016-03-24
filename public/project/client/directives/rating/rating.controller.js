(function() {
    'use strict';
    
    angular
        .module('TheBookClub')
        .controller('RatingController', RatingController);

    function RatingController() {
        var vm = this;

        vm.filledStars = range(Math.round(vm.bcValue || 0));
        vm.unfilledStars = range(vm.bcOutOf - vm.filledStars.length);

        function range(value) {
            var result = [];
            for (var i = 0; i < value; i++) {
                result.push(i); 
            }

            return result;
        }
    }

}());
