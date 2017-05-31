teenidolApp.controller("modalPopupEventController", ["$scope", "$uibModalInstance", "$timeout", "data", "sessionService", "webService",
    function ($scope, $uibModalInstance, $timeout, data, sessionService, webService) {
        //#region [Field]
        $scope.PopupEvent = {
            titleUp: undefined,
            titleItem: undefined,
            PhotoLink: undefined,
            PromotionName: undefined,
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        if (data) {
            $scope.PopupEvent = {
                titleUp: data.titleUp,
                titleItem: data.titleItem,
                PhotoLink: data.PhotoLink,
                PromotionName: data.PromotionName,
            };
            $scope.countGift = data.PhotoLink.length;
            $timeout(function () {
                $uibModalInstance.dismiss();
                $("#PromotionValueDescription").remove();
            }, 20000);
            $timeout(function () {
                $("#bannerCarousel").carousel({
                    interval: 3000
                });
            }, 1500);
        }

        $scope.$on("$viewContentLoaded", function () {
        });

        //#endregion
    }
])