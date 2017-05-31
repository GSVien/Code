teenidolApp.directive("jqDropdown", [
    "$timeout", "helperService", function ($timeout, helperService) {
        return {
            restrict: "C",
            link: function (scope, element, attrs) {
                element.on("show", function (event, dropdownData) {
                    var bw = $(window).width();
                    var bh = $(window).height();
                    var tw = dropdownData.trigger.width();
                    var th = dropdownData.trigger.height();
                    var to = dropdownData.trigger.offset();
                    var t = "";
                    var b = "";
                    var l = "";
                    var r = "";
                    
                    if (bw - (to.left + tw) > 200) {
                        element.removeClass("jq-dropdown-anchor-right");
                        l = to.left;
                    } else {
                        element.addClass("jq-dropdown-anchor-right");
                        r = bw - (to.left + tw);
                    }

                    if (bh - (to.top + th) > 200) {
                        element.addClass("jq-dropdown-tip");
                        t = to.top + th;
                    } else {
                        element.removeClass("jq-dropdown-tip");
                        b = bh - to.top;
                    }

                    element.css("top", t);
                    element.css("bottom", b);
                    element.css("left", l);
                    element.css("right", r);
                });

                $(".jq-dropdown-menu, .jq-dropdown-panel").on("show", function (event, dropdownData) {
                    var $target = $(e.target).closest("[ud-role=user-popup]");
                    var right = $target.offset().left + $target.width();
                    var windowWidth = $(window).width();

                    $("#dropdown-user-info").data("user-id", attrs.userId * 1);
                    $("#dropdown-user-info").data("schedule-id", attrs.scheduleId ? attrs.scheduleId * 1 : undefined);
                    if (right >= windowWidth - 300) {
                        $("#dropdown-user-info").addClass("jq-dropdown-anchor-right");
                    } else {
                        $("#dropdown-user-info").removeClass("jq-dropdown-anchor-right");
                    }
                });
            }
        };
    }
]);