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
            uploadService.upload(); //????????????????
        }

        $scope.$watch(angular.bind(vm, function() {
            return vm.activeAlbum;
        }), function(value) {
            uploadService.activeAlbum = vm.activeAlbum;
        });

        requestFactory.getAlbums()
            .then(function(result) {
                vm.albums = result.data.response
                vm.activeAlbum = vm.albums[0].aid;
            })
    }
})();