;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('mainController', mainController);

    mainController.inject = ['$rootScope', '$http', '$routeParams', '$location', '$sessionStorage'];

    function mainController($rootScope, $http, $routeParams, $location, $sessionStorage) {
        var vm = this,
            paramsStr,
            apiUrl = 'https://api.vk.com/method/',
            params = {},
            userId = $rootScope.params.user_id




        $http.get(apiUrl +
                'photos.getAlbums?owner_id=' + userId +
                'access_token=' + $sessionStorage.params.access_token +
                '&v=5.52')
            .then(function(result) {
                vm.albums = result.data.response;
            })
            .then(function() {
                vm.albums.items.forEach(function(album) {
                    var thumbSrc = apiUrl + 'photos.getById?photos=' + userId + '_' + album.thumb_id;
                    addThumbLink(thumbSrc, album);
                })
            })



        $http.get(apiUrl + 'users.get?user_id=' + userId)
            .then(function(result) {
                vm.user = result.data.response;
            });


        function addThumbLink(thumbSrc, album) {
            $http.get(thumbSrc, album)
                .then(function(result) {
                    album.thumbSrc = result.data.response[0].src_big;
                });
        }

    }
})();