;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('currentPhotoController', currentPhotoController);

    currentPhotoController.inject = ['requestFactory', '$stateParams'];

    function currentPhotoController(requestFactory, $stateParams) {
        var vm = this;
        vm.albumId = $stateParams.id;
        requestFactory.getAlbumPhotos()
            .then(function(result) {
                vm.albumPhotos = result.data.response.items;
                vm.currentPhoto = vm.albumPhotos[$stateParams.index];
            })

    }
})();