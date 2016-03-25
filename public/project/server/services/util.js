module.exports = function() {
    'use strict';

    return {
        sendOr404: sendOr404
    };

    function sendOr404(result, res, errorMsg) {
        if (result === undefined || result === null) {
            res.status(404).json({ error: errorMsg });
        } else {
            res.json(result);
        }
    }
}
