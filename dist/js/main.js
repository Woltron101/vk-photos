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
    .run(function($location, $sessionStorage, $rootScope) {
        var paramsStr;
        $rootScope.params = $sessionStorage.params || {};
        if (!$rootScope.params.user_id) {
            location = 'https://oauth.vk.com/authorize?client_id=5842586&display=page&redirect_uri=localhost:8080&scope=photos&response_type=token&v=5.62&state=123456'
        }
        paramsStr = $location.path().slice(1).split('&');
        paramsStr.forEach(function(param, index) {
            var ind = param.indexOf('='),
                key = param.slice(0, ind),
                value = param.slice(ind + 1);
            $rootScope.params[key] = value;
        })
        $sessionStorage.params = $rootScope.params;
        userId = $rootScope.params.user_id;
    });
;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('mainController', mainController);

    mainController.inject = ['$rootScope', '$http', '$routeParams', '$location', '$sessionStorage'];

    function mainController($rootScope, $http, $routeParams, $location, $sessionStorage) {
        var vm = this,
            paramsStr,
            apiUrl = 'https://api.vk.com/method/',
            params = {},
            userId = $rootScope.params.user_id




        $http.get(apiUrl +
                'photos.getAlbums?owner_id=' + userId +
                'access_token=' + $sessionStorage.params.access_token +
                '&v=5.52')
            .then(function(result) {
                vm.albums = result.data.response;
            })
            .then(function() {
                vm.albums.items.forEach(function(album) {
                    var thumbSrc = apiUrl + 'photos.getById?photos=' + userId + '_' + album.thumb_id;
                    addThumbLink(thumbSrc, album);
                })
            })



        $http.get(apiUrl + 'users.get?user_id=' + userId)
            .then(function(result) {
                vm.user = result.data.response;
            });


        function addThumbLink(thumbSrc, album) {
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

    photosController.inject = ['$stateParams', '$http', '$state', '$rootScope', '$sessionStorage'];

    function photosController($stateParams, $http, $state, $rootScope, $sessionStorage) {
        var vm = this,
            apiUrl = 'https://api.vk.com/method/';

        $http.get(apiUrl +
                'photos.get?owner_id=' + userId +
                'access_token=' + $sessionStorage.params.access_token +
                '&album_id=' + $stateParams.id +
                '&v=5.52')
            .then(function(result) {
                vm.albumPhotos = result.data.response;
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
        .controller('photoUploasController', photoUploasController);

    photoUploasController.inject = ['$scope', '$http', '$stateParams', '$sessionStorage', '$rootScope'];

    function photoUploasController($scope, $http, $stateParams, $sessionStorage, $rootScope) {
        var vm = this,
            apiUrl = 'https://api.vk.com/method/',
            id = '241038246';

        $http.get(apiUrl +
                'photos.getUploadServer?album_id=' + id +
                '&access_token=' + $sessionStorage.params.access_token +
                '&v=5.52&')
            .then(function(result) {
                $rootScope.uploadUrl = result.data.response.upload_url;
            })

        vm.sendPhoto = function() {
            var formData = new FormData(),
                selectedFile = document.forms.photoUpload.photoUrl.files[0];

            formData.append('file1', selectedFile);

            $http.post(vm.uploadUrl, formData, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).success(function(result) {
                $http.get(
                        apiUrl +
                        'photos.save?server=' + result.server +
                        '&photos_list=' + result.photos_list +
                        '&aid=' + result.aid +
                        '&hash=' + result.hash +
                        '&album_id=' + $stateParams.id +
                        '&v=5.52&access_token=' + $sessionStorage.params.access_token
                    )
                    .then(function() {
                        alert('Upload successful!')
                    })
            })






        }
    }
})();
            // console.clear();
            angular.module('vk')
                .controller("upload", ['$scope', '$http', 'uploadService', '$rootScope', '$sessionStorage',
                    function($scope, $http, uploadService, $rootScope, $sessionStorage) {
                        // $scope.$watch('file', function(newfile, oldfile) {
                        //     if (angular.equals(newfile, oldfile)) {
                        //         return;
                        //     }


                        // });
                        $scope.u = function() {
                            uploadService.upload()
                                // .then(function(res) {
                                //     // DO SOMETHING WITH THE RESULT!
                                //     console.log("result", res);
                                // })

                        }
                    }
                ])
                .service("uploadService", function($http, $q, $sessionStorage) {

                    return ({
                        upload: upload
                    });

                    function upload() {

                        var uploadUrl,
                            upl
                        $http.get('https://api.vk.com/method/' +
                                'photos.getUploadServer?album_id=' + '241038246' +
                                '&access_token=' + $sessionStorage.params.access_token +
                                '&v=5.52&')
                            .then(function(result) {
                                uploadUrl = result.data.response.upload_url;
                            })
                            .then(function() {
                                var file = document.forms.photoUpload.photoUrl.files

                                upl = $http({
                                    method: 'POST',
                                    url: uploadUrl, // /api/upload
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    },
                                    data: {
                                        upload: file
                                    },
                                    transformRequest: function(data, headersGetter) {
                                        var formData = new FormData();
                                        angular.forEach(data, function(value, key) {
                                            formData.append(key, value);
                                        });

                                        var headers = headersGetter();
                                        delete headers['Content-Type'];

                                        return formData;
                                    }
                                }).then(handleSuccess, handleError);


                            })


                        // return upl.then(handleSuccess, handleError);


                    } // End upload function

                    // ---
                    // PRIVATE METHODS.
                    // ---

                    function handleError(response, data) {
                        if (!angular.isObject(response.data) || !response.data.message) {
                            return ($q.reject("An unknown error occurred."));
                        }

                        return ($q.reject(response.data.message));
                    }

                    function handleSuccess(response) {
                        console.log("response ", response);
                        return (response);
                    }

                })
                .directive("fileinput", [function() {
                    return {
                        scope: {
                            fileinput: "=",
                            filepreview: "="
                        },
                        link: function(scope, element, attributes) {
                            element.bind("change", function(changeEvent) {
                                scope.fileinput = changeEvent.target.files;
                                // var files = evt.target.files;
                                for (var i = 0, f; f = scope.fileinput[i]; i++) {

                                    // Only process image files.
                                    if (!f.type.match('image.*')) {
                                        continue;
                                    }

                                    var reader = new FileReader();

                                    // Closure to capture the file information.
                                    reader.onload = (function(theFile) {
                                        return function(e) {
                                            // Render thumbnail.
                                            var span = document.createElement('span');
                                            span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                                '" title="', escape(theFile.name), '"/>'
                                            ].join('');
                                            document.getElementById('list').insertBefore(span, null);
                                            // scope.$apply(function() {
                                            //     scope.filepreview = loadEvent.target.result;
                                            //     console.log("loadEvent.target ", loadEvent.target);
                                            //     console.log("scope.filepreview ", scope.filepreview);
                                            // });
                                        };
                                    })(f);

                                    // Read in the image file as a data URL.
                                    reader.readAsDataURL(f);
                                }

                            });
                        }
                    }
                }]);