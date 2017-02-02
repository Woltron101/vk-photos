;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('uploadController', uploadController);

    uploadController.inject = ['$scope', '$http', 'uploadService', '$rootScope', '$sessionStorage', 'URL'];

    function uploadController($scope, $http, uploadService, $rootScope, $sessionStorage, URL) {
        var vm = this;

        vm.upload = function() {
            uploadService.upload();
        }
        $scope.$watch('activeAlbum', function() {
            $rootScope.activeAlbum = vm.activeAlbum
        })
        $http.get(URL.BASE_URL +
                'photos.getAlbums?owner_id=' + $rootScope.params.user_id +
                'access_token=' + $sessionStorage.params.access_token +
                '&v=5.52')
            .then(function(result) {
                vm.albums = result.data.response.items;
            })
    }
})();