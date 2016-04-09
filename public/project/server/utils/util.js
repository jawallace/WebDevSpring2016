module.exports = function() {
    'use strict';
   
    var q = require('q');

    return {
        extend: extend,
        copy: copy,
        find: find,
        findById: findById,
        matchId: matchId,
        sendOr404: sendOr404,
        deferService: deferService
    };

    function extend(current, updated) {
        for (var key in updated) {
            if (updated.hasOwnProperty(key)) {
                current[key] = updated[key];
            }
        }
    }

    function copy(obj) {
        var newObj = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = obj[key];
            }
        }

        return newObj;
    }

    function guid() {
        return guidLib.raw();
    }

    function find(arr, pred) {
        for (var i = 0; i < arr.length; i++) {
            if (pred(arr[i])) {
                return {
                    value: arr[i],
                    index: i
                };
            }
        }
    }

    function matchId(id) {
        return function(val) {
            return val.id === id;
        }
    }

    function findById(arr, id) {
        return find(arr, matchId(id));
    }
    
    function sendOr404(result, res, errorMsg) {
        if (result === undefined || result === null) {
            res.status(404).json({ error: errorMsg });
        } else {
            res.json(result);
        }
    }

    function deferService(service) {
        var deferredService = {};
        for(var key in service) {
            if(service.hasOwnProperty(key)) {
                deferredService[key] = defer(service[key]); 
            }
        }

        return deferredService;
    }

    function defer(fn) {
        return function(args) {
            var deferred = q.defer();
      
            function resolve(obj) {
                deferred.resolve(obj);
            }

            function reject(obj) {
                deferred.reject(obj);
            }

            fn.apply(null, [resolve, reject].concat([].slice.call(arguments))); 
            return deferred.promise;
        }
    }
}
