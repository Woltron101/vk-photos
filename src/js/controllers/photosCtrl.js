(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photosController', photosController);

    photosController.inject = ['$scope', '$stateParams', '$http', '$state'];

    function photosController($scope, $stateParams, $http, $state) {
        alert(425235)
        var vm = this;
        vm.id = $stateParams.id
        $http.get('https://api.vk.com/method/' + 'photos.get?owner_id=' + userId + '&album_id=' +
                $stateParams.id + '&v=5.52')
            .then(function(response) {
                vm.albumPhotos = response.data.response;
                console.log("vm.albumPhotos ", vm.albumPhotos);
            });
        vm.showPhotoDetails = function(index) {
            vm.currentPhoto = vm.albumPhotos.items[index];
            console.log("vm.albumPhotos.items[index] ", vm.albumPhotos.items[index]);
            console.log("vm.currentPhoto ", vm.currentPhoto);

            $state.go('details', { index: index })
        }
    }
})();