teenidolApp.controller("usercoinlogController", [
    "$scope", "$routeParams", "sessionService", "webService", "authenticationService", "formService", "helperService", "$log",
    function ($scope, $routeParams, sessionService, webService, authenticationService, formService, helperService, $log) {
        var suggestStarCarousel;
        var carouselData = [];
        $scope.popup1 = {
            opened: false,
            date:new Date(),
        };

        $scope.popup2 = {
            opened: false,
            date: new Date(),
        };
        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.helperService = helperService;
        $scope.IdUserSession = $scope.$p.sessionService.userId();
        var pageindex = 0;
        $scope.CurrentPage = 1;
        if ($routeParams) {
            $scope.userId = $routeParams.id;
        }
        //#region [Method]
        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };
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

        $scope.onLoadUserGetDetails = function () {
            webService.call({
                name: "User_GetDetails",
                data: {
                    actionUserId: $scope.IdUserSession,
                    userId: $scope.userId,
                    isStar: true,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.userSession = r.Result;
                    $scope.$apply();
                }
            });
        };

        $scope.onLoadUserSpend = function (a) {
            var type = 1;
            $scope.a = 1;
            pageindex = $scope.CurrentPage - 1;
            if (a) {
                type = a;
                $scope.a = a;
            }
            webService.call({
                name: "List_UserSpend",
                data: {
                    pageIndex: pageindex,
                    pageSize: 10,
                    userId: $scope.IdUserSession,
                    type: type,
                    startTime: 0,
                    endTime: 0,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.total = r.Total;
                    $scope.ListUserSpend = r.Items;
                    $scope.TotalItems = r.Total;
                    $scope.CurrentPage = pageindex + 1;
                    $scope.numPages = r.PageCount;
                    $scope.maxSize = 3;
                    $scope.b = 1;
                    $scope.$apply();
                }
            });
            $('.type a').click(function() {
                $('.type a').removeClass('active');
                $(event.target).addClass('active');
            });
        };

        $scope.onLoadSeachCoinLog = function (a) {
            pageindex = $scope.CurrentPage - 1;
            var type = a;
            webService.call({
                name: "List_UserSpend",
                data: {
                    pageIndex: pageindex,
                    pageSize: 10,
                    userId: $scope.IdUserSession,
                    type: type,
                    startTime: $scope.popup1.date.getTime(),
                    endTime: $scope.popup2.date.getTime(),
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.total = r.Total;
                    $scope.ListUserSpend = r.Items;
                    $scope.TotalItems = r.Total;
                    $scope.CurrentPage = pageindex + 1;
                    $scope.numPages = r.PageCount;
                    $scope.maxSize = 3;
                    $scope.b = 2;
                    $scope.$apply();
                }
            });
        };
        //#endregion

        //#region [Global Event]

        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $scope.onLoadUserGetDetails();
            $scope.onLoadUserSpend();
        });
        //#endregion
    }
]);