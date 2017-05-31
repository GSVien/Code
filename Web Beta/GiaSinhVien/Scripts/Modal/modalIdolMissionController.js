teenidolApp.controller("modalIdolMissionController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService","Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService,Notification) {
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.level = {
            Items: undefined,
            level: 1,
            numberlevel: undefined,
            checked: 0,
        }
        $scope.showMission= {
            Items: undefined,
            status:"loading",
        }
        console.log(data);
        if (data) {
            $scope.showMission.Items = data;
            $scope.level.numberlevel = data.questInfo.Level - 1;
        }
        webService.call({
            name: "Config_GetConfig",
            type: "GET",
            data: {
                actionUserId: sessionService.userId(),
                value: "IdolQuestMaxLevel",
                key: sessionService.key(),
            },
            onError: function () {

            },
            onSuccess: function (rs) {
                var number = rs.Result.Value * 1;
                var res = [];
                for (var i = 0; i < number; i++) {
                    res.push(i);
                }
                $scope.level.Items = res;
                if (!$scope.$$phase) $scope.$apply();
            },
        });
        sessionService.isReady(function () {

        });
    }
]);