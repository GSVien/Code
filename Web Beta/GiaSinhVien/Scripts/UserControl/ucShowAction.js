giasinhvienApp.directive("ucShowAction", [
    "webService", "sessionService", "helperService", "formService", "authenticationService", "notificationService", function (webService, sessionService, helperService, formService, authenticationService, notificationService) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;

            $scope.starId = undefined;
            $scope.scheduleId = undefined;
            $scope.newActionName = undefined;
            $scope.newActionCoin = 100;

            $scope.starActionStatus = "loading";
            $scope.starActionError = undefined;
            $scope.listStarAction = [];

            $scope.userActionStatus = "loading";
            $scope.userActionError = undefined;
            $scope.listUserAction = [];

            //#endregion

            //#region [Method]

            this.loadStarAction = function (starId, scheduleId) {
                $scope.starId = starId;
                $scope.scheduleId = scheduleId;
                $scope._ctrl.refreshStarAction();
            };

            this.refreshStarAction = function () {
                webService.call({
                    name: "Show_GetListRepertoireOfStar",
                    data: {
                        actionUserId: sessionService.userId(),
                        starId: $scope.starId,
                        pageIndex: 0,
                        pageSize: 999999,
                        key: sessionService.key()
                    },

                    onError: function (errorCode, message) {
                        $scope.starActionStatus = "error";
                        $scope.starActionError = message;
                        $scope.$apply();
                    },

                    onSuccess: function (r) {
                        $scope.listStarAction = r.Items;
                        $scope.starActionStatus = "loaded";
                        $scope.$apply();
                    }
                });
            };

            this.addStarAction = function (id, name, coin, totalVote) {
                $scope.listUserAction.push({
                    Repertoire: {
                        Id: id,
                        Name: name,
                        Price: coin,
                        TotalVote: totalVote
                    }
                });
                $scope.$apply();
            };

            this.loadUserAction = function (starId, scheduleId) {
                $scope.scheduleId = scheduleId;
                $scope._ctrl.refreshUserAction();
            };

            this.refreshUserAction = function () {
                webService.call({
                    name: "Show_GetListWishList",
                    data: {
                        actionUserId: sessionService.userId(),
                        scheduleId: $scope.scheduleId,
                        pageIndex: 0,
                        pageSize: 999999,
                        minPrice: 0,
                        key: sessionService.key()
                    },

                    onError: function (errorCode, message) {
                        $scope.userActionStatus = "error";
                        $scope.userActionError = message;
                        $scope.$apply();
                    },

                    onSuccess: function (r) {
                        $scope.listUserAction = r.Items;
                        $scope.userActionStatus = "loaded";
                        $scope.$apply();
                    }
                });
            };

            this.addUserAction = function (id, name, coin, userId, userName) {
                $scope.listUserAction.push({
                    WishList: {
                        Id: id,
                        Content: name,
                        CurrentPrice: coin
                    },
                    FromUserId: {
                        Id: userId,
                        Name: userName
                    }
                });
                $scope.$apply();
            };

            //#endregion

            //#region [Callback]

            // onAfterVoteStarAction(starAction)

            // onAfterCheckStarAction(starAction)

            // onAfterDeleteStarAction(starAction)
            
            // onAfterCheckUserAction(userAction)

            // onAfterPostUserAction(userAction)

            //#endregion

            //#region [Event]

            $scope.onVoteStarAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".star-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItem = $scope.listStarAction[$actionItem.data("index")];

                $target.button("loading");
                webService.call({
                    type: "POST",
                    name: "Repertoire_Vote",
                    data: {
                        actionUserId: sessionService.userId(),
                        repertoiseId: actionItem.Repertoire.Id,
                        scheduleId: $scope.scheduleId,
                        key: sessionService.key()
                    },
                    displayError: true,
                    onError: function (errorCode, message) {
                        $target.button("reset");
                    },
                    onSuccess: function (r) {
                        $target.button("reset");
                        actionItem.Repertoire.TotalVote = r.Result.TotalVote;
                        $scope.$apply();

                        if (typeof $scope._ctrl.onAfterVoteStarAction === "function")
                            $scope._ctrl.onAfterVoteStarAction({
                                id: r.Result.Id,
                                name: r.Result.Name,
                                coin: r.Result.Price,
                                voteTotal: r.Result.TotalVote
                            });
                    }
                });
            };

            $scope.onCheckStarAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".star-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItem = $scope.listStarAction[$actionItem.data("index")];

                notificationService.showAlert({
                    title: "Hoàn thành tiết mục",
                    body: "Bạn đã hoàn tất tiết mục?",
                    buttons: [
                        { text: "Không", type: "close" },
                        {
                            text: "Có",
                            type: "close",
                            onClick: function () {
                                $target.button("loading");
                                webService.call({
                                    type: "POST",
                                    name: "Star_ResetVote",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        repertoiseId: actionItem.Repertoire.Id,
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onError: function (errorCode, message) {
                                        $target.button("reset");
                                    },
                                    onSuccess: function (r) {
                                        $target.button("reset");
                                        actionItem.Repertoire.TotalVote = r.Result.TotalVote;
                                        $scope.$apply();

                                        if (typeof $scope._ctrl.onAfterVoteStarAction === "function")
                                            $scope._ctrl.onAfterResetStarAction({
                                                id: r.Result.Id,
                                                name: r.Result.Name,
                                                coin: r.Result.Price,
                                                voteTotal: r.Result.TotalVote
                                            });
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onDeleteStarAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".star-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItemIndex = $actionItem.data("index");
                var actionItem = $scope.listStarAction[actionItemIndex];

                notificationService.showAlert({
                    title: "Xóa yêu cầu",
                    body: "Bạn muốn xóa tiết mục này",
                    buttons: [
                        { text: "Không", type: "close" },
                        {
                            text: "Có",
                            type: "close",
                            onClick: function () {
                                $target.button("loading");
                                webService.call({
                                    type: "POST",
                                    name: "Star_DeleteRepertorise",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        repertoiseId: actionItem.Repertoire.Id,
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onError: function (errorCode, message) {
                                        $target.button("reset");
                                    },
                                    onSuccess: function (r) {
                                        $target.button("reset");
                                        $scope.listStarAction.splice(actionItemIndex, 1);
                                        $scope.$apply();

                                        if (typeof $scope._ctrl.onAfterDeleteStarAction === "function")
                                            $scope._ctrl.onAfterDeleteStarAction({
                                                id: r.Result.Id,
                                                name: r.Result.Name,
                                                coin: r.Result.Price,
                                                voteTotal: r.Result.TotalVote
                                            });
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onCheckUserAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".user-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItemIndex = $actionItem.data("index");
                var actionItem = $scope.listUserAction[actionItemIndex];

                notificationService.showAlert({
                    title: "Hoàn thành yêu cầu",
                    body: "Bạn đã hoàn thành yêu cầu này?",
                    buttons: [
                        { text: "Không", type: "close" },
                        {
                            text: "Có",
                            type: "close",
                            onClick: function () {
                                $target.button("loading");
                                webService.call({
                                    type: "POST",
                                    name: "Star_DeleteRepertorise",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        repertoiseId: actionItem.Repertoire.Id,
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onError: function (errorCode, message) {
                                        $target.button("reset");
                                    },
                                    onSuccess: function (r) {
                                        $target.button("reset");
                                        $scope.listUserAction.splice(actionItemIndex, 1);
                                        $scope.$apply();

                                        if (typeof $scope._ctrl.onAfterCheckUserAction === "function")
                                            $scope._ctrl.onAfterCheckUserAction({
                                                id: r.Result.WishList.Id,
                                                name: r.Result.WishList.Content,
                                                coin: r.Result.WishList.CurrentPrice,
                                                userId: r.Result.FromUserId.Id,
                                                userName: r.Result.FromUserId.Name
                                            });
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onPostNewAction = function ($event) {
                var $target = $($event.target);
                var $button = $target.find("[type=submit]");

                if (formService.isLoading($button))
                    return;

                $scope.newActionCoin = $scope.newActionCoin * 1;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                if (!formService.validate(
                        {
                    target: $button,
                    rule: [
                                {
                    check: function () {
                                        return isNoUoW($scope.newActionName) === false;
                },
                    message: "Bạn chưa nhập tên tiết mục."
                }
                ]
                }
                    )
                ) {
                    return;
                };

                $button.button("loading");
                webService.call({
                    type: "POST",
                    name: "User_UserRequestWishList",
                    data: {
                        actionUserId: sessionService.userId(),
                        scheduleId: $scope.scheduleId,
                        starId: $scope.starId,
                        coin: $scope.newActionCoin,
                        content: $scope.newActionName,
                        isNewVersion: true,
                        key: sessionService.key()
                    },
                    displayError: true,
                    onError: function (errorCode, message) {
                        $button.button("reset");
                    },
                    onSuccess: function (r) {
                        $button.button("reset");
                        $scope.newActionName = undefined;
                        $scope.newActionCoin = 100;
                        $scope.$apply();

                        if (!sessionService.isSigned() || sessionService.userId() !== $scope.starId) {
                            $scope._ctrl.addUserAction(r.Result.WishList.Id, r.Result.WishList.Content, r.Result.WishList.CurrentPrice, r.Result.FromUserId.Id, r.Result.FromUserId.Name);
                            if (typeof $scope._ctrl.onAfterPostUserAction === "function")
                                $scope._ctrl.onAfterPostUserAction({
                                    id: r.Result.WishList.Id,
                                    name: r.Result.WishList.Content,
                                    coin: r.Result.WishList.CurrentPrice,
                                    userId: r.Result.FromUserId.Id,
                                    userName: r.Result.FromUserId.Name
                                });
                        } else {
                            $scope._ctrl.addStarAction(0,0,0,0);
                            if (typeof $scope._ctrl.onAfterPostStarAction === "function")
                                $scope._ctrl.onAfterPostStarAction({
                                    id: 0,
                                    name: 0,
                                    coin: 0,
                                    totalVote: 0
                                });
                        }
                    }
                });
            };

            //#endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "/Views/UserControl/ucShowAction.html",
            controller: controller
        };
    }
]);