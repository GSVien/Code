giasinhvienApp.controller("modalUserMissionController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification) {
        //#region [Field]

        $scope.GetListMission = {
            status: "loading",
            Items: undefined,
        }
        $scope.GetListMissionother = {
            status: "loading",
            Items: undefined,
        }
        //#endregion

        //#region [Event]

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        webService.call({
            name: "User_GetListPromotionGift",
            data: {
                creatorId: sessionService.userId(),
                pageIndex: 0,
                pageSize: 9999,
                list_PromotionGiftId: "",
                list_ActionId: "",
                userId: sessionService.userId(),
                key: sessionService.key(),
            },
            onSuccess: function (r) {
                $scope.listItems = r.Items;
                var array = [];
                var array1 = [];
                var array2 = [];
                for (i = 2; i <= 15; i++) {
                    $(r.Items).each(function (j, y) {
                        if (y.GroupLevelUser) {
                            if (y.GroupLevelUser.LevelIndex === i) {
                                array1.push(y);
                            }
                        }
                    });
                    array.push({ rs: array1, name: array1[0].GroupLevelUser.Name, photo: array1[0].GroupLevelUser.Photo, UserHad: array1[0].UserHad, id: array1[0].GroupLevelUser.LevelIndex });
                    array1 = [];
                }
                $(r.Items).each(function (j, y) {
                    if (!y.GroupLevelUser) {
                        array2.push(y);
                    }
                });
                $scope.GetListMission.Items = array;
                $scope.GetListMissionother.Items = array2;
            }
        });



        $scope.RewardMission = function (event) {
            var listPromotionGiftId = event;
            var listid = "";
            $($scope.listItems).each(function (j, y) {
                if (y.GroupLevelUser) {
                    if (y.GroupLevelUser.LevelIndex === listPromotionGiftId) {
                        listid += y.PromotionGift.Id + ',';
                    }
                }
            });
            var str = listid.substring(0, listid.length - 1);

            webService.call({
                type: "POST",
                name: "User_ReceivePromotionGift",
                data: {
                    actionUserId: sessionService.userId(),
                    listPromotionGiftId: str,
                    key: sessionService.key()
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success("Nhận Thưởng Thành Công!");
                    webService.call({
                        name: "User_GetListPromotionGift",
                        data: {
                            creatorId: sessionService.userId(),
                            pageIndex: 0,
                            pageSize: 9999,
                            list_PromotionGiftId: "",
                            list_ActionId: "",
                            userId: sessionService.userId(),
                            key: sessionService.key(),
                        },
                        onSuccess: function (r) {
                            $scope.listItems = r.Items;
                            var array = [];
                            var array1 = [];
                            var array2 = [];
                            for (i = 2; i <= 15; i++) {
                                $(r.Items).each(function (j, y) {
                                    if (y.GroupLevelUser) {
                                        if (y.GroupLevelUser.LevelIndex === i) {
                                            array1.push(y);
                                        }
                                    }
                                });
                                array.push({ rs: array1, name: array1[0].GroupLevelUser.Name, photo: array1[0].GroupLevelUser.Photo, UserHad: array1[0].UserHad, id: array1[0].GroupLevelUser.LevelIndex });
                                array1 = [];
                            }
                            $(r.Items).each(function (j, y) {
                                if (!y.GroupLevelUser) {
                                    array2.push(y);
                                }
                            });
                            $scope.GetListMission.Items = array;
                            $scope.GetListMissionother.Items = array2;
                            if (!$scope.$$phase) $scope.$apply();
                        }
                    });
                }
            });
        };

        $scope.RewardMissionother = function (event) {
            var listPromotionGiftId = event;
            webService.call({
                type: "POST",
                name: "User_ReceivePromotionGift",
                data: {
                    actionUserId: sessionService.userId(),
                    listPromotionGiftId: listPromotionGiftId,
                    key: sessionService.key()
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success("Nhận Thưởng Thành Công!");

                }
            });
        };

        //#endregion
    }
])