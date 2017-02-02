;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photosController', photosController);

    photosController.inject = ['$stateParams', '$http', '$state', '$rootScope', '$sessionStorage', 'URL', 'requestFactory'];

    function photosController($stateParams, $http, $state, $rootScope, $sessionStorage, URL, requestFactory) {
        var vm = this;

        console.log("requestFactory.getAlbumPhotos() ", requestFactory.getAlbumPhotos());
        requestFactory.getAlbumPhotos()
            .then(function(result) {
                console.log("result ", result);
                vm.albumPhotos = result.data.response.items;
                console.log("vm.albumPhotos ", vm.albumPhotos);
            })
            .then(function() {
                if ($state.is('photos.details')) getCurrentPhoto();
            })

        $rootScope.$on('$stateChangeSuccess',
            function(event, toState) {
                if (toState.name == 'photos.details') getCurrentPhoto();
            })

        function getCurrentPhoto() {
            vm.albumPhotos.items.forEach(function(photo) {
                if (photo.id == $stateParams.index) {
                    vm.currentPhoto = photo;
                }
            })
        }
    }
})();