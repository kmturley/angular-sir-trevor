/**
 * @module App
 * @summary Example app
 */

/*globals window, angular*/

angular.module('app', [])

    .controller('editor', ['$scope', '$templateCache', function ($scope, $templateCache) {
        'use strict';

        // initial data
        $scope.blocks = [
            { type: 'text', content: '<h1>Angular Sir Trevor</h1><p>AngularJS block-based editor inspired by Sir Trevor JS</p>' },
            { type: 'image', content: 'http://momsmack.com/wp-content/uploads/2013/09/photography-15a.jpg' }
        ];

        // functions
        $scope.reset = function () {
            angular.forEach($scope.blocks, function (value, key) {
                delete value.edit;
            });
        };

        $scope.add = function (array, element) {
            array.push(element);
        };

        $scope.edit = function (array, element) {
            element.edit = !element.edit;
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

        $scope.upload = function (element) {
            var me = this,
                file = element.files[0],
                name = file.name.replace(/\.[^/.]+$/, '');

            if (file.type === '' ||
                    file.type === 'image/png' ||
                    file.type === 'image/jpeg' ||
                    file.type === 'image/jpg' ||
                    file.type === 'video/mp4' ||
                    file.type === 'video/mpg' ||
                    file.type === 'video/mpeg') {
                if (file.size < (3000 * 1024)) {
                    window.alert('upload here: ' + name);
                } else {
                    window.alert('File size is too large, please ensure you are uploading a file of less than 3MB');
                }
            } else {
                window.alert('File type ' + file.type + ' not supported');
            }
        };
    }])

    .directive('block', ['$window', '$compile', '$templateCache', function ($window, $compile, $templateCache) {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.html($templateCache.get(scope.block.type) + $templateCache.get('edit'));
                $compile(element.contents())(scope);

                element.bind('blur', function (e) {
                    window.setTimeout(function () {
                        if (document.activeElement !== e.target && !e.target.contains(document.activeElement)) {
                            scope.block.edit = false;
                            scope.$apply();
                        }
                    }, 1);
                });
            }
        };
    }])

    .directive('text', ['$window', '$compile', function ($window, $compile) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.bind('focusout', function (e) {
                    scope.block.content = element.html();
                    window.setTimeout(function () {
                        if (document.activeElement !== e.target && !e.target.parentNode.contains(document.activeElement)) {
                            scope.block.edit = false;
                            scope.$apply();
                        }
                    }, 1);
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
                    scope.upload(element[0]);
                });

                element.bind('change', function (e) {
                    scope.upload(element[0]);
                });
            }
        };
    }]);