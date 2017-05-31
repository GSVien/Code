teenidolApp.controller("modalRechargeCoinController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification", "helperService", "formService", "$window", "modalService", "$timeout",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification, helperService, formService, $window, modalService, $timeout) {
        //#region [Field]
        $scope.rechargeCoin = {
            card: {
                status: "loading",
                message: undefined,
                isBusy: false,
            },
            bank: {
                status: "loading",
                message: undefined,
                isBusy: false,
            },
            visa: {
                money: undefined,
                isBusy: false,
            },
            teenidol: {
                status: "loading",
                message: undefined,
                isBusy: false,
            }
        };
        $scope.IsSelected = false;
        //#endregion

        $scope.sessionService = sessionService;
        $scope.helper = helperService;
        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onRechargeCoinCardLoad = function () {
            $scope.rechargeCoin.card.status = "loading";
            webService.call({
                name: "GetListSmsTypes",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.card.status = "error";
                    $scope.rechargeCoin.card.message = message;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.card.list = [];
                    $(r.Result).each(function (i, x) {
                        $scope.rechargeCoin.card.list.push({
                            id: x.Value,
                            name: x.Name,
                            photo: "/Content/Image/Card/" + x.Name + ".png"
                        });
                    });
                    $scope.rechargeCoin.card.type = $scope.rechargeCoin.card.list[0].id;
                    $scope.rechargeCoin.card.status = "loaded";
                }
            });
        };

        $scope.onRechargeCoinBankLoad = function () {
            $scope.rechargeCoin.bank.status = "loading";
            webService.call({
                name: "GetBankInfo",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.bank.status = "error";
                    $scope.rechargeCoin.bank.message = message;
                },
                onSuccess: function (r) {
                    $(r.ListMethod).each(function (i, x) {
                        if (i === 0) {
                            r.ListMethod[i].Name = "Thẻ ATM nội địa";
                        } else if (i === 1) {
                            r.ListMethod[i].Name = "Thẻ tín dụng quốc tế";
                        }
                    });

                    $scope.rechargeCoin.bank.minimumMoney = r.MinimumMoney;
                    $scope.rechargeCoin.bank.bonusCoinPercent = r.BonusCoinPercent;
                    $scope.rechargeCoin.bank.listMethod = r.ListMethod;
                    $scope.rechargeCoin.bank.currentMethodId = $scope.rechargeCoin.bank.listMethod[0].Method;
                    $scope.rechargeCoin.bank.currentBankId = $scope.rechargeCoin.bank.listMethod[0].ListBank[0].Id;
                    $scope.rechargeCoin.bank.status = "loaded";
                    $scope.$apply();
                }
            });
        };

        $scope.onRechargeCoinCardSubmit = function ($event) {
            //            var $target = $($event.target);
            //            var $buttonElement = $target.find("[type=submit]");
            //
            //            if (formService.isLoading($buttonElement))
            //                return;
            //            $buttonElement.button("loading");

            //            if (!formService.validate({
            //                target: $buttonElement,
            //                rule: [
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.card.pin && !isNoUoW($scope.rechargeCoin.card.pin);
            //            },
            //                message: "Bạn chưa nhập số PIN."
            //            },
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.card.serial && !isNoUoW($scope.rechargeCoin.card.serial);
            //            },
            //                message: "Bạn chưa nhập số Serial."
            //            }
            //            ]
            //            })) {
            //                $buttonElement.button("reset");
            //                return;
            //            };
            $scope.rechargeCoin.card.isBusy = true;
            var isUseVoucher = false;
            if ($scope.rechargeCoin.card.makhyenmai) {
                var isUseVoucher = true;
            }
            webService.call({
                type: "POST",
                name: "User_DoPayment",
                data: {
                    actionUserId: sessionService.userId(),
                    type: $scope.rechargeCoin.card.type,
                    cardSerial: $scope.rechargeCoin.card.serial,
                    cardPin: $scope.rechargeCoin.card.pin,
                    code: $scope.rechargeCoin.card.makhyenmai,
                    isUseVoucher: isUseVoucher,
                    key: sessionService.key()
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.card.isBusy = false;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.card.isBusy = false;
                    if (r.Result.Amount > 99000) {
                        modalService.showIframeRechargeCoin({
                        });
                    }
                    sessionService.reload();
                    $scope.rechargeCoin.card.type = $scope.rechargeCoin.card.list[0].id;
                    $scope.rechargeCoin.card.pin = undefined;
                    $scope.rechargeCoin.card.serial = undefined;

                    Notification.success("Nạp tiền thành công");

                    $scope.rechargeCoin.card.serial = "";
                    $scope.rechargeCoin.card.pin = "";
                    $scope.rechargeCoin.card.makhyenmai = "";
                    $scope.$apply();
                }
            });
        };

        $scope.onRechargeCoinBankSubmit = function ($event) {
            //            var $target = $($event.target);
            //            var $buttonElement = $target.find("[type=submit]");
            //
            //            if (formService.isLoading($buttonElement))
            //                return;
            //            $buttonElement.button("loading");
            //
            //            if (!formService.validate({
            //                target: $buttonElement,
            //                rule: [
            //                    {
            //                check: function () {
            //                            return true;
            //                            return $scope.rechargeCoin.bank.money && $scope.rechargeCoin.bank.money >= $scope.rechargeCoin.bank.minimumMoney;
            //            },
            //                message: "Số tiền phải >= " + formatNumber($scope.rechargeCoin.bank.minimumMoney) + "."
            //            },
            //                    {
            //                check: function () {
            //                            return typeof $scope.rechargeCoin.bank.currentBankId === "number";
            //            },
            //                message: "Bạn chưa chọn phương thức thanh toán."
            //            }
            //            ]
            //            })) {
            //                $buttonElement.button("reset");
            //                return;
            //            };
            $scope.rechargeCoin.bank.isBusy = true;
            if ($scope.rechargeCoin.bank.currentBankId === "number") {
                Notification.error('Bạn chưa chọn phương thức thanh toán.');
                $scope.rechargeCoin.bank.isBusy = false;
                return;
            }
            if ($scope.rechargeCoin.bank.money < $scope.rechargeCoin.bank.minimumMoney) {
                Notification.error("Số tiền phải >= " + formatNumber($scope.rechargeCoin.bank.minimumMoney) + ".");
                $scope.rechargeCoin.bank.isBusy = false;
                return;
            }
            var isUseVoucher = false;
            if ($scope.rechargeCoin.bank.makhyenmai) {
                var isUseVoucher = true;
            }
            webService.call({
                type: "POST",
                name: "ChargeBank",
                data: {
                    actionUserId: sessionService.userId(),
                    totalAmount: $scope.rechargeCoin.bank.money,
                    paymentMethodId: $scope.rechargeCoin.bank.currentBankId,
                    isUseVoucher: isUseVoucher,
                    code: $scope.rechargeCoin.bank.khuyenmai,
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.bank.isBusy = false;
                    Notification.error(messsage);
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.bank.isBusy = false;
                    $scope.rechargeCoin.bank.money = "";
                    $scope.rechargeCoin.bank.khuyenmai = "";

                    modalService.showAlert({
                        title: "Nạp tiền",
                        message: "Chúng tôi đã chuyển thao tác cho BaoKim, xin hãy tiếp tục quá trình nạp tiền tại đó." +
                              "<br/><br/>Nếu bạn không thấy trang web BaoKim được mở, rất có thể là do hệ thống chặn pop-up tại trình duyệt ở mấy bạn. Xin hãy cho phép TeenIdol được sử dụng popup hoặc <a href='" + r.Result + "' target='_blank'>Click đây để mở web BaoKim</a>",
                        buttons: [
                            { text: "OK", style: "btn-primary" }
                        ]
                    });
                    $window.open(r.Result, "_blank");
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.onVisa = function ($event) {
            var btn = $($event.target).find(".btn");

            if (!$scope.rechargeCoin.visa.money) {
                Notification.error("Xin nhập số tiền");
                return;
            }

            $scope.rechargeCoin.visa.isBusy = true;
            webService.call({
                type: "POST",
                name: "ChargeVisa",
                data: {
                    actionUserId: sessionService.userId(),
                    money: $scope.rechargeCoin.visa.money,
                    promoCode: null,
                    platform: 1,
                    key: sessionService.key()
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.visa.isBusy = false;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.visa.isBusy = false;

                    modalService.showAlert({
                        title: "Nạp tiền",
                        message: "Chúng tôi đã chuyển thao tác cho 1Pay Global Bank, xin hãy tiếp tục quá trình nạp tiền tại đó." +
                              "<br/><br/>Nếu bạn không thấy trang web của 1Pay Global Bank được mở, <a href='" + r.Result.PayUrl + "' target='_blank'>Xin click vào đây</a>",
                        buttons: [
                            { text: "OK", style: "btn-primary", closeModal: true }
                        ]
                    });
                    $window.open(r.Result.PayUrl, "_blank");
                    console.log(r.Result.PayUrl);
                }
            });
        };

        $scope.onRechargeCoinTeenidol = function ($event) {
            //            var $target = $($event.target);
            //            var $buttonElement = $target.find("[type=submit]");
            //
            //            if (formService.isLoading($buttonElement))
            //                return;
            //            $buttonElement.button("loading");
            //            if (!formService.validate({
            //                target: $buttonElement,
            //                rule: [
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.teenidol.pin;
            //            },
            //                message: "Bạn chưa nhập số PIN."
            //            },
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.teenidol.serial;
            //            },
            //                message: "Bạn chưa nhập số Serial."
            //            }
            //            ]
            //            })) {
            //                $buttonElement.button("reset");
            //                return;
            //            };
            $scope.rechargeCoin.teenidol.isBusy = true;
            webService.call({
                type: "POST",
                name: "User_UseVoucher",
                data: {
                    actionUserId: sessionService.userId(),
                    code: $scope.rechargeCoin.teenidol.pin,
                    serial: $scope.rechargeCoin.teenidol.serial,
                    key: sessionService.key()
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.teenidol.isBusy = false;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.teenidol.isBusy = false;
                    $scope.testEvent = r.Extra;
                    if (r.Extra != null) {
                        $("#modal-up-event").modal("show");
                    }
                    sessionService.reload();
                    $scope.rechargeCoin.card.type = $scope.rechargeCoin.card.list[0].id;
                    $scope.rechargeCoin.card.pin = undefined;
                    $scope.rechargeCoin.card.serial = undefined;

                    Notification.success("Nạp tiền thành công");
                    $scope.rechargeCoin.teenidol.serial = "";
                    $scope.rechargeCoin.teenidol.pin = "";
                    $scope.$apply();
                }
            });
        };
        $scope.onIsSelected = function () {
            $scope.IsSelected = true;
            if (!$scope.$$phase) $scope.$apply();
        }
//        $scope.onDeselect = function () {
//            $scope.IsSelected = false;
//            if (!$scope.$$phase) $scope.$apply();
//        }
        //#endregion
    }
])