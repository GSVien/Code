teenidolApp.controller("modalListUserJoinController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification", "$rootScope",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification, $rootScope) {
        //#region [Field]
        $scope.sessionService = sessionService;
        $scope.ListUserJoinGuild = {
            Items: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: false,
        };
        $scope.ListUserJoinGuild.remove = function (userId) {
            $($scope.ListUserJoinGuild.Items).each(function (i, x) {
                if (x.User.Id === userId) {
                    $scope.ListUserJoinGuild.Items.splice(i, 1);
                    return false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };

        //#endregion

        //#region [Event]

        $scope.onGetListUserJoinGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserJoinGuild.pageIndex = $scope.ListUserJoinGuild.pageIndex + 1;
            }
            webService.call({
                name: "User_GetListUserJoinGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserJoinGuild.pageIndex,
                    pageSize: $scope.ListUserJoinGuild.pageSize,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserJoinGuild.message = msg;
                    $scope.ListUserJoinGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserJoinGuild.Items) {
                        $scope.ListUserJoinGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserJoinGuild.Items = r.Items;
                    }

                    $scope.ListUserJoinGuild.nextList = r.PageIndex === r.PageCount;
                    $scope.ListUserJoinGuild.status = "loaded";
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }

        $scope.onAcceptUserJoinGuild = function (id) {
            webService.call({
                name: "User_AcceptUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (error, msg) {
                    if (error == 5 || error == 6) {
                        Notification.error(msg);
                    } else {
                        Notification.error(msg);
                        $scope.ListUserJoinGuild.remove(id);
                    }
                },
                onSuccess: function (r) {
                    Notification.success("Chấp nhận user vào gia tộc thành công");
                    $scope.ListUserJoinGuild.remove(id);
                }
            });
        }

        $scope.onDeclineUserJoinGuild = function (id) {
            webService.call({
                name: "User_DeclineUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                    Notification.error("Có lỗi xin thử lại");
                },
                onSuccess: function (r) {
                    Notification.success("Không chấp nhận thành công");
                    $scope.ListUserJoinGuild.remove(id);

                }
            });
        }
        sessionService.isReady(function () {
            $scope.onGetListUserJoinGuild();
        });
        //#endregion
    }
]);