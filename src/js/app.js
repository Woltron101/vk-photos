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
                    // controller: 'albumsCtrl as albums'
                })




            // .state('login', {
            //     url: '/login',
            //     templateUrl: 'templates/login.html',
            //     controller: 'loginCtrl as login'
            // })



            // $urlRouterProvider.otherwise('/pokemons');
        }
    ])
    .run(function($location, $localStorage) {
        var paramsStr,
            params = $localStorage.params || {};
        if (!params == {}) {
            alert(53634)
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
            params[key] = value;
        })
        console.log("params ", params);
        $localStorage.params = params
        userId = params.user_id;
        alert(userId)

    })