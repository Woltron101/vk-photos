;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photosController', photosController);

    photosController.inject = ['requestFactory'];

    function photosController(requestFactory) {
        var vm = this;

        requestFactory.getAlbumPhotos()
            .then(function(result) {
                console.log("result ", result);
                vm.albumPhotos = result.data.response.items;
            })

    }
})();