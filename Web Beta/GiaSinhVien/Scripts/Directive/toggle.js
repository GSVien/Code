giasinhvienApp.directive("toggle", [
    function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                scope.$watch(function() {
                    if (attrs.toggle === "tooltip") {
                        $(element).tooltip({
                            container: "body"
                        });
                    } else if (attrs.toggle === "popover") {
                        $(element).popover();
                    }
                });
            }
        };
    }
]);