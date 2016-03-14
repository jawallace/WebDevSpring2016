module.exports = function() {
    
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
