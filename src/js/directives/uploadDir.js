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