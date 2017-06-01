giasinhvienApp.directive("isLoading", [
    function () {
        return {
            restrict: "A",
            scope: {
                isLoading: "="
            },
            link: function (scope, element) {
                scope.$watch("isLoading", function (newValue) {
                    if (newValue) {
                        element.button("loading");
                    } else {
                        element.button("reset");
                    }
                });
            }
        };
    }
]);