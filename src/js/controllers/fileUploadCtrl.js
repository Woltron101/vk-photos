;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('uploadController', uploadController);

    uploadController.inject = ['$scope', '$http', 'uploadService', '$rootScope', '$sessionStorage', 'URL', 'requestFactory'];

    function uploadController($scope, $http, uploadService, $rootScope, $sessionStorage, URL, requestFactory) {
        var vm = this;

        vm.upload = function() {
            uploadService.upload();
        }
        $scope.$watch('activeAlbum', function() {
            $rootScope.activeAlbum = vm.activeAlbum
        })
        requestFactory.getAlbums()
            .then(function(result) {
                vm.albums = result.data.response;
                console.log("result.data ", result.data);
                addAlbumThumbSrcs();
            })
            .then(function(result) {
                vm.albums = result.data.response.items;
            })
    }
})();