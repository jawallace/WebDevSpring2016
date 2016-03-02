module.exports = function() {

    var api = {
        getBookById: getBookById,
        getBooksByQuery: getBooksByQuery
    };

    ///////////////////// INITIALIZATION /////////////////////
    var opts = {
        apiKey : process.env.BOOKS_API_KEY,
        pageSize: 20
    }

    console.log('Google Books API Key', opts.apiKey);

    var booksApi = require('request').defaults({
        baseUrl: 'https://www.googleapis.com/books/v1/volumes',
        qs: {
            'key': opts.apiKey 
        },
        json: true
    });

    var cache = require('lru-cache')(1000);

    return api;
   
    
    ///////////////////// IMPLEMENTATION /////////////////////
    
    function getBookById(id, onError, onSuccess) {
        var cached = cache.get(id);
        if (cached) {
            onSuccess(cached);
            return;
        }

        booksApi.get({ uri: '/' + id }, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                onError(error);
                return;
            }

            normalize(body, onSuccess);
        });
    }

    function getBooksByQuery(options, onError, onSuccess) {
        if (options.page !== undefined && options.page < 0) {
            onError("page number must be greater than 0");
            return;
        }

        var queryParams = {
            q: options.q,
            startIndex: options.page ? (options.page - 1) * opts.pageSize : 0,
            maxResults: opts.pageSize
        };

        booksApi.get({ uri: '/', qs: queryParams }, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log('error in getBooksByQuery', error, response.statusCode);
                onError(error);
                return;
            }

            normalize(body, onSuccess);
        });
    }

    function normalize(rawData, next) {
        var result;

        if (rawData.items !== undefined) {
            result = [];
            for (var i in rawData.items) {
                result.push(normalizeBook(rawData.items[i])); 
            }
        } else {
            result = normalizeBook(rawData);
        }

        next(result);
    }
   
    function getThumbnailCoverLink(id) {
        return "https://books.google.com/books/content?id="
            + id + 
            "&printsec=frontcover&img=1&zoom=1&source=gbs_api";
    }

    function getSmallCoverLink(id) {
        return "https://books.google.com/books/content?id="
            + id + 
            "&printsec=frontcover&img=1&zoom=2&source=gbs_api";
    }

    function normalizeBook(rawBook) {
        var book = {};
        book.id = rawBook.id;

        var volumeInfo = rawBook.volumeInfo;
        book.title = volumeInfo.title;
        book.subtitle = volumeInfo.subtitle || "";
        book.authors = volumeInfo.authors;
        book.publisher = volumeInfo.publisher;
        book.date = volumeInfo.publishedDate;
        book.description = volumeInfo.description;
        book.pages = volumeInfo.pageCount;
        book.rating = volumeInfo.averageRating;
        book.cover = {
            thumb: getThumbnailCoverLink(book.id),
            small: getSmallCoverLink(book.id)
        }
        book.categories = volumeInfo.categories;
        
        var saleInfo = rawBook.saleInfo;
        book.price = saleInfo.retailPrice;
        book.buyLink = rawBook.buyLink;

        cache.set(book.id, book);

        return book;
    }

};
