vk.service("uploadService", function($http, $q, $sessionStorage, $rootScope, $state) {

    return ({
        upload: upload
    });

    function upload() {
        var uploadUrl,
            upl

        $http.get('https://api.vk.com/method/' +
                'photos.getUploadServer?album_id=' + $rootScope.activeAlbum +
                '&access_token=' + $sessionStorage.params.access_token +
                '&v=5.52&')
            .then(function(result) {
                uploadUrl = result.data.response.upload_url;
            })
            .then(function() {
                var files = document.getElementById('inp').files
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    upl = $http({
                        method: 'POST',
                        url: uploadUrl,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: file,
                        transformRequest: function(data, headersGetter) {
                            var formData = new FormData(),
                                headers = headersGetter();
                            formData.append('file1', file);
                            delete headers['Content-Type'];
                            return formData;
                        }
                    }).success(function(result) {
                        $http.get(
                                'https://api.vk.com/method/' +
                                'photos.save?server=' + result.server +
                                '&photos_list=' + result.photos_list +
                                '&aid=' + result.aid +
                                '&hash=' + result.hash +
                                '&album_id=' + $rootScope.activeAlbum +
                                '&v=5.52&access_token=' + $sessionStorage.params.access_token
                            )
                            .then(function(r) {
                                $state.go('photos.current', { id: $rootScope.activeAlbum })
                            })
                    })
                }
            })
    }
})