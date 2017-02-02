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
;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('mainController', mainController);

    mainController.inject = ['$http', 'URL', 'requestFactory'];

    function mainController($http, URL, requestFactory) {
        var vm = this


        requestFactory.getAlbums()
            .then(function(result) {
                vm.albums = result.data.response;
                addAlbumThumbSrcs();
            })

        requestFactory.getUser()
            .then(function(result) {
                vm.user = result.data.response;
            });


        function addAlbumThumbSrcs() {
            vm.albums.forEach(function(album) {
                var thumbSrc = URL.BASE_URL + 'photos.getById?photos=' + userId + '_' + album.thumb_id;
                getAlbumThumbSrc(thumbSrc, album);
            })
        }

        function getAlbumThumbSrc(thumbSrc, album) {
            $http.get(thumbSrc, album)
                .then(function(result) {
                    album.thumbSrc = result.data.response[0].src_big;
                });
        }

    }
})();
;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photosController', photosController);

    photosController.inject = ['$stateParams', '$http', '$state', '$rootScope', '$sessionStorage', 'URL', 'requestFactory'];

    function photosController($stateParams, $http, $state, $rootScope, $sessionStorage, URL, requestFactory) {
        var vm = this;

        console.log("requestFactory.getAlbumPhotos() ", requestFactory.getAlbumPhotos());
        requestFactory.getAlbumPhotos()
            .then(function(result) {
                console.log("result ", result);
                vm.albumPhotos = result.data.response.items;
                console.log("vm.albumPhotos ", vm.albumPhotos);
            })
            .then(function() {
                if ($state.is('photos.details')) getCurrentPhoto();
            })

        $rootScope.$on('$stateChangeSuccess',
            function(event, toState) {
                if (toState.name == 'photos.details') getCurrentPhoto();
            })

        function getCurrentPhoto() {
            vm.albumPhotos.items.forEach(function(photo) {
                if (photo.id == $stateParams.index) {
                    vm.currentPhoto = photo;
                }
            })
        }
    }
})();
;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('uploadController', uploadController);

    uploadController.inject = ['$scope', '$http', 'uploadService', '$rootScope', '$sessionStorage', 'URL'];

    function uploadController($scope, $http, uploadService, $rootScope, $sessionStorage, URL) {
        var vm = this;

        vm.upload = function() {
            uploadService.upload();
        }
        $scope.$watch('activeAlbum', function() {
            $rootScope.activeAlbum = vm.activeAlbum
        })
        $http.get(URL.BASE_URL +
                'photos.getAlbums?owner_id=' + $rootScope.params.user_id +
                'access_token=' + $sessionStorage.params.access_token +
                '&v=5.52')
            .then(function(result) {
                vm.albums = result.data.response.items;
            })
    }
})();
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
vk.factory('requestFactory', ['$http', 'URL', '$sessionStorage', '$stateParams',
    function($http, URL, $sessionStorage, $stateParams) {
        return {
            userId: userId,


            getAlbums: function() {
                var url = URL.BASE_URL + 'photos.getAlbums' + '?owner_id=' + this.userId + '&callback=JSON_CALLBACK';

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
                    '&v=5.52' + '&callback=JSON_CALLBACK')


            }


        }
    }
]);
vk.directive("fileinput", [function() {
    return {
        scope: {
            fileinput: "=",
            filepreview: "="
        },
        link: function(scope, element, attributes) {
            element.bind("change", function(changeEvent) {
                scope.fileinput = changeEvent.target.files;
                for (var i = 0, f; f = scope.fileinput[i]; i++) {
                    if (!f.type.match('image.*')) {
                        continue;
                    }

                    var reader = new FileReader();

                    reader.onload = (function(theFile) {
                        return function(e) {
                            var span = document.createElement('span');
                            span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                '" title="', escape(theFile.name), '"/>'
                            ].join('');
                            document.getElementById('list').insertBefore(span, null);
                        };
                    })(f);
                    reader.readAsDataURL(f);
                }

            });
        }
    }
}]);