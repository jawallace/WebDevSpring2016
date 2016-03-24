module.exports = function() {
    'use strict';
   
    var guid = require('guid');

    return {
        extend: extend,
        guid: guid,
        find: find,
        findById: findById,
        matchId: matchId
    };

    function extend(current, updated) {
        for (var key in updated) {
            if (updated.hasOwnProperty(key)) {
                current[key] = updated[key];
            }
        }
    }

    function guid() {
        return guid.raw();
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
}
