giasinhvienApp.directive("kendoTemplate", [
    "$compile", function ($compile) {
        return {
            restrict: "E",
            transclude: true,
            scope: {
                templateId: "@",
                templateData: "@"
            },
            link: function (scope, element, attrs) {
                //#region [Validation]

                if (isNoUoW(scope.templateId))
                    throw "'template-id' must be declared";

                //#endregion

                var html = "";
                
                if ($("#" + scope.templateId).length === 0) {
                    console.warn("Can not find the template '" + scope.templateId + "'");
                } else {
                    var template = kendo.template($("#" + scope.templateId).html());

                    scope.templateData = getOrDefault(scope.templateData, {});
                    
                    if (typeof scope.templateData !== "object") {
                        try {
                            scope.templateData = JSON.parse(scope.templateData);
                        } catch (e) {
                            scope.templateData = {};
                            console.warn("Can not parse template-data of template: '" + scope.templateId + "'");
                        }
                    }

                    html = template(scope.templateData);
                }

                element.replaceWith($compile(html)(scope.$parent.$parent));
            }
        };
    }
]);