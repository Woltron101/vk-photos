var vk = angular.module('vk', [
        'ui.router',
        'ngRoute',
        'ngStorage'
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('albums', {
                    url: '/albums',
                    templateUrl: 'templates/albums.html',
                })
                .state('photos', {
                    url: '/photos',
                    templateUrl: 'templates/photos.html'
                })
                .state('photos.current', {
                    url: '/:id',
                    templateUrl: 'templates/current-album.html'
                })
                .state('photos.details', {
                    url: '/:id/:index',
                    templateUrl: 'templates/photos-details.html'
                })




            $urlRouterProvider.otherwise('/albums');
        }
    ])
    .run(function($location, $sessionStorage, $rootScope) {
        var paramsStr;
        $rootScope.params = $sessionStorage.params || {};
        if (!$rootScope.params.user_id) {
            location = 'https://oauth.vk.com/authorize?client_id=5842586&display=page&redirect_uri=localhost:8080&scope=photos&response_type=token&v=5.62&state=123456'
        }
        paramsStr = $location.path().slice(1).split('&')

        paramsStr.forEach(function(param, index) {
            var ind = param.indexOf('='),
                key = param.slice(0, ind),
                value = param.slice(ind + 1);
            $rootScope.params[key] = value;
        })
        $sessionStorage.params = $rootScope.params
        userId = $rootScope.params.user_id;


    })
var mainCtrl = vk.controller('mainCtrl', ['$scope', '$rootScope', '$http', '$routeParams', '$location', function($scope, $rootScope, $http, $routeParams, $location) {
    var vm = this,
        paramsStr,
        apiUrl = 'https://api.vk.com/method/',
        params = {},
        userId = $rootScope.params.user_id




    $http.get(apiUrl + 'photos.getAlbums?owner_id=' + userId + '&v=5.52')
        .then(function(result) {
            vm.albums = result.data.response;
        })
        .then(function() {
            vm.albums.items.forEach(function(album) {
                var thumbSrc = apiUrl + 'photos.getById?photos=' + userId + '_' + album.thumb_id;
                $http.get(thumbSrc)
                    .then(function(result) {
                        album.thumbSrc = result.data.response[0].src_big;
                    });
            })
        })



    $http.get(apiUrl + 'users.get?user_id=' + userId)
        .then(function(result) {
            vm.user = result.data.response;
        });


}]);
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