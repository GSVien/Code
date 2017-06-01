giasinhvienApp.directive("udRole", [
    "authenticationService", "sessionService", "modalService", function (authenticationService, sessionService, modalService) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                switch (attrs.udRole) {
                    case "sign-in":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: element.data("message"),
                                messageType: element.data("message-type")
                            });
                        });
                        break;

                    case "sign-up":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "sign-up",
                                message: element.data("message"),
                                messageType: element.data("message-type")
                            });
                        });
                        break;

                    case "re-pass":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "re-pass",
                                message: element.data("message"),
                                messageType: element.data("message-type")
                            });
                        });
                        break;

                    case "sign-out":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "sign-out"
                            });
                        });
                        break;

                    case "modal-youtube-inshow":
                        element.on("click", function (e) {
                            $(function () { $('#modal-youtube-inshow').draggable({ handle: ".modal-header" }).resizable(); });
                        });
                        break;

                    case "user-popup":
                        element.jqDropdown("attach", "#dropdown-user-info");
                        element.on("click", function (e) {
                            $("#dropdown-user-info").data("user-id", attrs.userId * 1);
                            $("#dropdown-user-info").data("vip-id", attrs.vipId * 1);
                            $("#dropdown-user-info").data("schedule-id", attrs.scheduleId ? attrs.scheduleId * 1 : undefined);
                        });
                        break;

                    case "message-emoticon":
                        element.jqDropdown("attach", "#dropdown-message-emoticon");
                        element.on("click", function (e) {
                            $("#dropdown-message-emoticon").data("emoticon-target", attrs.emoticonTarget);
                        });
                        break;
                    case "open-guild":
                        element.on("click", function (e) {
                            modalService.showDetailGuild({
                                Id: attrs.id,
                            });
                        });
                        break;

                    default:
                        console.warn("ud-role: '" + attrs.udRole + "' is not declared");
                        break;
                }
            }
        };
    }
]);