teenidolApp.controller("userfollowController", [
    "$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService) {
        var suggestStarCarousel;
        var carouselData = [];

        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.ListUserFollow = undefined;
        $scope.ListStarFollow = undefined;
        $scope.ListFollow = {
             status: "loading"
        };
        if ($routeParams) {
            $scope.userId = $routeParams.id;
        }
        //#region [Method]
        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };
        $scope.getDisplayPoint = function (x) {
            if (x != undefined)
                return x.TotalSumValue;
            return 0;
        }
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
                    userId: $scope.userId,
                    isStar: true,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function(r) {
                    $scope.name = r.Result.User.Name;
                    $scope.$apply();
                }
            });
        };
        $scope.onLoadListFollow = function (a) {
            var pageindex = 0;
            var type = 1;
            $scope.a = 1;
            if (a) {
                pageindex = $scope.CurrentPage - 1;
                type = a;
                $scope.a = a;
            }
            var currentTab = $(".right-panel .tab-pane.active").attr("id");
            switch (currentTab) {
                default:
                case "user-follow":
                    webService.call({
                        name: "User_GetListUserFollow",
                        data: {
                            actionUserId: $scope.$p.sessionService.userId(),
                            userId: $scope.userId,
                            pageIndex: pageindex,
                            pageSize: 8,
                            key: $scope.$p.sessionService.key(),
                        },
                        onSuccess: function (r) {

                            $scope.TotalUser = r.Total;
                            $scope.CurrentPage = pageindex + 1;
                            $scope.numPages = r.PageCount;
                            $scope.maxSize = 5;
                            if ($scope.TotalUser > 0) {
                                $scope.ListUserFollow = r.Items;
                            }
                            else {
                                $scope.ListUserFollow = [];
                            }
                            $scope.$apply();
                            $(".right-panel a[data-toggle='tab'].active").removeClass('active');
                            $(".right-panel a[data-target='#user-follow']").addClass('active');
                            $('#page-' + (parseInt($scope.pageUserindex) + 1)).addClass('active');
                        }
                    });
                    break;

                case "star-follow":
                    webService.call({
                        name: "User_GetListStarFollow",
                        data: {
                            actionUserId: $scope.$p.sessionService.userId(),
                            userId: $scope.userId,
                            pageIndex: pageindex,
                            pageSize: 8,
                            key: $scope.$p.sessionService.key(),
                        },
                        onSuccess: function (r) {

                            $scope.totalStar = r.Total;
                            $scope.CurrentPage = pageindex + 1;
                            $scope.numPages = r.PageCount;
                            $scope.maxSize = 5;
                            if ($scope.totalStar > 0) {
                                $scope.ListStarFollow = r.Items;
                            }
                            else {
                                $scope.ListStarFollow = [];
                            }

                            $scope.ListFollow.status = "loaded";
                            $scope.$apply();
                            $(".right-panel a[data-toggle='tab'].active").removeClass('active');
                            $(".right-panel a[data-target='#star-follow']").addClass('active');
                            $('#page-' + (parseInt($scope.pageStarindex) + 1)).addClass('active');
                        }
                    });
                    break;
            }
        };


        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $(".right-panel a[data-toggle='tab']").on("shown.bs.tab", function (e) {
                $scope.onLoadListFollow();
            });
            $(".right-panel .active a[data-toggle='tab']").trigger("shown.bs.tab");
            $scope.onLoadUserGetDetails();
        });
        //#endregion
    }
]);