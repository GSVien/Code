teenidolApp.directive("ucPrivateMessage", [
    "webService", "sessionService", "helperService", "Notification", "authenticationService", "signalRService", function (webService, sessionService, helperService, Notification, authenticationService, signalRService) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;
            $scope.hub = signalRService.hub();

            $scope.status = "loading";
            $scope.error = undefined;
            $scope.listStatus = "loading";
            $scope.listError = undefined;
            $scope.listTopTargetId = undefined;
            $scope.listTopTarget = [];
            $scope.listTarget = [];
            $scope.listMessage = [];
            $scope.autoScroll = true;
            $scope.targetUserId = undefined;
            $scope.messageGroupId = undefined;
            $scope.messagePageIndex = undefined;
            $scope.messagePageCount = undefined;

            //#endregion

            //#region [Method]

            this.load = function (listTopTargetId) {
                $scope.numberOfConversation = getOrDefault($scope.numberOfConversation, 4);
                $scope.listTopTargetId = listTopTargetId;
                $scope._ctrl.refresh();

                $scope.$watch("targetUserId", $scope.onTargetSelected);
            };

            this.refresh = function () {

                if (!sessionService.isSigned()) {
                    $scope.status = "warning";
                    $scope.error = "Bạn cần đăng nhập";
                } else {
                    $scope.hub.invoke("ConnectMessenger", $scope.hub.connection.id, sessionService.userId()).done(function (hubResult) {
                        webService.call({
                            name: "User_GetListUserByListID",
                            data: {
                                actionUserId: sessionService.userId(),
                                listID: $scope.listTopTargetId.join(),
                                pageIndex: 0,
                                pageSize: 999999,
                                key: sessionService.key()
                            },

                            onError: function (errorCode, message) {
                                $scope.status = "error";
                                $scope.error = message;
                                $scope.$apply();
                            },

                            onSuccess: function (r) {
                                $scope.listTopTarget = [];
                                $(r.Items).each(function (i, x) {
                                    if (x.User.Id === sessionService.data().user.User.Id) {
                                        return;
                                    }

                                    $scope.listTopTarget.push({
                                        id: x.User.Id,
                                        name: x.User.Name,
                                        avatar: x.User.AvatarPhoto,
                                        unreadMessage: 0
                                    });
                                });

                                if (!$scope.targetUserId && $scope.listTopTarget[0]) {
                                    $scope.targetUserId = $scope.listTopTarget[0].id;
                                }

                                $scope.status = "loaded";
                                $scope.$apply();
                            }
                        });

                        webService.call({
                            name: "User_GetListUserMessageGroup",
                            data: {
                                actionUserId: sessionService.userId(),
                                userId: sessionService.userId(),
                                pageIndex: 0,
                                pageSize: $scope.numberOfConversation,
                                rejectUserId: $scope.starId,
                                scheduleId: -1,
                                key: sessionService.key()
                            },

                            onError: function (errorCode, message) {
                                $scope.status = "error";
                                $scope.error = message;
                                $scope.$apply();
                            },

                            onSuccess: function (r) {

                                $scope.listTarget = [];
                                $(r.Items).each(function (i, x) {
                                    var target;
                                    if (x.FromUser.Id !== sessionService.userId()) {
                                        target = x.FromUser;
                                    } else {
                                        target = x.ToUser;
                                    }

                                    if (target.Id === sessionService.data().user.User.Id) {
                                        return;
                                    }

                                    $scope.listTarget.push({
                                        id: target.Id,
                                        name: target.Name,
                                        avatar: target.AvatarPhoto,
                                        unreadMessage: 0
                                    });
                                });

                                if (!$scope.targetUserId && $scope.listTarget[0]) {
                                    $scope.targetUserId = $scope.listTarget[0].id;
                                }

                                $scope.status = "loaded";
                                $scope.$apply();
                            }
                        });
                    });
                }
            };

            this.scrollToBottom = function () {
                var $list = $element.find(".list-message");
                $list.scrollTop($list[0].scrollHeight);
            };

            this.addTarget = function (userId, name, avatar) {
                var index = -1;

                $($scope.listTopTarget).each(function (i, x) {
                    if (x.id === userId) {
                        index = i;
                        return false;
                    }
                });

                if (index === -1) {
                    $($scope.listTarget).each(function (i, x) {
                        if (x.id === userId) {
                            index = i;
                            return false;
                        }
                    });
                }

                if (index === -1) {
                    $scope.listTarget.splice(0, 0, {
                        id: userId,
                        name: name,
                        avatar: avatar,
                        unreadMessage: 0
                    });
                }

                $scope.targetUserId = userId;
            };

            this.addMessage = function (message, date, user) {
                message = helperService.formatMessage(message);

                $scope.listMessage.push({
                    message: message,
                    date: date,
                    user: user
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            //#endregion

            //#region [Event]

            $scope.$on("signalrOnPrivateMessage", function (event, user, message) {
                if (user.id !== $scope.targetUserId) {
                    var done = false;

                    $($scope.listTopTarget).each(function (i, x) {
                        if (x.id === user.id) {
                            x.unreadMessage += 1;
                            done = true;
                            return false;
                        }
                    });

                    if (!done) {
                        $($scope.listTarget).each(function (i, x) {
                            if (x.id === user.id) {
                                x.unreadMessage += 1;
                                return false;
                            }
                        });
                    }

                    return;
                }

                $scope._ctrl.addMessage(
                    message.content,
                    message.date,
                    {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    });
                if (typeof $scope._ctrl.onNewMessage === "function")
                    $scope._ctrl.onNewMessage(user.id);
            });

            $scope.onTextKeyPress = function ($event) {
                if ($event.keyCode === 13 && $event.shiftKey === false) {
                    $event.preventDefault();
                    $scope.onSendMessage({
                        target: $($event.target).closest("form")
                    });
                }
            };

            $scope.onTargetSelect = function (id) {
                $scope.targetUserId = id;

                var done = false;

                $($scope.listTopTarget).each(function (i, x) {
                    if (x.id === id) {
                        x.unreadMessage = 0;
                        done = true;
                        return false;
                    }
                });

                if (!done) {
                    $($scope.listTarget).each(function (i, x) {
                        if (x.id === id) {
                            x.unreadMessage = 0;
                            return false;
                        }
                    });
                }
            };

            $scope.onTargetSelected = function (newValue, oldValue) {
                if (!newValue) {
                    $scope.listStatus = "warning";
                    $scope.listError = "Bạn chưa chọn đối tượng để trò chuyện";
                } else {
                    $scope.listStatus = "loading";
                    webService.call({
                        name: "User_GetUserMessageGroupByUserId",
                        data: {
                            actionUserId: sessionService.userId(),
                            userId: $scope.targetUserId,
                            key: sessionService.key()
                        },

                        onError: function (errorCode, message) {
                            $scope.listStatus = "error";
                            $scope.listError = message;
                            $scope.$apply();
                        },

                        onSuccess: function (gr) {
                            $scope.messagePageIndex = 0;
                            $scope.messagePageCount = 0;
                            $scope.messageGroupId = gr.Result ? gr.Result.Id : undefined;
                            $scope.listMessage = [];

                            if ($scope.messageGroupId) {
                                webService.call({
                                    name: "User_GetListMessage",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        userGroupMessageId: $scope.messageGroupId,
                                        pageIndex: $scope.messagePageIndex,
                                        pageSize: 10,
                                        key: sessionService.key()
                                    },

                                    onError: function (errorCode, message) {
                                        $scope.listStatus = "error";
                                        $scope.listError = message;
                                        $scope.$apply();
                                    },

                                    onSuccess: function (r) {
                                        $scope.messagePageCount = r.PageCount;
                                        $scope.listMessage = [];
                                        if (r.Items.length >= 0) {
                                            for (var i = r.Items.length - 1; i >= 0; i--) {
                                                var x = r.Items[i];

                                                $scope._ctrl.addMessage(
                                                    x.Message.Content,
                                                    x.Message.CreateDate,
                                                    {
                                                        id: x.User.Id,
                                                        name: x.User.Name,
                                                        avatar: x.User.AvatarPhoto
                                                    });
                                            }
                                        }

                                        $scope.listStatus = "loaded";
                                        $scope.$apply();

                                        $scope._ctrl.scrollToBottom();
                                    }
                                });
                            } else {
                                $scope.listStatus = "loaded";
                                $scope.$apply();
                            }
                        }
                    });
                }
            };

            $scope.onSendMessage = function ($event) {
                var $target = $($event.target);
                var $button = $target.find("[type=submit]");

                if ($scope.helper.isLoading($button))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                if (!$scope.targetUserId) {
                    Notification.warning({ message: 'Bạn chưa chọn đối tượng để trò chuyện !', delay: 3000, positionY: 'bottom', positionX: 'right' });
                    return;
                }
                if (!$target.find("textarea.message-text").val()) {
                    Notification.warning({ message: 'Bạn chưa nhập tin nhắn !', delay: 3000, positionY: 'bottom', positionX: 'right' });
                    return;
                }
                webService.call({
                    type: "POST",
                    name: "User_SentMessage",
                    data: {
                        actionUserId: sessionService.userId(),
                        toUserId: $scope.targetUserId,
                        content: $element.find("textarea.message-text").val(),
                        key: sessionService.key()
                    },

                    displayError: true,

                    onSuccess: function (r) {
                        $element.find("textarea.message-text").val("");
                        $scope._ctrl.addMessage(
                            r.Result.Content,
                            r.Result.CreateDate,
                            {
                                id: sessionService.data().user.User.Id,
                                name: sessionService.data().user.User.Name,
                                avatar: sessionService.data().user.User.AvatarPhoto
                            });
                    }
                });
            };

            $scope.onLoadMore = function ($event) {
                $scope.messagePageIndex += 1;

                webService.call({
                    name: "User_GetListMessage",
                    data: {
                        actionUserId: sessionService.userId(),
                        userGroupMessageId: $scope.messageGroupId,
                        pageIndex: $scope.messagePageIndex,
                        pageSize: 10,
                        key: sessionService.key()
                    },

                    onError: function (errorCode, message) {
                        $scope.listStatus = "error";
                        $scope.listError = message;
                        $scope.$apply();
                    },

                    onSuccess: function (r) {
                        for (var i = r.Items.length - 1; i >= 0; i--) {
                            var x = r.Items[i];

                            $scope.listMessage.unshift({
                                message: helperService.formatMessage(x.Message.Content),
                                date: x.Message.CreateDate,
                                user: {
                                    id: x.User.Id,
                                    name: x.User.Name,
                                    avatar: x.User.AvatarPhoto
                                }
                            });
                        }
                        $scope.$apply();
                    }
                });
            };

            //#endregion

            // #region [Callback]

            // onNewMessage(userId)

            // #endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: {
                numberOfConversation: "@"
            },
            templateUrl: "/Views/UserControl/ucPrivateMessage.html",
            controller: controller
        };
    }
]);