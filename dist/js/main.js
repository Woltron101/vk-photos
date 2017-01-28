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
                    // controller: 'albumsCtrl as albums'
                })
                .state('photos', {
                    url: '/photos',
                    templateUrl: 'templates/photos.html',
                    // views: {
                    //     'filters': {
                    //         template: '<h1>filters</h1>'
                    //     },
                    //     'tabledata': {
                    //         template: '<h1>tabledata</h1>'
                    //     },
                    //     'graph': {
                    //         template: '<h1>graph</h1>'
                    //     },
                    // }
                })
                .state('photos.current', {
                    url: '/:id',
                    templateUrl: 'templates/current-album.html',
                    controller: 'photosController as photos'
                })
                .state('photos.current.details', {
                    url: '/:index',
                    templateUrl: 'templates/photos-details.html',
                    controller: 'photosController as photos'
                })





            // .state('login', {
            //     url: '/login',
            //     templateUrl: 'templates/login.html',
            //     controller: 'loginCtrl as login'
            // })



            // $urlRouterProvider.otherwise('/albums');
        }
    ])
    .run(function($location, $sessionStorage, $rootScope) {
        var paramsStr;
        $rootScope.params = $sessionStorage.params || {};
        if (!$rootScope.params.user_id) {
            location = 'https://oauth.vk.com/authorize?client_id=5842586&display=page&redirect_uri=localhost:8080&scope=photos&response_type=token&v=5.62&state=123456'
        }
        paramsStr = $location.path().slice(1).split('&')
        console.log("$location.path().slice(1).split('&') ", $location.path().slice(1).split('&'));
        console.log("$location.path().slice(1) ", $location.path().slice(1));
        console.log("$location.path() ", $location.path());
        console.log("paramsStr ", paramsStr);
        paramsStr.forEach(function(param, index) {
            var ind = param.indexOf('='),
                key = param.slice(0, ind),
                value = param.slice(ind + 1);
            $rootScope.params[key] = value;
        })
        $sessionStorage.params = $rootScope.params
        userId = $rootScope.params.user_id;
        alert(userId)

    })
var mainCtrl = vk.controller('mainCtrl', ['$scope', '$rootScope', '$http', '$routeParams', '$location', function($scope, $rootScope, $http, $routeParams, $location) {
    var vm = this,
        paramsStr,
        apiUrl = 'https://api.vk.com/method/',
        params = {},
        userId = $rootScope.params.user_id

    vm.p = params
        // if (params != {}) {
        //     paramsStr = $location.path().slice(1).split('&')
        //     paramsStr.forEach(function(param, index) {
        //         var ind = param.indexOf('='),
        //             key = param.slice(0, ind),
        //             value = param.slice(ind + 1);
        //         params[key] = value;
        //     })
        //     console.log("params ", params);
        //     userId = params.user_id;
        //     alert(userId)
        // }
    vm.writeURL = function() {
        // paramsStr = $location.path().slice(1).split('&')
        // console.log("$location.path().slice(1).split('&') ", $location.path().slice(1).split('&'));
        // console.log("$location.path().slice(1) ", $location.path().slice(1));
        // console.log("$location.path() ", $location.path());
        // console.log("paramsStr ", paramsStr);
        // paramsStr.forEach(function(param, index) {
        //     var ind = param.indexOf('='),
        //         key = param.slice(0, ind),
        //         value = param.slice(ind + 1);
        //     params[key] = value;
        // })
        // console.log("params ", params);
        // userId = params.user_id;
        // alert(userId)
    }



    vm.run = function() {

    }


    $http.get(apiUrl + 'photos.getAlbums?owner_id=' + userId + '&v=5.52')
        .then(function(response) {
            vm.albums = response.data.response;
            console.log("response.data ", response.data);
            console.log("vm.albums ", vm.albums);
        })
        .then(function() {
            vm.albums.items.forEach(function(album) {
                var thumbSrc = apiUrl + 'photos.getById?photos=' + userId + '_' + album.thumb_id
                console.log("album ", album);

                $http.get(thumbSrc)
                    .then(function(response) {
                        album.thumbSrc = response.data.response[0].src_big;
                    });

            })
        })
        .then(function() {

        })

    $http.get(apiUrl + 'users.get?user_id=' + userId)
        .then(function(response) {
            vm.user = response.data.response;
        });


}]);
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