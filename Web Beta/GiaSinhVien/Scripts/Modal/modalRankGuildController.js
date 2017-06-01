giasinhvienApp.controller("modalRankGuildController", [
    "$scope", "$routeParams", "$log", "sessionService", "webService", "helperService", "Notification", "modalService","$uibModalInstance",
    function ($scope, $routeParams, $log, sessionService, webService, helperService, Notification, modalService, $uibModalInstance) {
        $scope.ListguildRank = {
            status: "loading",
            Items1: undefined,
            Items2: undefined,
            Items3: undefined,
            Items4: undefined,
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onUserKickOutUser = function (id) {
            webService.call({
                name: "User_KickOutUser",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                    notificationService.screenNotification.error("Có lỗi xin thử lại");
                },
                onSuccess: function (r) {
                    notificationService.screenNotification.success("Bạn đã rời khỏi gia tộc");
                    $scope.ListUserInGuild.remove(id);

                }
            });
        }
        sessionService.isReady(function () {
            webService.call({
                name: "User_GetListGuild",
                type:"POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 200,
                    nameGuild: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListguildRank.message = msg;
                    $scope.ListguildRank.status = "error";
                },
                onSuccess: function (r) {
                    $scope.Total = r.Total;
                    $scope.ListguildRank.status = "loaded";
                    $scope.ListguildRank.Items1 = r.Items[0];
                    $scope.ListguildRank.Items2 = r.Items[1];
                    $scope.ListguildRank.Items3 = r.Items[2];
                    $scope.ListguildRank.Items4 = r.Items.slice(3, 100);
                    if (!$scope.$$phase) $scope.$apply();

                }
            });
        });
    }])