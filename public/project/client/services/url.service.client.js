(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('UrlService', UrlService);

    function UrlService() {
        return {
            formatUrl: formatUrl
        };

        function formatUrl(loc) {
            if (!loc) {
                loc = {};
            }

            var url = '/api/project/group';

            if (loc.group) {
                url = url + '/' + loc.group;
            }

            if (loc.reading) {
                url = url + '/reading/' + loc.reading;
            }

            if (loc.discussion) {
                url = url + '/discussion/' + loc.discussion;
            }

            if (loc.comment) {
                url = url + '/comment/' + loc.comment;
            }

            return url;
        }
    }

}());
