giasinhvienApp.directive("showSeat", [
    "helperService", function (helperService) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            templateUrl: "/Layouts/Template/ShowSeat.html",
            scope: {
                scheduleId: "=",
                listSeat: "=",
                onSeatSubmit: "&"
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "helperService", "popoverService",
                 function ($scope, helperService, popoverService) {
                     //#region [Field]
                     $scope.helper = helperService;
                     $scope.popover = popoverService;

                     //#endregion

                     //#region [Event]
                     $scope.onItemClick = function ($index) {
                         popoverService.seatMenu.scheduleId = $scope.scheduleId;
                         popoverService.seatMenu.index = $scope.listSeat.items[$index].index;
                         popoverService.seatMenu.userId = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.id : undefined;
                         popoverService.seatMenu.price = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.price : undefined;
                         popoverService.seatMenu.listPrice = $scope.listSeat.prices;
                         popoverService.seatMenu.onSubmit = $scope.onSeatSubmit;
                         popoverService.seatMenu.createDate = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.createDate : undefined;
                         popoverService.seatMenu.endDate = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.endDate : undefined;
                     };

                     //#endregion
                 }
            ]
        };
    }
]);