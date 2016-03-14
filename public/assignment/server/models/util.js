module.exports = function() {
    'use strict';
    
    return {
        extend: extend
    };

    function extend(current, updated) {
        for (var key in updated) {
            if (updated.hasOwnProperty(key)) {
                current[key] = updated;
            }
        }
    }
}
