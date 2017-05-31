teenidolApp.directive("modal", [
        function () {
            return {
                restrict: "C",
                link: function (scope, element, attrs) {
                    element.on("show.bs.modal", function () { modalReposition(element); });
                }
            };
        }
]);