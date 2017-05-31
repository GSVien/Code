teenidolApp.directive("validateError", ["$compile",
    function ($compile) {
        return {
            restrict: "E",
            scope: {
                target: "="
            },
            link: function (scope, element, attrs) {
                var child = element.html().replace(new RegExp("when=\"", "g"), "ng-if=\"target.");
                var html = "<div class='validate-error' ng-if='target.$invalid && (target.$touched || target.$$parentForm.$submitted)'>" + child    + "</div>";
                element.replaceWith($compile(html)(scope));
            }
        };
    }
]);