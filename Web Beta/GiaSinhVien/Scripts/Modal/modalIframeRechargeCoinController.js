teenidolApp.controller("modalIframeRechargeCoinController", ["$scope", "$uibModalInstance","sessionService",
    function ($scope, $uibModalInstance, sessionService) {
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

        sessionService.isReady(function() {           
            //$(function () { $('.modal-show-iframe-recharge-coin').draggable({ handle: ".modal-header" }).resizable(); });
        });
        //#endregion
    }
])