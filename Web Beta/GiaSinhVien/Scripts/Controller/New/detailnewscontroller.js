teenidolApp.controller("detailnewsController", [
    "$scope", "$rootScope", "$routeParams", "$log", "$sce", "sessionService", "webService", "helperService", "$window", "authenticationService", "Notification",
function ($scope, $rootScope, $routeParams, $log, $sce, sessionService, webService, helperService, $window, authenticationService, Notification) {
    //#region [Field]
    $scope.htmlContent = undefined;
    var link = "";
    $scope.$p = $scope.$parent;
    if ($routeParams) {
        link = $routeParams.link;
    }
    //#endregion
    //#region [Layout]

    $scope.$p.resetLayout();
    $scope.$p.layoutFullBody = false;
    //#endregion

    //#region [Event]
    $scope.getTimeFormat = function (e) {
        return helperService.formatStortDate(e);
    }
    $scope.getNewsLink = function (link) {
        return "/detailnews/" + link;
    }

    $scope.getLinkShare = function (link) {
        return "/" + "/detailnews/" + link;
    }

    $scope.onLoadMainNews = function () {
        webService.call({
            name: "GetNewsDetailByLink",
            data: {
                actionUserId: $scope.$p.sessionService.userId(),
                link: link,
                key: $scope.$p.sessionService.key()
            },
            onSuccess: function (r) {
                console.log(r);
                $scope.newsId = r.Result.Id;
                $scope.title = r.Result.Title;
                $scope.description = r.Result.Summary;
                $scope.linkNews = r.Result.LinkNews;
                $scope.createDate = r.Result.CreateDate;
                $scope.photoImage = r.Result.LinkPhoto;

                $rootScope.DetailNewsTitle = r.Result.Title;
                $rootScope.DetailNewsUrl = +r.Result.LinkNews;
                $rootScope.DetailNewsImage = r.Result.LinkPhoto;
                r.Result.HtmlText = r.Result.HtmlText.replace(/\\r\\n/g, "");

                $scope.htmlContent = $sce.trustAsHtml($('<div/>').html(r.Result.HtmlText).text());

                webService.call({
                    name: "New_GetListNewsReference",
                    data: {
                        actionUserId: $scope.$p.sessionService.userId(),
                        categoryNewsId: 1,
                        newsId: $scope.newsId,
                        key: $scope.$p.sessionService.key()
                    },
                    onSuccess: function (rs) {
                        $scope.listNewsReference = rs.Items;
                        $scope.$apply();
                    }
                });

                if ($scope.newsId == 293) {
                    webService.call({
                        name: "User_GetDetails",
                        data: {
                            actionUserId: sessionService.userId(),
                            userId: 127479,
                            isStar: true,
                            key: sessionService.key()
                        },
                        onError: function (errorCode, message) {
                            $scope.starError = message;
                            $scope.starStatus = "error";
                            $scope.$apply();
                        },
                        onSuccess: function (r) {
                            $scope.rubuidoltrungthu = r.Result.UserStarData ? r.Result.UserStarData.CoinGetFromGift : undefined;
                            $scope.$apply();
                        }
                    });
                }
            }
        });

        webService.call({
            name: "New_GetListNews",
            data: {
                actionUserId: $scope.$p.sessionService.userId(),
                newsCategoryId: 2,
                pageIndex: 0,
                pageSize: 2,
                key: $scope.$p.sessionService.key()
            },
            onSuccess: function (rs) {
                $scope.listEvent = rs.Items
            }
        });
        webService.call({
            name: "List_SuggestStars",
            data: {
                createUserId: $scope.$p.sessionService.userId(),
                pageIndex: 0,
                pageSize: 2,
                getStarType: 1,
                key: $scope.$p.sessionService.key()
            },
            onSuccess: function (rs) {
                $scope.listShowItem = rs.Items;
                $scope.$apply();
            }
        });


    }


    $scope.onShareFacebook = function () {
        FB.ui({
            method: "feed",
            link: "https://teenidol.vn/detailnews/" + $scope.linkNews,
            picture: $scope.photoImage,
            name: $scope.title,
            description: $scope.description,
            caption: "",
            message: ""
        });
    };
    //#endregion

    //#region [Global Event]
    //trung thu

    $scope.liststatus = {
        quantitytrungthu: '500',
        data: [
         { id: 100, qualiti: 100 },
         { id: 300, qualiti: 300 },
         { id: 500, qualiti: 500 },
         { id: 999, qualiti: 1000 },
        ],
    }
    $scope.onSendRuByTrungThu = function () {
        if (!$scope.liststatus.quantitytrungthu) {
            Notification.error('Bạn chưa chọn số tiền khuyên góp');
            return;
        }

        if (!sessionService.isSigned()) {
            authenticationService.showModal({
                mode: "sign-in",
                message: "Bạn cần đăng nhập để sử dụng tính năng này"
            });
            return;
        }

        webService.call({
            type: "POST",
            name: "User_GiveAwayGiftEvent",
            data: {
                actionUserId: sessionService.userId(),
                giftId: 8,
                quantity: $scope.liststatus.quantitytrungthu * 1,
                scheduleId: "70294",
                starId: 127479,
                isInEvent: false,
                key: sessionService.key()
            },
            displayError: true,
            onError: function (errorCode, message) {
            },
            onSuccess: function (r) {
                Notification.success('Bạn vừa khuyên góp thành công');
                webService.call({
                    name: "User_GetDetails",
                    data: {
                        actionUserId: sessionService.userId(),
                        userId: 127479,
                        isStar: true,
                        key: sessionService.key()
                    },
                    onError: function (errorCode, message) {
                        $scope.starError = message;
                        $scope.starStatus = "error";
                        $scope.$apply();
                    },
                    onSuccess: function (r) {
                        $scope.rubuidoltrungthu = r.Result.UserStarData ? r.Result.UserStarData.CoinGetFromGift : undefined;
                        $scope.$apply();
                    }
                });
            }
        });
    }
    //#endregion

    //#region [On Load]
    sessionService.isReady(function () {
        $scope.onLoadMainNews();


        $($window).bind("scroll", function () {
            if (this.pageYOffset > 750) {
                $(".crolltop").css("position", "fixed");
                $(".crolltop").css("top", "0");
                $(".crolltop").css("width", "23.4%");
            } else {
                $(".crolltop").css("position", "relative");
                $(".crolltop").css("top", "0");
                $(".crolltop").css("width", "auto");
            }
        });
    });

    //#endregion
}
]);