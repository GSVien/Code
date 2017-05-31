teenidolApp.controller("modalDayCheckController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "authenticationService","Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, authenticationService, Notification) {
        //#region [Field]
        $scope.listDayCheck = {
            Items: undefined,
            PageCount:undefined,
            status: "loading",
        }
        $scope.countDayCheck = {
            Length: undefined,
            status: "loading",
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        webService.call({
            name: "User_GetListDaySignIn",
            data: {
                actionUserId: sessionService.userId(),
                pageIndex: 0,
                pageSize: 5,
                key: sessionService.key(),
            },
            onSuccess: function (r) {
                $scope.listDayCheck.PageCount = r.PageCount;
                $scope.listDayCheck.Items = r.Items;
            }
        });

        webService.call({
            name: "User_GetUserDaySignInReward",
            data: {
                actionUserId: sessionService.userId(),
                key: sessionService.key(),
            },
            onSuccess: function (r) {
                if (r.Result != null) {
                    $scope.countDayCheck.Length = r.Result.SignInContinuesCount;
                } else {
                    $scope.countDayCheck.Length = 0;
                }
            }
        });

        $scope.DoDaySignIn = function ($event) {
            webService.call({
                type: "POST",
                name: "User_DoDaySignIn",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key(),
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success("Bạn Báo Danh Thành Công !");
                    $scope.countDayCheck.Length = r.Result.User_DaySignInReward.SignInContinuesCount;
                }
            });
        };

        //#endregion
    }
])