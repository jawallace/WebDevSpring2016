(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('UserService', UserService);

    UserService.$inject = [ '$http', '$q' ];
    function UserService($http, $q) {
        
        var baseUrl = '/api/project/user';
        var LOGIN_URL = '/api/project/login';
        var LOGGED_IN_URL = '/api/project/loggedIn';
        var LOGOUT_URL = '/api/project/logout';

        var service = {
            findByUsername: findByUsername,
            findAllUsers: findAllUsers,
            findUserById: findUserById,
            getGroupsForUser: getGroupsForUser,
            createUser: createUser,
            updateUser: updateUser,
            deleteUserById: deleteUserById,
            login: login,
            isLoggedIn: isLoggedIn,
            logout: logout,
            likeComment: likeComment,
            unlikeComment: unlikeComment,
            likesComment: likesComment
        };

        return service;

        //////////////////////////////////
       
        function findByUsername(username) {
            var config = {
                params: {
                    username: username
                }
            };

            return $http
                .get(baseUrl, config)
                .then(function(res) {
                    return res.data;
                });
        }

        function findAllUsers() {
            return $http
                .get(baseUrl)
                .then(function(res) {
                    return res.data;
                });
        }

        function findUserById(id) {
            return $http
                .get(baseUrl + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function getGroupsForUser(id) {
            return $http
                .get(baseUrl + '/' + id + '/group')
                .then(function(res) {
                    return res.data;
                });
        }

        function createUser(user) {
            return $http
                .post(baseUrl, user)
                .then(function(res) {
                    return res.data;
                });

        }

        function deleteUserById(id) {
            return $http
                .delete(baseUrl + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function updateUser(id, user) {
            return $http
                .put(baseUrl + '/' + id, user)
                .then(function(res) {
                    return res.data;
                });
        }

        function login(credentials) {
            return $http
                .post(LOGIN_URL, credentials)
                .then(function(res) {
                    return res.data;
                });
        }

        function isLoggedIn() {
            return $http
                .get(LOGGED_IN_URL)
                .then(function(res) {
                    return res.data;
                });
        }

        function logout() {
            return $http.post(LOGOUT_URL);
        }

        function likeComment(user, loc) {
            var i = _findLike(user.likes, loc);
            if (i > -1) {
                var deferred = $q.defer();
                deferred.resolve(user);
                return deferred.promise;
            } else {
                user.likes.push(loc);
                return updateUser(user._id, { likes: user.likes });
            }
        }

        function unlikeComment(user, loc) {
            var i = _findLike(user.likes, loc);
            if (i === -1) {
                var deferred = $q.defer();
                deferred.resolve(user);
                return deferred.promise;
            } else {
                user.likes.splice(i, 1);
                return updateUser(user._id, { likes: user.likes });
            }
        }

        function likesComment(user, loc) {
            return _findLike(user.likes, loc) > -1;
        }

        function _findLike(likes, loc) {
            var i = -1;
            likes.forEach(function(l, index) {
                if (l.group === loc.group && l.reading === loc.reading && l.discussion === loc.discussion && l.comment === loc.comment) {
                    i = index
                }
            });

            return i;
        }
    }
        
}());
