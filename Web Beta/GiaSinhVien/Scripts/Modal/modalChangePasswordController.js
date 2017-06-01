giasinhvienApp.controller("modalChangePasswordController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "authenticationService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, authenticationService, Notification) {
        //#region [Field]
        $scope.changePassword = {
            oldpass: undefined,
            repass: undefined,
            newrepass: undefined,
            isBusy: false,
        }

        $scope.UpdateNewPassWord = function () {
            $scope.changePassword.isBusy = true;
            if ($scope.changePassword.repass != $scope.changePassword.newrepass) {
                Notification.error("Nhập lại mật khẩu không đúng");
                $scope.changePassword.isBusy = false;
                return;
            }
            webService.call({
                type: "POST",
                name: "User_UpdateNewPassWord",
                data: {
                    actionUserId: sessionService.userId(),
                    oldPass: $scope.changePassword.oldpass,
                    newPass: $scope.changePassword.repass,
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (code, msg) {
                    $scope.changePassword.isBusy = false;
                },
                onSuccess: function (r) {
                    Notification.success("Đổi Mật Khẩu Thành Công !");
                    $scope.changePassword.isBusy = false;
                    $scope.changePassword.oldpass = "";
                    $scope.changePassword.repass = "";
                    $uibModalInstance.dismiss();
                    $scope.$apply();
                }
            });
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        //#endregion
    }
]);