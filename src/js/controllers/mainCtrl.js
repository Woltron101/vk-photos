var mainCtrl = vk.controller('mainCtrl', ['$scope', '$rootScope', '$http', '$routeParams', '$location', function($scope, $rootScope, $http, $routeParams, $location) {
    var vm = this,
        paramsStr,
        apiUrl = 'https://api.vk.com/method/',
        params = {},
        userId

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
        $http.get(apiUrl + 'photos.getAlbums?owner_id=' + userId + '&v=5.52')
            .then(function(response) {
                vm.albums = response.data.response;
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
                $http.get(apiUrl + 'photos.get?owner_id=' + userId + '&album_id=' +
                        vm.albums.items[1].id + '&v=5.52')
                    .then(function(response) {
                        vm.albumPhotos = response.data.response;
                        console.log("vm.albumPhotos ", vm.albumPhotos);
                    });
            })

        $http.get(apiUrl + 'users.get?user_id=' + userId)
            .then(function(response) {
                vm.user = response.data.response;
            });
    }





}])