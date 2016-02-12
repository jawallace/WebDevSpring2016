(function() {
    
    angular.module('FormBuilderApp')
           .config(Configuration);

    function Configuration($stateProvider, $urlRouterProvider) {
       
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: "home/home.view.html"
            });
            
    }

})();
