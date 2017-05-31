teenidolApp.factory("formService", [
    function () {
        var service = new function () {
            this.validate = function (o) {
                //#region [Validation]

                if (!o || typeof o !== "object")
                    return true;
                if (!o.target)
                    throw "target must be declared";
                if (o.rule && o.rule.constructor !== Array)
                    throw "rule must be array";
                o.position = getOrDefault(o.position, "top");

                //#endregion

                //#region [Init tooltip]

                var tooltip = o.target.data("kendoTooltip");
                if (!tooltip) {
                    tooltip = o.target.kendoTooltip({
                        autoHide: false,
                        position: o.position,
                        showOn: "",

                        show: function () {
                            tooltip.popup.element.find(".k-tooltip-button").remove();
                            tooltip.popup.element.addClass("form-error-container");
                        }
                    }).data("kendoTooltip");
                }

                //#endregion

                //#region [Clear]

                tooltip.hide();
                tooltip.options.content = "";
                tooltip.refresh();

                //#endregion

                if (!o.rule)
                    return true;

                //#region [Generate message]

                $(o.rule).each(function (i, x) {
                    if (x.constructor === Array) {
                        $(x).each(function (j, y) {
                            if (!y.check()) {
                                tooltip.options.content += "<li>" + y.message + "</li>";
                                return false;
                            }
                        });
                    } else {
                        if (!x.check())
                            tooltip.options.content += "<li>" + x.message + "</li>";
                    }
                });

                if (tooltip.options.content !== "") {
                    tooltip.options.content = "<ul>" + tooltip.options.content + "</ul>";
                    tooltip.refresh();
                    tooltip.show();
                }

                //#endregion

                return tooltip.options.content === "";
            };

            this.isLoading = function (target) {
                if (target.data("bs.button"))
                    return target.data("bs.button").isLoading;

                return false;
            };

            this.isDisabled = function (target) {
                return target.hasClass("disabled");
            };
        };
        return service;
    }
]);