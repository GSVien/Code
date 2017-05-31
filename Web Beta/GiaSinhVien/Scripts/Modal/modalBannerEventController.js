teenidolApp.controller("modalBannerEventController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", 
    function ($scope, $uibModalInstance, data, sessionService, webService) {
        //#region [Field]
        $scope.openingShow = {
            status: "loading",
            error: undefined
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        if (data.data) {
            $scope.newBannerImg = data.data.newBannerImage;
            $scope.newBannerLink = data.data.newBannerLink;
        }

        sessionService.isReady(function () {
            //            if ($cookies.get('myFavorite')) {
            //                var favoriteCookie = $cookies.get('myFavorite');
            //                var now = new Date();
            //                var time = now.getTime();
            //                if ((favoriteCookie + 36000000) <= time) {
            //                    $scope.checktime = true;
            //                    $scope.onLoadNewsBanner();
            //                } else {
            //                    $scope.checktime = false;
            //                }
            //            } else {
            //                $scope.onLoadNewsBanner();
            //                $scope.checktime = true;
            //                var now = new Date();
            //                var time = now.getTime();
            //                $cookies.put('myFavorite', time, { 'expires': time });
            //            }
        });
        //#endregion
    }
])