(function() {
    'use strict';

    angular
        .module('vk')
        .controller('currentPhotoController', currentPhotoController);

    currentPhotoController.inject = ['$scope'];

    function currentPhotoController($scope) {
        var vm = this;
        vm.currentPhoto = vm.albumPhotos.items[$stateParams.index];
    }
})();