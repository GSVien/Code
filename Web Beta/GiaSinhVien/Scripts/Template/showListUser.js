teenidolApp.directive("showListUser", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ShowListUser.html",
            scope: {
                nextView: "=",
                scheduleId: "=",
                listUser: "=",
                listUserKick: "=",
                listUserAntiChat: "=",
                listUserSetMod: "=",
                decentralizationUser: "=",
                userCount: "=",
                facebookLiveViews: "=",
                onLoadKick: "&",
                onLoadAntiChat: "&",
                onLoadSetMod: "&",
                onNextListUserInShow: "&",
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "signalRService",
                function ($scope, signalrService) {

                    //#region [Helper]
                    var updateCount = function () {
                        if ($scope.scheduleId && $scope.listUser) {
                            signalrService.getShowCount([$scope.scheduleId], function (r) {
                                if (r && r[0].TotalUser) {
                                    $scope.userCount = r[0].TotalUser;
                                }
                                else if ($scope.listUser) {
                                    $scope.userCount = $scope.listUser.length;
                                }
                            }, function () {
                                if ($scope.listUser) {
                                    $scope.userCount = $scope.listUser.length;
                                }
                            });
                        } else if ($scope.listUser) {
                            $scope.userCount = $scope.listUser.length;
                        }
                    };
                    //#endregion

                    //#region [Field]

                    //$scope.popover = popoverService;

                    //#endregion

                    //#region [Event]

                    $scope.$watchCollection("listUser", function (value) {
                        $scope.vipCount = 0;
                        $(value).each(function (i, x) {
                            if (!x.VipItem) return;
                            $scope.vipCount += 1;
                        });
                        updateCount();
                    });

                    $scope.$watch("scheduleId", function (value) {
                        updateCount();
                    });

                    //                    $scope.onItemClick = function ($index) {
                    //                        popoverService.userMenu.scheduleId = $scope.scheduleId;
                    //                        popoverService.userMenu.userId = $scope.listUser[$index].User.Id;
                    //                    };
                    //
                    //                    $scope.onItemKickClick = function ($index) {
                    //                        popoverService.userMenu.scheduleId = $scope.scheduleId;
                    //                        popoverService.userMenu.userId = $scope.listUserKick[$index].User.Id;
                    //                    };
                    //
                    //                    $scope.onItemAntiChatClick = function ($index) {
                    //                        popoverService.userMenu.scheduleId = $scope.scheduleId;
                    //                        popoverService.userMenu.userId = $scope.listUserAntiChat[$index].User.Id;
                    //                    };

                    $scope.$watchCollection("listUserKick", function (value) {
                        $scope.userKickCount = 0;
                        if (value) {
                            $scope.userKickCount = value.length;
                        }
                    });

                    $scope.$watchCollection("listUserAntiChat", function (value) {
                        $scope.userAntiChatCount = 0;
                        if (value) {
                            $scope.userAntiChatCount = value.length;
                        }
                    });

                    $scope.$watchCollection("listUserSetMod", function (value) {
                        $scope.userSetModCount = 0;
                        if (value) {
                            $scope.userSetModCount = value.length;
                        }
                    });

                    $scope.$watchCollection("decentralizationUser", function (value) {
                        if (value) {
                            $scope.decentralizationUser = value;
                        }
                    });

                    //#endregion
                }
            ]
        };
    }
]);