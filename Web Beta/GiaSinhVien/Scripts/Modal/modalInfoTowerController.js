giasinhvienApp.controller("modalInfoTowerController", [
    "$scope", "sessionService", "webService", "helperService", "Notification", "modalService", "$uibModalInstance", "data",
    function ($scope, sessionService, webService, helperService, Notification, modalService, $uibModalInstance, data) {
        $scope.isShowButton = {
            status: "loading",
            isBusy: false,
        };
        $scope.amount = {
                Items:undefined,
            },

        $scope.listMoney = [
            {
                value: 10,
            },
            {
                value: 50,
            },
            {
                value: 100,
            },
            {
                value: 150,
            },
            {
                value: 200,
            },
            {
                value: 300,
            },
            {
                value: 500,
            },
            {
                value: 1000,
            },
        ];

        $scope.isShow = function () {
            $scope.isShowButton.isBusy = true;
        };

        if (data.data) {
            $scope.infoTower = data.data;
            if ($scope.infoTower.BankAccount.Balance > 0 && $scope.infoTower.NextLevel) {
                $scope.phantram = ($scope.infoTower.BankAccount.Balance / $scope.infoTower.NextLevel.Coin) * 100;
            } else {
                $scope.phantram = 0;
            }
        }

        $scope.onDonateTower = function () {
            if (!$scope.amount.Items) {
                Notification.error('Bạn chưa chọn tiền cống hiến !');
                return;
            }
            webService.call({
                name: "User_DonateTower",
                type:"POST",
                data: {
                    actionUserId: sessionService.userId(),
                    towerId: $scope.infoTower.Tower.Id,
                    guildId: sessionService.data().user.Guild.Id,
                    amount: $scope.amount.Items,
                    key:sessionService.key()
                },
                onError: function (error,msg) {
                    Notification.error(msg);
                },
                onSuccess: function (r) {
                    $scope.infoTower = r.Result;
                    Notification.success('Cống hiến thành công');
                    $uibModalInstance.dismiss();
                }
            });
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

    }
]);