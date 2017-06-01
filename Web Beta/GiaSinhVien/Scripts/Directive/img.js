giasinhvienApp.directive("img", [
    function () {
        return {
            restrict: "E",
            link: function (scope, element, attrs) {
                var errorSrc = getOrDefault($(this).attr("error-src"), "/Content/Image/Background-Item/Meo-gif.gif");

                if (attrs.ngSrc === "")
                    element.attr("src", errorSrc);

                if (element.attr("img-error"))
                    return;

                element.error(function () {
                    element.off("onerror")
                        .attr("src", errorSrc)
                        .attr("img-error", "");
                });
            }
        };
    }
]);