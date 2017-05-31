teenidolApp.directive("imgScale", [
    function () {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                link: "@",
                errorSrc: "@",
                rescaleonresize: "@",
            },
            template: "<div class='img-container'><img ng-src='{{link}}' error-src='{{errorSrc}}'></div>",
            link: function (scope, element, attrs) {
                if (!scope.rescaleonresize) {
                    rescaleonresize = false;
                }
                else {
                    rescaleonresize = attrs.rescaleonresize;
                }
                element.find("img").imageScale({
                    rescaleOnResize: rescaleonresize,
                    scale: attrs.scale,
                    align: attrs.align
                });
            }
        };
    }
]);