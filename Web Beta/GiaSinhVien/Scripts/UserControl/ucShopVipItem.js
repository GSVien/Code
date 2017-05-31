teenidolApp.directive("ucShopVipItem", [
    "helperService", "sessionService", "webService", "authenticationService", "Notification", "modalService",
    function (helperService, sessionService, webService, authenticationService, Notification, modalService) {
        var controller = function ($scope, $element) {
            $scope._ctrl = this;

            $scope.BuyItems = function (event) {
                var itemId = $(event.target).closest("button").data("id");
                var purchaseId = $('select[name=listPricevip-' + itemId + ']').val();
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
                        text: "Không", style: "btn-default", closeModal: true
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
                                        isVipItem: true,
                                        key: sessionService.key()
                                    },
                                    //displayError: true,
                                    onError: function (errorCode, message) {
                                        Notification.error(message);
                                    },
                                    onSuccess: function (r) {
                                        Notification.success("Mua Vật Phẩm " + r.Result.Name + " Thành Công !");
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            }
            $scope.hoverIn = function () {
                $(event.target).closest(".vip-item .info.pull-right").trigger("click");
            };

            $scope.hoverOut = function () {
                $scope.hoverEdit = false;
            };
        }
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            controller: controller,
            scope: {
                id: "@",
                avatar: "@",
                name: "@",
                listPrice: "@",
                ListFeatures: "@",
                vipModel: "="
            },
            templateUrl: "/Views/UserControl/ucShopVipItem.html",
            link: function (scope, element, attrs) {
                if (scope.vipModel) {
                    if (!scope.id) scope.id = scope.vipModel.VipItem.Id;
                    if (!scope.avatar) scope.avatar = scope.vipModel.VipItem.StorePhoto;
                    if (!scope.name) scope.name = scope.vipModel.VipItem.Name;
                    if (!scope.listPrice) scope.listPrice = scope.vipModel.ListPurchases;
                    if (!scope.ListFeatures) scope.ListFeatures = scope.vipModel.ListFeatures;
                }
                scope.Description = "";
                $(scope.ListFeatures).each(function (j, x) {
                    scope.Description += x.Description + "<br />- ";
                });
            }
        };
    }
]);