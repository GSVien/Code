giasinhvienApp.controller("modalTakingMissionController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification", "$rootScope",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification, $rootScope) {
        $scope.level = {
            Items: undefined,
            level: 0,
            numberlevel: undefined,
            checked: -1,
            countQuestInDay: undefined,
            maxQuestInDay: undefined,
        }

        $scope.getNumber = function (num) {
            return new Array(num);
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        //event 
        webService.call({
            name: "User_CheckIdolQuest",
            type: "GET",
            data: {
                actionUserId: sessionService.userId(),
                starId: data.starId,
                key: sessionService.key(),
            },
            onError: function(error, msg) {
            },
            onSuccess: function(rs) {
                $scope.level.countQuestInDay = rs.Result.countQuestInDay;
                $scope.level.maxQuestInDay = rs.Result.maxQuestInDay;
            }
        });
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
                $scope.level.numberlevel = number;
                $scope.level.Items = res;
                if (!$scope.$$phase) $scope.$apply();
            },
        });
        //end event

        $scope.onIdolGetQuest = function () {
            if ($scope.level.level == 0) {
                Notification.error('Bạn vui lòng chọn cấp độ nhiệm vụ');
                return;
            }
            webService.call({
                name: "User_IdolGetQuest",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    scheduleId: data.scheduleId,
                    level: $scope.level.level,
                    key: sessionService.key(),
                },
                onError: function (error, msg) {
                    Notification.error("Bạn đã hết số lần nhận nhiệm vụ");
                    $scope.onClose();
                },
                onSuccess: function (rs) {
                    var nhannhiemvu = rs.Result;
                    //$rootScope.$broadcast("onDoneMissionIdol", {
                    //    nhannhiemvu: nhannhiemvu,
                    //});
                    Notification.success("Nhận nhiệm vụ thành công");
                    $scope.onClose();
                    if (!$scope.$$phase) $scope.$apply();
                },
            });

        },
            $scope.editlevelmission = function (level) {
                $scope.level.level = level + 1;
                $scope.level.checked = level;

            };

        sessionService.isReady(function () {
           
        });
    }
]);