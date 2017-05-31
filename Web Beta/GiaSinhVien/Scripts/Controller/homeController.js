giasinhvienApp.controller("homeController", [
    "$scope", "$rootScope", "$location", "$http", "sessionService", "webService", "authenticationService", "modalService", "formService", function ($scope, $rootScope, $location, $http, sessionService, webService, authenticationService, modalService, formService) {
        //#region [Field]
        var now = new Date();
        var endyear = now.getTime();

        $scope.$p = $scope.$parent;
        $scope.listSuggestStar = undefined;
        $scope.suggestCarouselIndex = undefined;
        $scope.topView = undefined;
        $scope.topHot = undefined;
        $scope.follow = undefined;
        $scope.recent = undefined;
        $scope.rank = [
    {
        title: "Top 5 idol hot",
        link: "/rank",
        functionName: "List_ListTopStar",
        pointType: "coin-star",
        getPoint: function (x) {
            return x.TotalSumValue;
        },
        list: [
        {
            title: "Tuần",
            fromTime: moment().startOf("week").valueOf(),
            toTime: moment().endOf("week").valueOf(),
            status: "loading",
            message: undefined,
            list: []
        },
        {
            title: "Tháng",
            fromTime: moment().startOf("month").valueOf(),
            toTime: moment().endOf("month").valueOf(),
            status: "loading",
            message: undefined,
            list: []
        },
        {
            title: "Tất cả",
            fromTime: -1,
            toTime: endyear,
            status: "loading",
            message: undefined,
            list: []
        }]
    },
    {
        title: "Top 5 idol yêu thích",
        link: "/rank",
        functionName: "List_ListTopStarByFreeCoin",
        pointType: "free-coin",
        getPoint: function (x) {
            return x.TotalSumValue;
        },
        list: [
        {
            title: "Tuần",
            fromTime: moment().startOf("week").valueOf(),
            toTime: moment().endOf("week").valueOf(),
            status: "loading",
            message: undefined,
            list: []
        },
        {
            title: "Tháng",
            fromTime: moment().startOf("month").valueOf(),
            toTime: moment().endOf("month").valueOf(),
            status: "loading",
            message: undefined,
            list: []
        },
        {
            title: "Tất cả",
            fromTime: -1,
            toTime: -1,
            status: "loading",
            message: undefined,
            list: []
        }]
    },
    {
        title: "Top 5 thành viên",
        link: "/rank",
        functionName: "List_ListTopUser",
        pointType: "coin",
        getPoint: function (x) {
            return x.TotalSumValue;
        },
        list: [
        {
            title: "Tuần",
            fromTime: moment().startOf("week").valueOf(),
            toTime: moment().endOf("week").valueOf(),
            status: "loading",
            message: undefined,
            list: []
        },
        {
            title: "Tháng",
            fromTime: moment().startOf("month").valueOf(),
            toTime: moment().endOf("month").valueOf(),
            status: "loading",
            message: undefined,
            list: []
        },
        {
            title: "Tất cả",
            fromTime: -1,
            toTime: -1,
            status: "loading",
            message: undefined,
            list: []
        }]
    }];
        //#endregion

        //#region [Layout]
        $scope.$p.resetLayout();
        $scope.$p.layoutFullBody = true;
        //#endregion

        //#region [Event]

        $scope.onLoadSuggestStar = function () {
            webService.call({
                name: "List_SuggestStars",
                data: {
                    createUserId: $scope.$p.sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 6,
                    getStarType: 5,
                    key: $scope.$p.sessionService.key()
                },

                onSuccess: function (r) {
                    var array = r.Items;
                    array.pop();
                    array.unshift({
                        Show: {
                            LinkBaner: "/Content/Image/tuyendungidol.jpg",
                            OnlineUser: "333",
                            Id: undefined,
                            Description: "",
                            Photo: "",
                        },
                        ListShow: [
                            {
                                StarUser: { Name: "Casting" },

                            }],
                    });

                    $scope.listSuggestStar = array;
                    $scope.listscheduleId = '';
                    $scope.$apply();
                }
            });
        };

        $scope.onSuggestStarListItemSelect = function (e) {
            var $target = $(e.target).closest("li");
            $scope.suggestCarouselIndex = $target.data("index");

        };

        $scope.onLoadStarPanel = function () {
            var currentTab = $(".star-panel .tab-pane.active").attr("id");
            var getType;

            switch (currentTab) {
                default:
                case "top-view":
                    if ($scope.topView)
                        return;

                    $scope.topView = {};
                    getType = 2;
                    break;

                case "top-hot":
                    if ($scope.topHot)
                        return;

                    $scope.topHot = {};
                    getType = 1;
                    break;

                case "follow":
                    if (!sessionService.isSigned()) {
                        $scope.follow = undefined;
                        return;
                    }

                    if ($scope.follow)
                        return;

                    $scope.follow = {};
                    getType = 3;
                    break;

                case "recent":
                    if (!sessionService.isSigned()) {
                        $scope.recent = undefined;
                        return;
                    }

                    if ($scope.recent)
                        return;

                    $scope.recent = {};
                    getType = 4;
                    break;
            }

            webService.call({
                name: "List_SuggestStars",
                data: {
                    createUserId: $scope.$p.sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 20,
                    getStarType: getType,
                    key: $scope.$p.sessionService.key()
                },
                onSuccess: function (r) {
                    switch (currentTab) {
                        default:
                        case "top-view":
                            $scope.topView.pageIndex = r.PageIndex;
                            $scope.topView.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.topView.listItem = r.Items;
                            break;

                        case "top-hot":
                            $scope.topHot.pageIndex = r.PageIndex;
                            $scope.topHot.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.topHot.listItem = r.Items;
                            break;

                        case "follow":
                            $scope.follow.pageIndex = r.PageIndex;
                            $scope.follow.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.follow.listItem = r.Items;
                            break;

                        case "recent":
                            $scope.recent.pageIndex = r.PageIndex;
                            $scope.recent.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.recent.listItem = r.Items;
                            break;
                    }

                    $scope.$apply();
                }
            });
        };

        $scope.onStarPanelNext = function (e) {
            var $target = $(e.target).closest("button");

            if (formService.isLoading($target))
                return;
            $target.button("loading");

            var currentTab = $(".star-panel .tab-pane.active").attr("id");
            var nextPageIndex;
            var getType;

            switch (currentTab) {
                default:
                case "top-view":
                    nextPageIndex = $scope.topView.pageIndex + 1;
                    getType = 2;
                    break;

                case "top-hot":
                    nextPageIndex = $scope.topHot.pageIndex + 1;
                    getType = 1;
                    break;

                case "follow":
                    nextPageIndex = $scope.follow.pageIndex + 1;
                    getType = 3;
                    break;

                case "recent":
                    nextPageIndex = $scope.recent.pageIndex + 1;
                    getType = 4;
                    break;
            }

            webService.call({
                name: "List_SuggestStars",
                data: {
                    createUserId: $scope.$p.sessionService.userId(),
                    pageIndex: nextPageIndex,
                    pageSize: 20,
                    getStarType: getType,
                    key: $scope.$p.sessionService.key()
                },
                onError: function () {
                    $target.button("reset");
                },
                onSuccess: function (r) {
                    $target.button("reset");

                    switch (currentTab) {
                        default:
                        case "top-view":
                            $scope.topView.pageIndex = r.PageIndex;
                            $scope.topView.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.topView.listItem = $scope.topView.listItem.concat(r.Items);
                            break;

                        case "top-hot":
                            $scope.topHot.pageIndex = r.PageIndex;
                            $scope.topHot.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.topHot.listItem = $scope.topHot.listItem.concat(r.Items);
                            break;

                        case "follow":
                            $scope.follow.pageIndex = r.PageIndex;
                            $scope.follow.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.follow.listItem = $scope.follow.listItem.concat(r.Items);
                            break;

                        case "recent":
                            $scope.recent.pageIndex = r.PageIndex;
                            $scope.recent.canNext = r.PageIndex < r.PageCount - 1;
                            $scope.recent.listItem = $scope.recent.listItem.concat(r.Items);
                            break;
                    }

                    $scope.$apply();
                }
            });
        };

        $scope.onLoadNewsBanner = function () {
            webService.call({
                name: "Config_GetConfig",
                data: {
                    actionUserId: sessionService.userId(),
                    value: "NewsImageLink",
                    key: sessionService.key()
                },
                onSuccess: function (imgConfig) {
                    webService.call({
                        name: "Config_GetConfig",
                        data: {
                            actionUserId: sessionService.userId(),
                            value: "NewsRedirectLink",
                            key: sessionService.key()
                        },
                        onSuccess: function (linkConfig) {
                            if (linkConfig && linkConfig.Result && linkConfig.Result.Value) {
                                if (imgConfig && imgConfig.Result && imgConfig.Result.Value)
                                    $scope.newBannerImg = imgConfig.Result.Value;
                                else
                                    $scope.newBannerImg = "";
                                $scope.newBannerLink = linkConfig.Result.Value;

                                if ($scope.newBannerImg && $scope.newBannerLink)
                                    modalService.showBannerEvent({
                                        data: {
                                            newBannerLink: $scope.newBannerLink,
                                            newBannerImage: $scope.newBannerImg,
                                        }
                                    });
                            }
                        }
                    });
                }
            });
        }

        $scope.onLoadRank = function (table, time) {
            if (time.list.length > 0)
                return;

            webService.call({
                name: table.functionName,
                data: {
                    currentUserId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 5,
                    firstTime: time.fromTime,
                    endTime: time.toTime,
                    key: sessionService.key()
                },
                onError: function (msg) {
                    time.status = "error";
                    time.message = msg;
                },
                onSuccess: function (r) {

                    time.list = r.Items;

                    if (!time.list || time.list.length === 0) {
                        time.status = "warning";
                        time.message = "Hiện chưa có dữ liệu";
                    } else {
                        time.status = "loaded";
                    }
                }
            });
        };
        //#endregion

        //#region [Global Event]

        $rootScope.$on("authentication_onSignIn", function () {
            $scope.onLoadStarPanel();
        });

        $rootScope.$on("authentication_onSignOut", function () {
            $scope.onLoadStarPanel();
        });

        //#endregion

        //#region [On Load]
        $scope.$on("$viewContentLoaded", function () {

            $scope.onLoadNewsBanner();

            $("body").css("background-image", "url('/Content/Image/Background-home/home.png')");
            $scope.onLoadSuggestStar();

            $(".star-panel a[data-toggle='tab']").on("shown.bs.tab", function (e) {
                $scope.onLoadStarPanel();
            });
            $(".star-panel .active a[data-toggle='tab']").trigger("shown.bs.tab");
            $(".rank-table .active a[data-toggle='tab']").trigger("shown.bs.tab");
            //load meta seo data
            $("meta[name='title']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='keywords']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='description']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");


        });

        //#endregion
    }
]);