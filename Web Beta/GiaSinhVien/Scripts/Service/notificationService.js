//teenidolApp.factory("notificationService", [
//    function() {
//        var _topNotificationTemplate = "<div id='top-notification' style='display: none;'></div>";
//        var _screenNotificationTemplate = "<div id='centered-notification' style='display: none;'></div>";
//
//        //#region [Init Top & Screen Notification]
//
//        $("body").append(_topNotificationTemplate);
//        var _topNotification = $("#top-notification").kendoNotification({
//            stacking: "down",
//            button: true,
//            autoHideAfter: 7000,
//            templates: [
//                {
//                    type: "info",
//                    template: $("#top-notification-template").html()
//                }
//            ],
//            show: function(e) {
//                if (!$("." + e.sender._guid)[1]) {
//                    var element = e.element.parent(),
//                        eWidth = element.width(),
//                        wWidth = $(window).width(),
//                        newLeft;
//
//                    newLeft = Math.floor(wWidth / 2 - eWidth / 2);
//
//                    e.element.parent().css({ top: 10, left: newLeft });
//                }
//            }
//        }).data("kendoNotification");
//
//        $("body").append(_screenNotificationTemplate);
//        var _screenNotification = $("#centered-notification").kendoNotification({
//            stacking: "down",
//            button: true,
//            show: function(e) {
//                if (!$("." + e.sender._guid)[1]) {
//                    var element = e.element.parent(),
//                        eWidth = element.width(),
//                        eHeight = element.height(),
//                        wWidth = $(window).width(),
//                        wHeight = $(window).height(),
//                        newTop,
//                        newLeft;
//
//                    newLeft = Math.floor(wWidth / 2 - eWidth / 2);
//                    newTop = Math.floor(wHeight / 2 - eHeight / 2);
//
//                    e.element.parent().css({ top: newTop, left: newLeft });
//                }
//            }
//        }).data("kendoNotification");
//
//        //#endregion
//
//        var service = new function () {
//            this.showTop = function(message) {
//                _topNotification.info({
//                    message: message
//                });
//            }
//            
//            this.screenNotification = _screenNotification;
//
//            this.showAlert = function(o) {
//                //#region [Validation]
//
//                o = getOrDefault(o, {});
//                o.title = getOrDefault(o.title, "Teen Idol");
//                o.body = getOrDefault(o.body, "");
//                o.buttons = getOrDefault(o.buttons, []);
//
//                //#endregion
//
//                // Xóa các event handler cũ
//                $("#modal-alert .modal-footer").off();
//
//                // Đặt title và body
//                $("#modal-alert .modal-title").html(o.title);
//                $("#modal-alert .modal-body").html(o.body);
//
//                // Đặt danh sách nút
//                if (o.buttons.length === 0)
//                    $("#modal-alert .modal-footer").addClass("hidden").html("");
//                else {
//                    // Chèn thẻ
//                    var html = "";
//                    $(o.buttons).each(function(i, x) {
//                        var className = getOrDefault(x.className, "btn-default");
//                        var type = getOrDefault(x.type, null);
//                        var text = getOrDefault(x.text, null);
//
//                        var buttonType = "";
//                        if (type === "close")
//                            buttonType = "data-dismiss='modal'";
//
//                        html += "<button class='alert-button-" + i + " btn " + className + "' " + buttonType + ">" + text + "</button>";
//                    });
//                    $("#modal-alert .modal-footer").html(html).removeClass("hidden");
//
//                    // Gán sự kiện
//                    $(o.buttons).each(function(i, x) {
//                        var onClick = getOrDefault(x.onClick, null);
//
//                        if (typeof onClick === "function")
//                            $("#modal-alert .modal-footer .alert-button-" + i).click(x.onClick);
//                    });
//                }
//
//                // Gọi modal
//                $("#modal-alert").modal("show");
//            };
//
//            this.showReload = function(text) {
//                text = getOrDefault(text, "Có lỗi, xin nhấn Ctrl+F5 hoặc nhận nút dưới để nạp lại trang");
//
//                service.showAlert({
//                    body: text,
//                    buttons: [
//                        {
//                            text: "Nạp lại",
//                            type: "close",
//                            onClick: function() {
//                                location.reload(true);
//                            },
//                        }
//                    ]
//                });
//            };
//        };
//        return service;
//    }
//]);