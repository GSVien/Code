giasinhvienApp.controller("modalShowOpeningController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification){
        //#region [Field]
        $scope.openingShow = {
            status: "loading",
            error: undefined
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        $scope.onLoadShowOpening = function () {
            var now = new Date();
            var start = now.setHours(0, 0, 0, 0);
            var end = now.setHours(23, 59, 59, 999);

            webService.call({
                name: "ShowSchedule_GetListShowByStatus",
                data: {
                    actionUserId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 999999,
                    scheduleStatus: 2,
                    startTime: start,
                    endTime: end,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.openingShow.status = "error";
                    $scope.openingShow.error = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.openingShow.listItem = [];
                    $(r.Items).each(function (i, x) {
                        if (x.ListShow[0].StarUser.Id === sessionService.userId()) {
                            return;
                        }
                        $scope.openingShow.listItem.push(x);
                    });
                    $scope.openingShow.status = "loaded";
                    $scope.$apply();
                }
            });
        };
        sessionService.isReady(function () {
            $scope.onLoadShowOpening();
        })
        //#endregion
    }
])