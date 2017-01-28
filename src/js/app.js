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