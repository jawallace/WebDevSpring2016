(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('GroupService', GroupService);

    GroupService.$inject = [ '$http', 'UrlService' ];
    function GroupService($http, UrlService) {
        var BASE_URL = '/api/project/group';
        
        var service = {
            createGroup: createGroup,
            getGroupById: getGroupById,
            getAllGroups: getAllGroups,
            searchForGroups: searchForGroups,
            updateGroup: updateGroup,
            deleteGroup: deleteGroup,
            getMembersForGroup: getMembersForGroup,
            getAdminsForGroup: getAdminsForGroup,
            addMemberToGroup: addMemberToGroup,
            addAdminToGroup: addAdminToGroup,
            removeMemberFromGroup: removeMemberFromGroup,
            removeAdminFromGroup: removeAdminFromGroup
        };

        return service;

        //////////////////////////////////// 

        function createGroup(group) {
            return $http
                .post(UrlService.formatUrl(), group)
                .then(function(res) {
                    return res.data;
                });
        }

        function getGroupById(loc) {
            return $http
                .get(UrlService.formatUrl(loc))
                .then(function(res) {
                    return res.data;
                });
        }

        function getAllGroups() {
            return $http
                .get(UrlService.formatUrl())
                .then(function(res) {
                    return res.data;
                });
        }

        function searchForGroups(q) {
            return $http
                .get(UrlService.formatUrl(), { params: { q: q } })
                .then(function(res) {
                    return res.data;
                });
        }

        function updateGroup(loc, updated) {
            return $http
                .put(UrlService.formatUrl(loc), updated)
                .then(function(res) {
                    return res.data;
                });
        }

        function deleteGroup(loc) {
            return $http
                .delete(UrlService.formatUrl(loc))
                .then(function(res) {
                    return res.data;
                });
        }
        
        function getMembersForGroup(loc) {
            return $http
                .get(UrlService.formatUrl(loc) + '/member')
                .then(function(res) {
                    return res.data;
                });
        }

        function getAdminsForGroup(loc) {
            return $http
                .get(UrlService.formatUrl(loc) + '/admin')
                .then(function(res) {
                    return res.data;
                });
        }

        function addMemberToGroup(loc, member) {
            return $http
                .post(UrlService.formatUrl(loc) + '/member', { id: member })
                .then(function(res) {
                    return res.data;
                });
        }

        function addAdminToGroup(loc, admin) {
            return $http
                .post(UrlService.formatUrl(loc) + '/admin', { id: admin })
                .then(function(res) {
                    return res.data;
                });
        }

        function removeMemberFromGroup(loc, member) {
            return $http
                .delete(UrlService.formatUrl(loc) + '/member/' + member)
                .then(function(res) {
                    return res.data;
                });
        }

        function removeAdminFromGroup(loc, admin) {
            return $http
                .delete(UrlService.formatUrl(loc) + '/admin/' + admin)
                .then(function(res) {
                    return res.data;
                });
        }

    }
}());
