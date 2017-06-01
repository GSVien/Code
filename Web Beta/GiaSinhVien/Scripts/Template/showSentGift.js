giasinhvienApp.directive("showSentGift", [
       function () {
           return {
               replace: true,
               restrict: "E",
               templateUrl: "/Layouts/Template/ShowSentGift.html",
               scope: {
                   scheduleId: "=",
                   listGift: "="
               },
               controllerAs: "$ctrl",
               controller: ["$scope",
                   function ($scope) {
                       //#region [Field]

                       //#endregion

                       //#region [Event]

                       $scope.$watchCollection("listGift.items", function (value) {
                           if ($scope.listGift.items && $scope.listGift.maximunItem && $scope.listGift.items.length > $scope.listGift.maximunItem) {
                               $scope.listGift.items.splice($scope.listGift.maximunItem - 1, $scope.listGift.items.length - $scope.listGift.maximunItem);
                           }
                       });

                       //#endregion
                   }
               ]
           };
       }
]);