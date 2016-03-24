module.exports = function(app, BookModel) {

    app.get('/api/project/book/:id', getBookById);

    app.get('/api/project/book', getBooksByQuery);

    function getBookById(req, res) {
        BookModel.getBookById(req.params.id, onApiError(res), onApiSuccess(res));
    }

    function getBooksByQuery(req, res) {
        BookModel.getBooksByQuery(req.query, onApiError(res), onApiSuccess(res));
    }

    function onApiError(res) {
        return function(err) {
            res.status(400).json({ error: err });
        }
    };
    
    function onApiSuccess(res) {
        return function(result) {
            res.json(result);
        }
    };

};
