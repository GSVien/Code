teenidolApp.controller("modalGoldMineController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService","Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService,Notification) {
        $scope.UserGuildInfo = {
            Items: undefined,
    }
 

        $scope.showInfoTower = function () {
            webService.call({
                name: "Guild_GetTowers",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    modalService.showInfoTower({
                        data: rs.Result[1],
                    });
                },

            });
        }

        $scope.onReceiveBonusCoin=function() {
            webService.call({
                name: "User_ReceiveBonusCoin",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    Notification.success('Nhận thành công');
                    $uibModalInstance.dismiss();
                },

            });
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        sessionService.isReady(function () {
            webService.call({
                name: "User_GetUserGuildInfo",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId:sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    console.log(rs);
                    $scope.UserGuildInfo.Items = rs.Result;
                    if(!$scope.$$phase)$scope.$apply;
                },

            });
        });
    }
]);