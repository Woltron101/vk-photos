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