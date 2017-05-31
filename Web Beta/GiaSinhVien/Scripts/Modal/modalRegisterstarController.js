teenidolApp.controller("modalRegisterstarController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification) {
        //#region [Field]
        $scope.register = {
            email: undefined,
            name: undefined,
            phone: undefined,
            youtube: undefined,
            facebook: undefined,
            talent: undefined,
            isBusy: false
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onRegisterStar = function ($event) {
            $scope.register.isBusy = true;
            if (!$scope.register.name || !$scope.register.phone || !$scope.register.email) {
                if (!$scope.register.email) {
                    Notification.error("Bạn chưa nhập email");
                }
                if (!$scope.register.name) {
                    Notification.error("Bạn chưa nhập tên");
                }
                if (!$scope.register.phone) {
                    Notification.error("Bạn chưa nhập số điện thoại");
                }
                return;
            }
            webService.call({
                type: "POST",
                name: "Star_RegisterStar",
                data: {
                    actionUserId: sessionService.userId(),
                    name: $scope.register.name,
                    phone: $scope.register.phone,
                    email: $scope.register.email,
                    facebookLink: $scope.register.facebook,
                    youtubeLink: $scope.register.youtube,
                    talenDescription: $scope.register.talent,
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (msg) {
                    $scope.register.isBusy = false;
                    return;
                },
                onSuccess: function (r) {
                    Notification.success('Cảm ơn ban đã đăng ký làm idol . Teenidol sẽ liên lạc với bạn sớm nhất !');
                    $uibModalInstance.dismiss();
                    $scope.register.isBusy = false;
                }
            });
        };
        //#endregion
    }
])