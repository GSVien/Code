teenidolApp.controller("modalAlertController", ["$scope", "$uibModalInstance", "data",
    function ($scope, $uibModalInstance, data) {
        //#region [Field]

        $scope.title = data.title;
        $scope.message = data.message;
        $scope.listButton = data.buttons;

        //#endregion

        //#region [Event]

        $scope.onButtonClick = function (index) {
            var btn = $scope.listButton[index];
            if (typeof btn.onClick === "function")
                btn.onClick();
            if (btn.closeModal)
                $uibModalInstance.close();
        };

        //#endregion
    }
]);