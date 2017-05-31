teenidolApp.controller("modalShopGuildController", ["$scope", "$uibModalInstance", "data", "sessionService","webService","modalService",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService) {
        var pageindex = 0;
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        }
        
        if (data.data) {
            $scope.nexlevel = data.data;
            if ($scope.nexlevel.BankAccount.Balance > 0) {
                if ($scope.nexlevel.NextLevel) {
                    $scope.phantram = ($scope.nexlevel.BankAccount.Balance / $scope.nexlevel.NextLevel.Coin) * 100;
                } else {
                    $scope.phantram = 0;
                }

            } else {
                $scope.phantram = 0;
            }
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
                        data: rs.Result[2],
                    });
                },

            });
        }

        $scope.onLoadListItemCategories = function () {
            webService.call({
                name: "List_ItemCategories",
                data: {
                    pageIndex: pageindex,
                    pageSize: 15,
                    key:sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.ListItemCatelogy = r.Items;
                    array = [];
//                    angular.forEach($scope.ListItemCatelogy, function (attr) {
//                        $scope.listId = attr.ItemCategory.Id;
                        var data = {
                            pageIndex: 0,
                            pageSize: 15,
                            key: sessionService.key(),
                            categoryId: 10,
                            isNewVersion: true,
                            guildId:sessionService.data().user.Guild.Id,
                        }
                        webService.call({
                            name: "List_ItemsAnimationInStoreForGuild",
                           // type:"POST",
                            data: data,
                            onSuccess: function (r) {
                                $scope.list = r.Items;
                                angular.forEach($scope.list, function(attr) {
                                    array.push(attr);
                                });
//                                $scope.ListShopCatelogy = array;
                                $scope.ListShopCatelogy = r.Items;
                                $scope.$apply();
                            }
                        });
//                    });
                    $scope.$apply();
                }
            });
        }

        $scope.onLoadShopItem = function () {
            var currentTab = $(".star-panel .tab-pane.active").attr("id");
            switch (currentTab) {
                default:
                case "shop-catelogy":
                    if ($scope.ListShopCatelogy)
                        return;
                    $scope.ListShopCatelogy = {};
                    $scope.onLoadListItemCategories();
                    break;

                case "shop-vip":
                    if ($scope.ListShopVip)
                        return;
                    $scope.ListShopVip = {};
                    var nameService = 'List_ItemsVipInStore';
                    var data = {
                        pageIndex: pageindex,
                        pageSize: 15,
                        key: sessionService.key()
                    }
                    webService.call({
                        name: nameService,
                        data: data,
                        onSuccess: function (r) {
                            console.log(r);
                            $scope.ListShopVip = r.Items;
                            $scope.$apply();
                        }
                    });
                    break;
            }
        }

        sessionService.isReady(function() {
            $(".star-panel a[data-toggle='tab']").on("shown.bs.tab", function(e) {
                $scope.onLoadShopItem();
            });
            $(".star-panel .active a[data-toggle='tab']").trigger("shown.bs.tab");
        });

    }
]);