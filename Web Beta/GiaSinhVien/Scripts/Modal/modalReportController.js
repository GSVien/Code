teenidolApp.controller("modalReportController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification", "data", "authenticationService",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification, data, authenticationService) {
        //#region [Field]

        $scope.Content = {
            Photo: undefined,
            Description: undefined,
            isBusy: false,
        }

        html2canvas(document.body, {
            onrendered: function (canvas) {
                $scope.Content.Photo = canvas.toDataURL();
            },
        });
        //#endregion

        //#region [Event]
        $scope.onUserReportIdol = function () {
            if (!sessionService.isSigned()) {
                authenticationService.showModal({
                    mode: "sign-in",
                    message: "Bạn cần đăng nhập để sử dụng tính năng này"
                });
                return;
            }
            if (!$scope.Content.Photo) {
                Notification.error('Bạn chưa chọn hình upload');
                return;
            }
            if (!$scope.Content.Description) {
                Notification.error('Bạn chưa mô tả thông tin báo xấu');
                return;
            }
            var base64Photo = $scope.Content.Photo.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

            webService.call({
                type: "POST",
                name: "User_ReportIdol",
                data: {
                    actionUserId: sessionService.userId(),
                    base64Photo: base64Photo,
                    starId: data.data.starId,
                    note: $scope.Content.Description,
                    platform: 1,
                    key: sessionService.key(),
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success(r.Message);
                    $scope.onClose();
                    $scope.Content = {
                        Photo: undefined,
                        Description: undefined,
                        isBusy: false,
                    }
                },
            });

        };
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        //#endregion
    }
])