giasinhvienApp.controller("userinventoryController", [
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
        pageIndex = 0;

        var now = new Date();
        var today = now.getTime();
        $scope.today =  today;
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
        $scope.onLoadListAnimationItem = function () {
            webService.call({
                name: "User_GetListAnimationItem",
                data: {
                    actionUserId: $scope.IdUserSession,
                    userId: userId,
                    pageIndex: 0,
                    pageSize: 9999,
                    key: $scope.$p.sessionService.key()
                },
                onSuccess: function (r) {
                    $scope.total = r.Total;
                    $scope.ListAnimationItem = r.Items;
                    $scope.$apply();
                }
            });
        }
        $scope.DefaultItem = function (a, b, c) {
            webService.call({
                name: "Store_ChoseAnimationDefaultItem",
                data: {
                    actionUserId: $scope.IdUserSession,
                    animationItemId: a,
                    rootCategoryId: b,
                    key: $scope.$p.sessionService.key()
                },
                //displayError: true,
                onError: function (code, msg) {
                    console.log(code, msg);
                },
                onSuccess: function (r) {
                    $scope.onLoadListAnimationItem();
                    $scope.$apply();
                }
            });
        }
        // };
        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $scope.onLoadListAnimationItem();
        });
        //#endregion
    }
]);