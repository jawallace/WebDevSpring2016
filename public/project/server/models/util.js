module.exports = function() {
    'use strict';
   
    var guidLib = require('guid');

    return {
        extend: extend,
        copy: copy,
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
}
