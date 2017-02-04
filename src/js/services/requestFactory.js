vk.factory('requestFactory', ['$http', 'URL', '$sessionStorage', '$stateParams',
    function($http, URL, $sessionStorage, $stateParams) {
        return {
            userId: userId,
            cb: '&callback=JSON_CALLBACK',


            getAlbums: function() {
                var url = URL.BASE_URL + 'photos.getAlbums' + '?owner_id=' + this.userId + this.cb;

                return $http.jsonp(url)
            },
            getUser: function() {
                return $http.jsonp(URL.BASE_URL + 'users.get?user_id=' + userId + '&callback=JSON_CALLBACK')

            },
            getAlbumPhotos: function() {


                return $http.jsonp(URL.BASE_URL +
                    'photos.get?owner_id=' + userId +
                    'access_token=' + $sessionStorage.params.access_token +
                    '&album_id=' + $stateParams.id +
                    '&v=5.52' + this.cb)


            },
            uploadPhotos: function(alb) {
                return $http.get(URL.BASE_URL +
                    'photos.getUploadServer?album_id=' + alb +
                    '&access_token=' + $sessionStorage.params.access_token +
                    '&v=5.52&')
            }



        }
    }
]);