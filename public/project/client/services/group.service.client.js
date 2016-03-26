(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('GroupService', GroupService);

    GroupService.$inject = [ '$http' ];
    function GroupService($http) {
        var BASE_URL = '/api/project/group';
        
        var service = {
            createGroup: createGroup,
            getGroupById: getGroupById,
            getAllGroups: getAllGroups,
            updateGroup: updateGroup,
            deleteGroup: deleteGroup,
            getReadingsForGroup: getReadingsForGroup,
            getMembersForGroup: getMembersForGroup,
            getAdminsForGroup: getAdminsForGroup,
            addReadingToGroup: addReadingToGroup,
            addMemberToGroup: addMemberToGroup,
            addAdminToGroup: addAdminToGroup,
            removeReadingFromGroup: removeReadingFromGroup,
            removeMemberFromGroup: removeMemberFromGroup,
            removeAdminFromGroup: removeAdminFromGroup
        };

        activate();

        return service;

        //////////////////////////////////// 

        function activate() {
        }

        function createGroup(group) {
            return $http
                .post(BASE_URL, group)
                .then(function(res) {
                    return res.data;
                });
        }

        function getGroupById(id) {
            return $http
                .get(BASE_URL + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function getAllGroups() {
            return $http
                .get(BASE_URL)
                .then(function(res) {
                    return res.data;
                });
        }

        function updateGroup(id, updated) {
            return $http
                .put(BASE_URL + '/' + id, updated)
                .then(function(res) {
                    return res.data;
                });
        }

        function deleteGroup(id) {
            return $http
                .delete(BASE_URL + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }
        
        function getReadingsForGroup(id) {
            return $http
                .get(BASE_URL + '/' + id + '/reading')
                .then(function(res) {
                    return res.data;
                });
        }

        function getMembersForGroup(id) {
            return $http
                .get(BASE_URL + '/' + id + '/member')
                .then(function(res) {
                    return res.data;
                });
        }

        function getAdminsForGroup(id) {
            return $http
                .get(BASE_URL + '/' + id + '/admin')
                .then(function(res) {
                    return res.data;
                });
        }

        function addReadingToGroup(id, reading) {
            return $http
                .post(BASE_URL + '/' + id + '/reading', reading)
                .then(function(res) {
                    return res.data;
                });
        }

        function addMemberToGroup(id, member) {
            return $http
                .post(BASE_URL + '/' + id + '/member', member)
                .then(function(res) {
                    return res.data;
                });
        }

        function addAdminToGroup(id, admin) {
            return $http
                .post(BASE_URL + '/' + id + '/admin', admin)
                .then(function(res) {
                    return res.data;
                });
        }

        function removeReadingFromGroup(id, reading) {
            return $http
                .delete(BASE_URL + '/' + id + '/reading/' + reading.id)
                .then(function(res) {
                    return res.data;
                });
        }

        function removeMemberFromGroup(id, member, callback) {
            return $http
                .delete(BASE_URL + '/' + id + '/member/' + member.id)
                .then(function(res) {
                    return res.data;
                });
        }

        function removeAdminFromGroup(id, admin, callback) {
            return $http
                .delete(BASE_URL + '/' + id + '/admin/' + admin.id)
                .then(function(res) {
                    return res.data;
                });
        }

    }
}());
