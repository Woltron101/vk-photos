;
(function() {
    'use strict';

    angular
        .module('vk')
        .controller('photoUploasController', photoUploasController);

    photoUploasController.inject = ['$scope', '$http', '$stateParams', '$sessionStorage'];

    function photoUploasController($scope, $http, $stateParams, $sessionStorage) {
        var vm = this,
            apiUrl = 'https://api.vk.com/method/',
            id = '241038246';

        $http.get(apiUrl +
                'photos.getUploadServer?album_id=' + id +
                '&access_token=' + $sessionStorage.params.access_token +
                '&v=5.52&')
            .then(function(result) {
                vm.uploadUrl = result.data.response.upload_url;
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

            console.clear();
            angular.module('fileUpload', [])
                .controller("upload", ['$scope', '$http', 'uploadService', function($scope, $http, uploadService) {
                    $scope.$watch('file', function(newfile, oldfile) {
                        if (angular.equals(newfile, oldfile)) {
                            return;
                        }

                        uploadService.upload(newfile).then(function(res) {
                            // DO SOMETHING WITH THE RESULT!
                            console.log("result", res);
                        })
                    });

                }])
                .service("uploadService", function($http, $q) {

                    return ({
                        upload: upload
                    });

                    function upload(file) {
                        var upl = $http({
                            method: 'POST',
                            url: 'http://jsonplaceholder.typicode.com/posts', // /api/upload
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
                        });
                        return upl.then(handleSuccess, handleError);

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
                                scope.fileinput = changeEvent.target.files[0];
                                var reader = new FileReader();
                                reader.onload = function(loadEvent) {
                                    scope.$apply(function() {
                                        scope.filepreview = loadEvent.target.result;
                                    });
                                }
                                reader.readAsDataURL(scope.fileinput);
                            });
                        }
                    }
                }]);





        }
    }
})();