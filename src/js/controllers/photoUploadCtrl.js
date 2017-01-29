;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photoUploasController', photoUploasController);

    photoUploasController.inject = ['$scope', '$http', '$stateParams', '$sessionStorage', '$rootScope'];

    function photoUploasController($scope, $http, $stateParams, $sessionStorage, $rootScope) {
        var vm = this,
            apiUrl = 'https://api.vk.com/method/',
            id = '241038246';

        $http.get(apiUrl +
                'photos.getUploadServer?album_id=' + id +
                '&access_token=' + $sessionStorage.params.access_token +
                '&v=5.52&')
            .then(function(result) {
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
                        alert('Upload successful!')
                    })
            })






        }
    }
})();