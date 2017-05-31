teenidolApp.controller("modalDetailGuildController", ["$scope","$rootScope", "$uibModalInstance", "sessionService", "webService", "data", "Notification",
    function ($scope,$rootScope, $uibModalInstance, sessionService, webService, data, Notification) {
        //#region [Field]
        $scope.openingShow = {
            status: "loading",
            error: undefined
        };
        $scope.ListUserInGuild = {
            Items: undefined,
            Items1: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: false,
            isBusy: false,
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $rootScope.$broadcast("onCloseDetailGuild");
            $uibModalInstance.dismiss();
        };
        $scope.onGetListUserInGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserInGuild.pageIndex = $scope.ListUserInGuild.pageIndex + 1;
            }
            webService.call({
                name: "User_GetListUserInGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserInGuild.pageIndex,
                    pageSize: $scope.ListUserInGuild.pageSize,
                    guildId: data.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserInGuild.message = msg;
                    $scope.ListUserInGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserInGuild.Items) {
                        $scope.ListUserInGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserInGuild.Items = r.Items;
                    }
                    $scope.ListUserInGuild.status = "loaded";
                    $scope.ListUserInGuild.nextList = r.PageIndex + 1 === r.PageCount;
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
            webService.call({
                name: "User_GetGuildInfo",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: data.Id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                },
                onSuccess: function (r) {
                    $scope.ListUserInGuild.Items1 = r.Result;
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }
        $scope.onUserSendRequestJoinGuild = function () {
            webService.call({
                name: "User_SendRequestJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: data.Id,
                    userId: sessionService.userId(),
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (error, msg) {
                    $scope.ListUserInGuild.isBusy = false;
                },
                onSuccess: function (r) {
                    Notification.success('Yêu cầu vào gia tộc đã được gửi đi.');
                    $scope.ListUserInGuild.isBusy = false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        }
        $scope.onWhatDetailUser = function (data) {
            window.open("/user/" + data, '_blank');
        }
        sessionService.isReady(function () {
            $scope.onGetListUserInGuild();
        });
        //#endregion
    }
])