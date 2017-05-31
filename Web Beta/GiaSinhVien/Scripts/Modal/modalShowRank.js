teenidolApp.controller("modalShowRankController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService",
    function ($scope, $uibModalInstance, data, sessionService, webService) {
        //#region [Field]

        $scope.showRank = {
            currentStatus: "loading",
            currentError: undefined,
            listCurrent: undefined,

            allStatus: "loading",
            allError: undefined,
            listAll: undefined
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        if (data) {
            webService.call({
                name: "User_GetListTopUserUseCoinInShow",
                data: {
                    actionUserId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 10,
                    scheduleId: data.data.scheduleId,
                    showId: data.data.showId,
                    starId: data.data.starId,
                    startDate: -1,
                    endDate: -1,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showRank.currentStatus = "error";
                    $scope.showRank.currentError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.showRank.listCurrent = r.Items;
                    $scope.showRank.currentStatus = "loaded";
                    $scope.$apply();
                }
            });

            webService.call({
                name: "User_GetListTopUserUseCoinInShow",
                data: {
                    actionUserId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 10,
                    scheduleId: -1,
                    showId: data.data.showId,
                    starId: data.data.starId,
                    startDate: -1,
                    endDate: -1,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showRank.allStatus = "error";
                    $scope.showRank.allError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    console.log(r);
                    $scope.showRank.listAll = r.Items;
                    $scope.showRank.allStatus = "loaded";
                    $scope.$apply();
                }
            });
        }

        //#endregion
    }
])