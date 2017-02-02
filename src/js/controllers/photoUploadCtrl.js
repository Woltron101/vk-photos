;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photoUploadController', photoUploadController);

    photoUploadController.inject = ['$scope', '$http', '$stateParams', '$sessionStorage', '$rootScope', '$state'];

    function photoUploasController($scope, $http, $stateParams, $sessionStorage, $rootScope) {
        var vm = this,
            apiUrl = 'https://api.vk.com/method/'

        $http.get(apiUrl +
                'photos.getUploadServer?album_id=' + id +
                '&access_token=' + $sessionStorage.params.access_token +
                '&v=5.52&')
            .then(function(result) {
                console.log("result ", result);
                $rootScope.uploadUrl = result.data.response.upload_url;
            })

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
                        apiUrl +
                        'photos.save?server=' + result.server +
                        '&photos_list=' + result.photos_list +
                        '&aid=' + result.aid +
                        '&hash=' + result.hash +
                        '&album_id=' + $stateParams.id +
                        '&v=5.52&access_token=' + $sessionStorage.params.access_token
                    )
                    .then(function() {
                        $state.go('photos.current', { id: $stateParams.id })
                    })
            })
        }
    }
})();