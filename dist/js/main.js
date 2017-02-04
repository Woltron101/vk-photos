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
                .state('upload', {
                    url: '/upload',
                    templateUrl: 'templates/photo-upload.html',
                    controller: 'uploadController as upload'
                })
                .state('current', {
                    url: '/:id',
                    templateUrl: 'templates/current-album.html',
                    controller: 'photosController as photos'
                })
                .state('details', {
                    url: '/:id/:index',
                    templateUrl: 'templates/photos-details.html',
                    controller: 'currentPhotoController as curPhoto'
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

    mainController.inject = ['$http', 'requestFactory'];

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

    photosController.inject = ['requestFactory'];

    function photosController(requestFactory) {
        var vm = this;

        requestFactory.getAlbumPhotos()
            .then(function(result) {
                console.log("result ", result);
                vm.albumPhotos = result.data.response.items;
            })

    }
})();
;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('currentPhotoController', currentPhotoController);

    currentPhotoController.inject = ['requestFactory', '$stateParams'];

    function currentPhotoController(requestFactory, $stateParams) {
        var vm = this;
        vm.albumId = $stateParams.id;
        requestFactory.getAlbumPhotos()
            .then(function(result) {
                vm.albumPhotos = result.data.response.items;
                vm.currentPhoto = vm.albumPhotos[$stateParams.index];
            })

    }
})();
;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('uploadController', uploadController);

    uploadController.inject = ['$scope', '$http', 'uploadService', '$rootScope', '$sessionStorage', 'URL', 'requestFactory'];

    function uploadController($scope, $http, uploadService, $rootScope, $sessionStorage, URL, requestFactory) {
        var vm = this;

        vm.upload = function() {
            uploadService.upload(); //????????????????
        }

        $scope.$watch(angular.bind(vm, function() {
            return vm.activeAlbum;
        }), function(value) {
            uploadService.activeAlbum = vm.activeAlbum;
        });

        requestFactory.getAlbums()
            .then(function(result) {
                vm.albums = result.data.response
                vm.activeAlbum = vm.albums[0].aid;
            })
    }
})();
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
vk.directive("fileinput", [function() {
    return {
        scope: {
            fileinput: "=",
            filepreview: "="
        },
        link: function(scope, element, attributes) {
            element.bind("change", function(changeEvent) {
                scope.fileinput = changeEvent.target.files;

                console.log("changeEvent ", changeEvent);
                for (var i = 0, f; f = scope.fileinput[i]; i++) {
                    if (!f.type.match('image.*') || i > 4) {
                        continue;
                    }

                    var reader = new FileReader();

                    reader.onload = (function(theFile) {
                        return function(e) {
                            var div = document.createElement('div');
                            div.innerHTML = ['<img class="thumb" src="', e.target.result,
                                '" title="', escape(theFile.name), '"/>'
                            ].join('');
                            document.getElementById('list').insertBefore(div, null);
                        };
                    })(f);
                    reader.readAsDataURL(f);
                }

            });
        }
    }
}]);