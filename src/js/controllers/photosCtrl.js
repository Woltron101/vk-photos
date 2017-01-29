(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photosController', photosController);

    photosController.inject = ['$scope', '$stateParams', '$http', '$state', '$rootScope', '$sessionStorage'];

    function photosController($scope, $stateParams, $http, $state, $rootScope, $sessionStorage) {
        var vm = this;
        vm.id = $stateParams.id;

        $http.get('https://api.vk.com/method/' + 'photos.get?owner_id=' + userId + '&album_id=' +
                $stateParams.id + '&v=5.52')
            .then(function(result) {
                vm.albumPhotos = result.data.response;
            })
            .then(function() {
                if ($state.is('photos.details')) {
                    getCurrentPhoto();
                }
            })

        $http.get('https://api.vk.com/method/' + 'photos.getUploadServer?album_id=' +
                $stateParams.id + '&v=5.52&access_token=' + $sessionStorage.params.access_token)
            .then(function(result) {
                vm.uploadUrl = result.data.response.upload_url;
            })
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState) {
                if (toState.name == 'photos.details' && $stateParams.index) {

                    getCurrentPhoto()
                }
            })

        function getCurrentPhoto() {
            vm.albumPhotos.items.forEach(function(photo) {
                if (photo.id == $stateParams.index) {
                    vm.currentPhoto = photo;
                }
            })
        }
        vm.sendPhoto = function() {
            var formData = new FormData(),
                selectedFile = document.forms.photoUpload.photoUrl.files[0];

            formData.append('file1', selectedFile);

            $http.post(vm.uploadUrl, formData, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).success(function(result) {
                $http.get(
                        'https://api.vk.com/method/' +
                        'photos.save?server=' + result.server +
                        '&photos_list=' + result.photos_list +
                        '&aid=' + result.aid +
                        '&hash=' + result.hash +
                        '&album_id=' + $stateParams.id +
                        '&v=5.52&access_token=' + $sessionStorage.params.access_token
                    )
                    .then(function() {
                        alert('Upload successful!')
                    })
            })
        }
    }
})();