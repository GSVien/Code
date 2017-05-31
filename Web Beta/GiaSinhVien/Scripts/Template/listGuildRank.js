teenidolApp.directive("listGuildRank", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ListGuildRank.html",
            scope: {
                link: "@",
                linkNewTab: "@",
                avatar: "@",
                teamName:"@",
                name: "@",
                namePosition: "@",
                vipName: "@",
                vipPhoto: "@",
                vipColor: "@",
                levelName: "@",
                levelPhoto: "@",
                nextLevelPointNeed: "@",
                display: "@",
                coin: "=",
                indexValue:"=",
                onClick: "&"
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "helperService",
                function ($scope, helperService) {
                    //#region [Field]
                    $scope.helper = helperService;
                    
                    //#endregion

                    //#region [Event]

                    //#endregion
                }
            ]
        };
    }
]);