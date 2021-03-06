(function () {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('BookService', BookService);

    function BookService($http) {
        var service = {
            getBookByQuery: getBookByQuery,
            getBookById: getBookById
        };

        var baseUrl = '/api/project/book'
        return service;

        function getBookByQuery(query, page) {
            var params = {
                q: query
            };

            if (page) {
                params.page = page;
            }

            return $http
                .get(baseUrl, { params: params })
                .then(function (res) {
                    return res.data;
                });
        }

        function getBookById(id) {
            return $http
                .get(baseUrl + '/' + id)
                .then(function (res) {
                    return res.data;
                });
        }
    }

}());
