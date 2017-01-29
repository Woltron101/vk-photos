;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photosController', photosController);

    photosController.inject = ['$stateParams', '$http', '$state', '$rootScope', '$sessionStorage'];

    function photosController($stateParams, $http, $state, $rootScope, $sessionStorage) {
        var vm = this,
            apiUrl = 'https://api.vk.com/method/';

        $http.get(apiUrl +
                'photos.get?owner_id=' + userId +
                'access_token=' + $sessionStorage.params.access_token +
                '&album_id=' + $stateParams.id +
                '&v=5.52')
            .then(function(result) {
                vm.albumPhotos = result.data.response;
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