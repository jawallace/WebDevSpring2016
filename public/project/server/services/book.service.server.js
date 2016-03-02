module.exports = function(app, BookModel) {

    app.get('/books/:id', getBookById);

    app.get('/books', getBooksByQuery);

    function getBookById(req, res) {
        BookModel.getBookById(req.params.id, onApiError(res), onApiSuccess(res));
    }

    function getBooksByQuery(req, res) {
        BookModel.getBooksByQuery(req.query, onApiError(res), onApiSuccess(res));
    }

    function onApiError(res) {
        return function(err) {
            res.json({ error: err });
        }
    };
    
    function onApiSuccess(res) {
        return function(result) {
            res.json(result);
        }
    };

};
