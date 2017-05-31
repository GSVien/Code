teenidolApp.controller("popoverSeatMenuController", ["$scope", "sessionService", "webService", "popoverService",
    function ($scope, sessionService, webService, popoverService) {
        //#region [Field]
        $scope.status = "loading";
        $scope.message = undefined;
        $scope.data = popoverService.seatMenu;
        $scope.scheduleId = undefined;
        $scope.user = {
            id: undefined,
            name: undefined,
            avatar: undefined,
            vipName: undefined,
            vipPhoto: undefined,
            vipColor: undefined,
            levelName: undefined,
            levelPhoto: undefined,
            coin: undefined
        };
        $scope.seat = {
            index: undefined,
            listBasePrice: undefined,
            currentPrice: undefined,
            createDate : undefined,
            endDate : undefined
        };
        $scope.buy = {
            listPrice: [],
            selectedPrice: undefined,
            isBusy: false
        };
        
        //#endregion

        //#region [Event]

        $scope.$watch("data", function (value) {
            $scope.scheduleId = value.scheduleId;
            $scope.seat.index = value.index;
            $scope.seat.listBasePrice = value.listPrice;
            $scope.seat.currentPrice = value.price;
            $scope.seat.createDate = value.createDate;
            $scope.seat.endDate = value.endDate;

            if (value.userId) {
                $scope.status = "loading";
                webService.call({
                    name: "User_GetDetails",
                    data: {
                        actionUserId: sessionService.userId(),
                        userId: value.userId,
                        isStart: false,
                        key: sessionService.key()
                    },
                    onError: function(msg) {
                        $scope.status = "error";
                        $scope.message = msg;
                    },
                    onSuccess: function(r) {
                        $scope.user.id = r.Result.User.Id;
                        $scope.user.name = r.Result.User.Name;
                        $scope.user.avatar = r.Result.User.AvatarPhoto;
                        $scope.user.vipName = r.Result.VipItem ? r.Result.VipItem.Name : undefined;
                        $scope.user.vipPhoto = r.Result.VipItem ? r.Result.VipItem.PhotoLink : undefined;
                        $scope.user.vipColor = r.Result.VipItem ? r.Result.VipItem.HexColor : undefined;
                        $scope.user.levelName = r.Result.GroupLevel.Name;
                        $scope.user.levelPhoto = r.Result.GroupLevel.Photo;
                        $scope.user.coin = r.Result.User.TotalCoinUsed;
                        $scope.status = "loaded";
                    }
                });
            } else {
                $scope.user = undefined;
                $scope.status = "loaded";
            }
        });

        $scope.$watch("seat.currentPrice", function (value) {
            if (!$scope.seat.listBasePrice)
                return;
            
            $scope.buy.listPrice = [];
            $($scope.seat.listBasePrice).each(function (i, x) {
                if (!value || x > value)
                    $scope.buy.listPrice.push(x);
            });
            if ($scope.buy.listPrice.length > 0)
                $scope.buy.selectedPrice = $scope.buy.listPrice[0];
        });

        $scope.onSubmit = function ($event) {
            if ($scope.data.onSubmit)
                $scope.data.onSubmit({ $popoverScope: $scope });
        };

        //#endregion
    }
]);