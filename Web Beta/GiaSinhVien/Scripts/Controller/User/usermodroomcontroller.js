teenidolApp.controller("usermodroomController", [
    "$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService) {
        var suggestStarCarousel;
        var carouselData = [];

        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.IdUserSession = $scope.$p.sessionService.userId();
        if ($routeParams) {
            userId = $routeParams.id;
        }
        //#region [Method]
        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };
        //#endregion

        //#endregion

        //#region [Layout]

        $scope.$p.layoutShowHeader = true;
        $scope.$p.layoutShowFooter = true;
        $scope.$p.layoutShowBanner = true;
        $scope.$p.layoutFullBody = true;

        //#endregion

        //#region [Event]

        $scope.onLoadUserGetDetails = function () {
            webService.call({
                name: "User_GetDetails",
                data: {
                    actionUserId: $scope.$p.sessionService.userId(),
                    userId: userId,
                    isStar: true,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.name = r.Result.User.Name;
                    $scope.$apply();
                }
            })
        };

        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $scope.onLoadUserGetDetails();
        });
        //#endregion
    }
]);