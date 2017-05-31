teenidolApp.directive("ucShowGlobalMessage", [
    "webService", "sessionService", "helperService", "authenticationService", "Notification",
    function (webService, sessionService, helperService, authenticationService, Notification) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;
            $scope.scheduleId = undefined;

            $scope.listMessage = [];
            $scope.messageTarget = undefined;
            $scope.autoScroll = true;
            $scope.targetUserId = undefined;

            //#endregion

            //#region [Method]

            this.load = function (scheduleId) {

                $scope.scheduleId = scheduleId;

                //#region [Lấy danh sách người chat]

                $scope.messageTarget = {
                    list: [
                        {
                            name: "Cả phòng"
                        }
                    ]
                };
                $scope.messageTarget.selected = $scope.messageTarget.list[0];

                //#endregion

                //#region [config Coin chat]
                webService.call({
                    name: "Config_GetConfig",
                    data: {
                        actionUserId: sessionService.userId(),
                        value: "CoinChatValue",
                        key: sessionService.key(),
                    },
                    onSuccess: function (r) {
                        $scope.CoinChatValue = r.Result.Value;
                    }
                });
                //#endregion

                $scope.status = "loaded";
                $scope.$apply();
            };

            this.scrollToBottom = function () {
                var $list = $element.find(".list");
                $list.scrollTop($list[0].scrollHeight);
            };

            this.addMessageTarget = function (userId, name, avatar) {
                var check = true;
                $scope.targetUserId = userId;
                $($scope.messageTarget.list).each(function (i, x) {
                    if (x.id === userId) {
                        check = false;
                        return false;
                    }
                });

                if (check) {
                    $scope.messageTarget.list.push({
                        id: userId,
                        name: name,
                        avatar: avatar
                    });
                }
            };

            this.setMessageTarget = function (userId) {
                var index = 0;

                $($scope.messageTarget.list).each(function (i, x) {
                    if (x.id === userId) {
                        index = i;
                        return false;
                    }
                });

                $scope.messageTarget.selected = $scope.messageTarget.list[index];
            };

            this.addMessage = function (fromUser, targerUser, message) {
               
                message = helperService.formatMessage(message);

                $scope.listMessage.push({
                    user: fromUser,
                    target: targerUser,
                    message: message,
                    type: "message"
                });

                while ($scope.listMessage.length > 100) {
                    $scope.listMessage.shift();
                }

                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            this.addAlert = function (message) {
                message = helperService.formatMessage(message);
                $scope.listMessage.push({
                    message: message,
                    type: "alert"
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            this.addAlertGlobal = function (header, message) {
                
                message = header + helperService.formatMessage(message);
                message = helperService.urlify(message);
                $scope.listMessage.push({
                    message: message,
                    type: "alert"
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            this.addAlertGlobal2 = function (header, message) {


                $scope.listMessage.push({
                    message: message,
                    type: "alert"
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            //#endregion

            //#region [Callback]

            // onSendMessage(message, target, callback)

            //#endregion

            //#region [Event]

            $scope.onTextKeyPress = function ($event) {
                $("#dropdown-message-emoticon").jqDropdown("hide");

                if ($event.keyCode === 13 && $event.shiftKey === false) {
                    $event.preventDefault();
                    $scope.onSendMessage({
                        target: $($event.target).closest("form")
                    });
                }
            };

            $scope.onSendMessage = function ($event) {
                
                $("#dropdown-message-emoticon").jqDropdown("hide");

                var $target = $($event.target);
                var $button = $target.find("[type=submit]");
                var $checkbox = $target.find("[type=checkbox]");

                if ($scope.helper.isLoading($button))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                if (!$target.find("textarea#message-text.message-text").val()) {
                    Notification.warning({ message: 'Bạn chưa nhập tin nhắn !', delay: 3000, positionY: 'bottom', positionX: 'right' });
                    return;
                }
                if ($checkbox.is(":checked")) {
                    webService.call({
                        name: "SendCoinChat",
                        type: "POST",
                        data: {
                            actionUserId: sessionService.userId(),
                            scheduleId: $scope.scheduleId,
                            message: $target.find("textarea#message-text.message-text").val(),
                            targetUserId: $scope.targetUserId ? $scope.targetUserId : -1,
                            key: sessionService.key()
                        },
                        displayError: true,
                        onSuccess: function (r) {
                            sessionService.data().user.User.Coin += -r.config;
                            $target.find("textarea#message-text.message-text").val("");
                            return;
                        }
                    });
                } else {
                    if (typeof $scope._ctrl.onSendMessage === "function") {
                        $button.button("loading");
                        $scope._ctrl.onSendMessage($target.find("textarea#message-text.message-text").val(), $scope.messageTarget.selected, function () {
                            $scope.$apply();
                        });
                        $button.button("reset");
                        $target.find("textarea#message-text.message-text").val("");
                    }
                }
            };

            //#endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "/Views/UserControl/ucShowGlobalMessage.html",
            controller: controller
        };
    }
]);