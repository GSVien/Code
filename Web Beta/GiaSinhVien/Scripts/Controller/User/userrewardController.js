teenidolApp.controller("userrewardController", [
"$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", "helperService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService, helperService) {
    var suggestStarCarousel;
    var carouselData = [];
    $scope.popup1 = {
        opened: false,
        date: new Date(),
    };

    $scope.popup2 = {
        opened: false,
        date: new Date(),
    };
    //#region [Field]
    $scope.$p = $scope.$parent;

    //#region [Method]
    pageindex = 0;
    if ($routeParams.p) {
        pageindex = $routeParams.p - 1;
    }
    $scope.IdUserSession = $scope.$p.sessionService.userId();
    if ($routeParams) {
        $scope.userId = $routeParams.id;
    }
    var now = new Date();
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
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.onLoadGetRewardLog = function () {
        webService.call({
            name: "User_GetRewardLog",
            data: {
                actionUserId: $scope.IdUserSession,
                userId: $scope.userId,
                pageIndex: pageindex,
                pageSize: 10,
                key: $scope.$p.sessionService.key(),
                startTime: 0,
                endTime: now.getTime(),
            },
            onSuccess: function (r) {
                $scope.helperService = helperService;
                $scope.total = r.Total;
                $scope.pageindex = r.PageIndex;
                $scope.pagecount = r.PageCount;
                $scope.GetRewardLog = r.Items;
                $scope.$apply();
                $('#page-' + (parseInt($scope.pageindex) + 1)).addClass('active');
            }
        });
    }
    $scope.onLoadSeachReward = function () {
        
        webService.call({
            name: "User_GetRewardLog",
            data: {
                actionUserId: $scope.IdUserSession,
                userId: $scope.userId,
                pageIndex: pageindex,
                pageSize: 12,
                key: $scope.$p.sessionService.key(),
                startTime: $scope.popup1.date.getTime(),
                endTime: $scope.popup2.date.getTime(),
            },
            onSuccess: function (r) {
                $scope.helperService = helperService;
                $scope.total = r.Total;
                $scope.pageindex = r.PageIndex;
                $scope.pagecount = r.PageCount;
                $scope.GetRewardLog = r.Items;
                $('#page-' + (parseInt($scope.pageindex) + 1)).addClass('active');
                $scope.$apply();
            }
        })
    }
    //#endregion

    //#region [Global Event]


    //#endregion

    //#region [On Load]

    sessionService.isReady(function () {
        $scope.onLoadGetRewardLog();
    });
    //#endregion
}
]);