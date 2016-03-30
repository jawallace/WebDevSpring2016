module.exports = function() {
    'use strict';
   
    var q = require('q');

    return {
        extend: extend,
        defer: defer
    };

    function extend(current, updated) {
        for (var key in updated) {
            if (updated.hasOwnProperty(key)) {
                current[key] = updated[key];
            }
        }
    }

    function defer(fn) {
        var deferred = q.defer();
  
        function resolve(obj) {
            deferred.resolve(obj);
        }

        function reject(obj) {
            deferred.reject(obj);
        }

        return function(args) {
            fn.apply([resolve, reject].concat(arguments)); 
            return deferred.promise;
        }
    }
}
