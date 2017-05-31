teenidolApp.directive("showGift", [
    function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                listGiftCategory: "=",
                scheduleId: "@",
                starId: "@",
            },
            templateUrl: "/Layouts/Template/ShowGift.html",
            controllerAs: "$ctrl",
            controller: [
                "$scope", "webService", "$rootScope", "sessionService", "helperService", "authenticationService", "Notification",
                function ($scope, webService, $rootScope, sessionService, helperService, authenticationService, Notification) {
                    //#region [Field]
                    $scope.helper = helperService;
                    $scope.freeCoinQuantity = undefined;
                    //#endregion

                    //#region [Callback]

                    $scope.onAfterSendGift = function (gift, coin) {
                        $scope.updateUserCoin(-coin);
                    };

                    $scope.onAfterSendFreeCoin = function (freeCoin) {
                        $scope.updateUserFreeCoin(-freeCoin);
                    };


                    $scope.updateUserCoin = function (amount) {
                        sessionService.data().user.User.Coin += amount;
                        if (!$scope.$$phase) $scope.$apply();
                    };

                    $scope.updateUserFreeCoin = function (amount) {
                        sessionService.data().user.User.TotalFreeCoin += amount;
                        $scope.$apply();
                    };
                    //#endregion

                    //#region [Event]

                    $scope.onSelectGiftItem = function ($event) {
                        var $target = $($event.target).closest(".gift-item");

                        if ($scope.selectedGift && $scope.selectedGift.id === $target.data("id"))
                            return;

                        $scope.selectedGift = $scope.listGiftCategory[$target.closest(".gift-category").data("index")].listGift[$target.data("index")];
                        $scope.selectedGift.selectedQuantity = $scope.selectedGift.listQuantity[0];
                    };

                    $scope.onSendGift = function ($event) {
                        var $target = $(($event.target).closest("button"));
                        if ($scope.helper.isLoading($target))
                            return;

                        if (!sessionService.isSigned()) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: "Bạn cần đăng nhập để sử dụng tính năng này"
                            });
                            return;
                        }

                        $target.button("loading");
                        (function (sendGift) {
                            webService.call({
                                type: "POST",
                                name: "User_GiveAwayGift",
                                data: {
                                    actionUserId: sessionService.userId(),
                                    giftId: sendGift.id,
                                    quantity: sendGift.selectedQuantity.quantity,
                                    scheduleId: $scope.scheduleId,
                                    starId: $scope.starId,
                                    isInEvent: false,
                                    key: sessionService.key()
                                },
                                displayError: true,
                                onError: function (errorCode, message) {
                                    $target.button("reset");
                                },
                                onSuccess: function (r) {
                                    $target.button("reset");
                                    $scope.onAfterSendGift({
                                        id: sendGift.id,
                                        name: sendGift.name,
                                        quantity: sendGift.selectedQuantity.quantity,
                                        photo: sendGift.selectedQuantity.photo,
                                        animation: sendGift.selectedQuantity.animation,
                                        type: sendGift.selectedQuantity.type,
                                        animationTime: sendGift.selectedQuantity.animationTime,
                                        animationWidth: sendGift.selectedQuantity.animationWidth,
                                        animationHeight: sendGift.selectedQuantity.animationHeight,
                                        photoGif: sendGift.selectedQuantity.photoGif,
                                        animationGifTime: sendGift.selectedQuantity.animationGifTime
                                    }, sendGift.price * sendGift.selectedQuantity.quantity);
                                }
                            });
                        })($scope.selectedGift);
                    };

                    $scope.onSendFreeCoin = function ($event) {
                        var $target = $(($event.target).closest("button"));
                        if ($scope.helper.isLoading($target) || $scope.helper.isDisabled($target))
                            return;

                        if (!sessionService.isSigned()) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: "Bạn cần đăng nhập để sử dụng tính năng này"
                            });
                            return;
                        }
                        if (!$scope.freeCoinQuantity) {
                            var freeCoinQuantity = 10;
                        } else {
                            var freeCoinQuantity = $scope.freeCoinQuantity;
                        }
                        //$target.button("loading");
                        webService.call({
                            type: "POST",
                            name: "User_GiveFreeCoin",
                            data: {
                                actionUserId: sessionService.userId(),
                                scheduleId: $scope.scheduleId,
                                starId: $scope.starId,
                                freeCoin: freeCoinQuantity,
                                key: sessionService.key()
                            },
                            displayError: true,
                            onError: function (errorCode, message) {
                                //$target.button("reset");
                            },
                            onSuccess: function (r) {
                                //$target.button("reset");
                                $scope.onAfterSendFreeCoin(freeCoinQuantity);
                            }
                        });
                    };

                    $scope.onUserRechargeCoin = function () {
                        $rootScope.$broadcast("onUserRechargeCoin");
                    }

                    $scope.setfreeCoinQuantity = function (number) {
                        $scope.freeCoinQuantity = number;
                        $(".give-free-coin").html('Tặng '+ number + ' <i class="free-coin-icon"></i>');
                    }
                    //#endregion

                }
            ]
        };
    }
]);