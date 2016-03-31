module.exports = function() {
    'use strict';

    return {
        sendOr404: sendOr404,
        serverError: serverError
    };

    function sendOr404(result, res, errorMsg) {
        if (result !== undefined && result !== null) {
            res.json(result);
        } else {
            res.status(404).json({ error: errorMsg });
        }
    }
    
    function serverError(res, err) {
        res.status(400).json({ error: err });
    }
}
