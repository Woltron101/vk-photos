var vk = angular.module('vk', [
        'ui.router',
        'ngRoute',
        'ngStorage'
    ])
    .constant("URL", {
        'BASE_URL': 'https://api.vk.com/method/',
        'AUTHORIZATION': 'https://oauth.vk.com/authorize?client_id=5842586&display=page&redirect_uri=localhost:8080&scope=photos&response_type=token&v=5.62&state=123456'

    })
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, $httpProvider) {
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
                .state('upload', {
                    url: '/upload',
                    templateUrl: 'templates/photo-upload.html'
                })
            $urlRouterProvider.otherwise('/albums');

        }
    ])
    .run(function($location, $sessionStorage, $rootScope, $http) {
        var paramsStr,
            params = {}

        params = $sessionStorage.params || {};
        if (!params.user_id) {
            location = URL.AUTHORIZATION;
        }
        paramsStr = $location.path().slice(1).split('&');
        paramsStr.forEach(function(param, index) {
            var ind = param.indexOf('='),
                key = param.slice(0, ind),
                value = param.slice(ind + 1);
            params[key] = value;
        })
        $sessionStorage.params = params;
        userId = params.user_id;
    });