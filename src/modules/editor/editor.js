/**
 * @module App
 * @summary Example app
 */

/*globals window, angular*/

angular.module('app', [])

    .controller('editor', ['$scope', '$templateCache', '$compile', '$http', function ($scope, $templateCache, $compile, $http) {
        'use strict';

        // initial data
        $scope.imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        $scope.videoTypes = ['video/avi', 'video/mpeg', 'video/quicktime'];
        $scope.imageUrls = ['gif', 'jpeg', 'png', 'jpg'];
        $scope.videoUrls = ['avi', 'mpeg', 'mov', 'mpg', 'mp4'];
        $scope.blocks = [
            { type: 'text', content: '<h1>Angular Sir Trevor</h1><p>AngularJS block-based editor inspired by Sir Trevor JS</p>' },
            { type: 'image', content: 'http://img08.deviantart.net/cb77/i/2012/122/1/a/landscape_wallpaper_by_nickchoubg-d4yaep3.png' }
        ];

        // functions
        $scope.updateType = function (element, scope) {
            if (scope.block.type === 'text') {
                element.removeAttr('tabindex', '0');
                element.html($templateCache.get(scope.block.type));
            } else {
                element.attr('tabindex', '0');
                element.html($templateCache.get(scope.block.type) + $templateCache.get('overlay'));
            }
            $compile(element.contents())(scope);
        };
        
        $scope.checkBlur = function (el, scope) {
            window.setTimeout(function () {
                if (document.activeElement !== el && !el.contains(document.activeElement)) {
                    scope.block.edit = false;
                    scope.$apply();
                }
            }, 120); // for some reason Safari needs this delay?
        };

        $scope.add = function (array, element) {
            array.push(element);
        };

        $scope.remove = function (array, element) {
            var index = array.indexOf(element);
            if (index === -1) {
                return false;
            }
            array.splice(index, 1);
        };

        $scope.moveUp = function (array, element) {
            var index = array.indexOf(element);
            if (index === -1) {
                return false;
            }
            if (array[index - 1]) {
                array.splice(index - 1, 2, array[index], array[index - 1]);
            } else {
                return 0;
            }
        };

        $scope.moveDown = function (array, element) {
            var index = array.indexOf(element);
            if (index === -1) {
                return false;
            }
            if (array[index + 1]) {
                array.splice(index, 2, array[index + 1], array[index]);
            } else {
                return 0;
            }
        };

        $scope.upload = function (element, scope) {
            var me = this,
                maxsize = 20,
                file = element[0].files[0],
                name = file.name.replace(/\.[^/.]+$/, ''),
                valid = false;

            if ($scope.imageTypes.indexOf(file.type) > -1) {
                valid = true;
                scope.block.type = 'image';
            } else if ($scope.videoTypes.indexOf(file.type) > -1) {
                valid = true;
                scope.block.type = 'video';
            }
            scope.updateType(element.parent().parent().parent(), scope);

            if (valid) {
                if (file.size < (maxsize * 1000 * 1024)) {
                    window.alert('upload here: ' + name);
                } else {
                    window.alert('File size is too large, please ensure you are uploading a file of less than ' + maxsize + 'MB');
                }
            } else {
                window.alert('File type ' + file.type + ' not supported');
            }
        };

        $scope.checkUrl = function (element, scope) {
            var ext = scope.block.content.split('.').pop();
            if ($scope.imageUrls.indexOf(ext) > -1) {
                scope.block.type = 'image';
            } else if ($scope.videoUrls.indexOf(ext) > -1) {
                scope.block.type = 'video';
            } else if (scope.block.content.indexOf('youtube.com') > -1) {
                scope.block.content = scope.block.content.replace('watch?v=', 'embed/');
                scope.block.type = 'video';
            }
            scope.updateType(element.parent().parent(), scope);
        };
        
        $scope.save = function (data) {
            console.log('save', data);
            $http.post('/someUrl', data).success(function (data, status, headers, config) {
                window.alert('save success');
            }).error(function (data, status, headers, config) {
                window.alert('save error');
            });
        };
    }])

    .directive('block', ['$window', '$compile', '$templateCache', function ($window, $compile, $templateCache) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                scope.updateType(element, scope);
                element.bind('blur', function (e) {
                    scope.checkBlur(e.target, scope);
                });
            }
        };
    }])

    .directive('text', ['$window', '$compile', function ($window, $compile) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.bind('blur', function (e) {
                    scope.block.content = element.html();
                    scope.checkBlur(e.target.parentNode, scope);
                });
                element.html(scope.block.content);
            }
        };
    }])

    .directive('image', ['$window', '$compile', function ($window, $compile) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
            }
        };
    }])

    .directive('video', ['$window', '$compile', function ($window, $compile) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.attr('src', attr.content);
            }
        };
    }])

    .directive('upload', ['$window', '$compile', function ($window, $compile) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.bind('dragenter', function (e) {
                    element.parent().addClass('dragging');
                });

                element.bind('dragleave', function (e) {
                    element.parent().removeClass('dragging');
                });

                element.bind('dragdrop', function (e) {
                    scope.upload(element, scope);
                });

                element.bind('change', function (e) {
                    scope.upload(element, scope);
                });
            }
        };
    }])

    .directive('paste', ['$window', '$compile', function ($window, $compile) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.bind('blur', function (e) {
                    scope.checkUrl(element, scope);
                });
            }
        };
    }]);