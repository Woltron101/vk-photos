vk.service("uploadService", function($http, $q, $sessionStorage, $rootScope, $state, requestFactory) {

    return ({
        upload: upload
    });

    function upload() {
        var uploadUrl,
            alb = this.activeAlbum;

        requestFactory.uploadPhotos(alb)
            .then(function(result) {
                uploadUrl = result.data.response.upload_url;
                getPhotoSaveParams().success(sendPhotos)
            })

        function getPhotoSaveParams() {
            var files = document.getElementById('inp').files;
            return $http({
                method: 'POST',
                url: uploadUrl,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: FormData,
                transformRequest: function(data, headersGetter) {
                    var formData = new FormData(),
                        headers = headersGetter();
                    for (var i = 0; i < files.length; i++) {
                        formData.append('file' + i, files[i]);
                    }
                    delete headers['Content-Type'];
                    return formData;
                }
            })
        }

        function sendPhotos(result) {
            $http.get(
                    'https://api.vk.com/method/' +
                    'photos.save?server=' + result.server +
                    '&photos_list=' + result.photos_list +
                    '&aid=' + result.aid +
                    '&hash=' + result.hash +
                    '&album_id=' + result.aid +
                    '&v=5.52&access_token=' + $sessionStorage.params.access_token
                )
                .then(function(r) {
                    $state.go('current', { id: alb })
                })
        }

    }
})