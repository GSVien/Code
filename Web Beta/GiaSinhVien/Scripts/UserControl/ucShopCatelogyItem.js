teenidolApp.directive("ucShopCatelogyItem", [
    "helperService", "sessionService", "webService", "authenticationService", "Notification","modalService",
    function (helperService, sessionService, webService, authenticationService, Notification,modalService) {
        var controller = function ($scope, $element) {
            $scope._ctrl = this;

            $scope.BuyItems = function (event) {

                var itemId = $(event.target).closest("button").data("id");

                var purchaseId = $('select[name=listPrice-' + itemId + ']').val();

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }
                modalService.showAlert({
                    title: "Xác nhận",
                    message: "Bạn chắc chắn muốn mua vật phẩm này chứ?",
                    buttons: [
                        {
                            text: "Không",
                            style: "btn-default",
                            closeModal: true
                        },
                        {
                            text: "Có",
                            style: "btn-default",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "User_BuyItems",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        itemId: itemId,
                                        purchaseId: purchaseId,
                                        isVipItem: false,
                                        key: sessionService.key()
                                    },
                                    //displayError: true,
                                    onError: function (errorCode, message) {
                                        Notification.error(message);
                                    },
                                    onSuccess: function (r) {
                                        Notification.success("Mua Vật Phẩm " + r.Result.Name + "  Thành Công !");
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            }
            $scope.BuyItemsGuild = function (event) {
                var itemId = $(event.target).closest("button").data("id");

                var purchaseId = $('select[name=listPrice-' + itemId + ']').val();

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }
                modalService.showAlert({
                    title: "Xác nhận",
                    message: "Bạn chắc chắn muốn mua vật phẩm này chứ?",
                    buttons: [
                        {
                            text: "Không",
                            style: "btn-default",
                            closeModal: true
                        },
                        {
                            text: "Có",
                            style: "btn-default",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "User_BuyItemsForGuild",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        itemId: itemId,
                                        purchaseId: purchaseId,
                                        isVipItem: false,
                                        guildId: sessionService.data().user.Guild.Id,
                                        key: sessionService.key()
                                    },
                                    //displayError: true,
                                    onError: function (errorCode, message) {
                                        Notification.error(message);
                                    },
                                    onSuccess: function (r) {
                                        Notification.success("Mua Vật Phẩm " + r.Result.Name + "  Thành Công !");
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            }
        }
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            controller: controller,
            scope: {
                id: "@",
                buy: "@",
                isbuy: "@",
                avatar: "@",
                name: "@",
                listPrice: "@",
                catelogyModel: "="
            },
            templateUrl: "/Views/UserControl/ucShopCatelogyItem.html",
            link: function (scope, element, attrs) {
                console.log(scope);
                if (scope.catelogyModel) {
                    if (!scope.id) scope.id = scope.catelogyModel.AnimationItem.Id;
                    if (!scope.avatar) scope.avatar = scope.catelogyModel.AnimationItem.PhotoLink;
                    if (!scope.name) scope.name = scope.catelogyModel.AnimationItem.Name;
                    if (!scope.listPrice) scope.listPrice = scope.catelogyModel.ListItemPurchase;
                }
            }
        };
    }
]);