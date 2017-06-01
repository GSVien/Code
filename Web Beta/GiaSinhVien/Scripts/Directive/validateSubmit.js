giasinhvienApp.directive("validateSubmit", [
    function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.attr("novalidate", "");
                element.bind("submit", function(e) {
                    e.preventDefault();
                    if (element.data("$formController").$valid)
                        scope.$eval(attributes.validateSubmit);
                });
            }
        };
    }
]);