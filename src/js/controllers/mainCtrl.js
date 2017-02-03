;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('mainController', mainController);

    mainController.inject = ['$http', 'requestFactory'];

    function mainController($http, URL, requestFactory) {
        var vm = this


        requestFactory.getAlbums()
            .then(function(result) {
                vm.albums = result.data.response;
                addAlbumThumbSrcs();
            })

        requestFactory.getUser()
            .then(function(result) {
                vm.user = result.data.response;
            });


        function addAlbumThumbSrcs() {
            vm.albums.forEach(function(album) {
                var thumbSrc = URL.BASE_URL + 'photos.getById?photos=' + userId + '_' + album.thumb_id;
                getAlbumThumbSrc(thumbSrc, album);
            })
        }

        function getAlbumThumbSrc(thumbSrc, album) {
            $http.get(thumbSrc, album)
                .then(function(result) {
                    album.thumbSrc = result.data.response[0].src_big;
                });
        }

    }
})();