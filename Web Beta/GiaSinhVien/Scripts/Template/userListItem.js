giasinhvienApp.directive("userListItem", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/UserListItem.html",
            scope: {
                link: "@",
                linkNewTab: "=",
                userId:"@",
                avatar: "@",
                name: "@",
                vipName: "@",
                vipPhoto: "@",
                vipColor: "@",
                levelName: "@",
                levelPhoto: "@",
                nextLevelPointNeed:"@",
                display: "@",
                nameGuild: "@",
                iconGuild: "@",
                groupId: "@",
                isfollowIdol: "=",
                coin: "=",
                freeCoin: "=",
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