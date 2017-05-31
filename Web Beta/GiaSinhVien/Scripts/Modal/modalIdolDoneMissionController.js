teenidolApp.controller("modalIdolDoneMissionController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification) {
        $scope.sessionService = sessionService;
        $scope.RewardIdol= {
            Items: undefined,
            status:"loading",
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onUserDoneIdolQuest = function () {
            webService.call({
                name: "User_DoneIdolQuest",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    scheduleId: data.scheduleId,
                    key: sessionService.key(),
                },
                onError: function (error, msg) {
                    Notification.error(error);
                },
                onSuccess: function (rs) {
                    Notification.success('Nhận thưởng thành công');
                    $scope.onClose();
                },
            });
        };

        sessionService.isReady(function () {
            webService.call({
                name: "User_GetRewardInfo",
                type: "GET",
                data: {
                    actionUserId: sessionService.userId(),
                    starId: data.starId,
                    key: sessionService.key(),
                },
                onError: function (error, msg) {
                    Notification.error(error);
                },
                onSuccess: function (rs) {
                    $scope.RewardIdol.Items = rs.Result;
                },
            });
        });
    }
]);