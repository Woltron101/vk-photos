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