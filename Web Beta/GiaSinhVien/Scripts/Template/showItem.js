teenidolApp.directive("showItem", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ShowItem.html",
            scope: {
                link: "@",
                photo: "@",
                phone: "=",
                name: "@",
                levelName: "@",
                levelPhoto: "@",
                startTime: "=",
                isLive: "=",
                view: "=",
                issample: "=",
                persamper: "="
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "helperService",
                function ($scope, helperService) {
                    //#region [Field]

                    $scope.helper = helperService;
                   // $scope.moment = moment;
                    //#endregion

                    //#region [Event]
                    if ($scope.startTime) {
                        var now = new Date();
                        $scope.s = $scope.startTime - 7 * 60 * 60 * 1000;
                        $scope.startTime = new Date($scope.s);
                        if (now.getFullYear() === $scope.startTime.getFullYear() && now.getMonth() === $scope.startTime.getMonth() && now.getDate() === $scope.startTime.getDate()) {
                            $scope.startTimeType = "time";
                        } else {
                            $scope.startTimeType = "date";
                        }
                    }
                    //#endregion
                }
            ]
        };
    }
]);