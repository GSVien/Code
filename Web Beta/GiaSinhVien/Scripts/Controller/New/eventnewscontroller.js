teenidolApp.controller("eventnewsController", [
    "$scope", "$routeParams", "$log", "sessionService", "webService", "helperService",
    function ($scope, $routeParams, $log, sessionService, webService, helperService) {
        //#region [Field]

        $scope.$p = $scope.$parent;

        //$scope.setPage = function (pageNo) {
        //    $scope.currentPage = pageNo;
        //};

        //$scope.pageChanged = function () {
        //    $log.log('Page changed to: ' + $scope.currentPage);
        //};
        $scope.newsCategoryId = 2;

        $scope.pageIndex = 0;
        $scope.pageSize = 6;
        //#endregion
       //#region [Layout]

           $scope.$p.resetLayout();
           $scope.$p.layoutFullBody = false;
        //#endregion

        //#region [Event]
           $scope.getTimeFormat = function (e) {
               return helperService.formatStortDate(e)
           }

           $scope.getNewsLink = function (id) {
               return "/detailnews/" + id;
           }
           
        $scope.onLoadMainNews = function () {
            //webService.call({
            //    name: "New_GetListNewsCategory",
            //    data: {
            //        actionUserId: $scope.$p.sessionService.userId(),
            //        key: $scope.$p.sessionService.key()
            //    },
            //    onSuccess: function (r) {
            //        angular.forEach(r.Items, function (value, key) {
            //            if (value.NewsCategory.Name === 'Main') {
                            webService.call({
                                name: "New_GetListNews",
                                data: {
                                    actionUserId: $scope.$p.sessionService.userId(),
                                    newsCategoryId: $scope.newsCategoryId,
                                    pageIndex: $scope.pageIndex,
                                    pageSize: $scope.pageSize,
                                    key: $scope.$p.sessionService.key()
                                },
                                onSuccess: function (rs) {
                                    $scope.mainObject = rs.Items[0];
                                    $scope.listEvent = rs.Items.slice(1, 6);
                                    $scope.canNext = rs.PageIndex < rs.PageCount - 1;
                                    $scope.$apply();
                                }
                            });
                        //}
                        //if (value.NewsCategory.Name === 'Event') {
                            webService.call({
                                name: "New_GetListNews",
                                data: {
                                    actionUserId: $scope.$p.sessionService.userId(),
                                    newsCategoryId: 1,
                                    pageIndex: 0,
                                    pageSize: 2,
                                    key: $scope.$p.sessionService.key()
                                },
                                onSuccess: function (rs) {
                                    $scope.listNews = rs.Items;
                                    $scope.$apply();
                                }
                            });
                        //}
                    //});
                    webService.call({
                        name: "List_SuggestStars",
                        data: {
                            createUserId: $scope.$p.sessionService.userId(),
                            pageIndex:0,
                            pageSize:3,
                            getStarType:1,
                            key: $scope.$p.sessionService.key()
                        },
                        onSuccess: function (rs) {
                            $scope.listShowItem = rs.Items;
                            $scope.$apply();
                        }
                    });
                    
            //    }
            //});
        }

        $scope.onLoadNewsNext = function (e) {
            $scope.pageIndex = $scope.pageIndex + 1;


            //webService.call({
            //    name: "New_GetListNewsCategory",
            //    data: {
            //        actionUserId: $scope.$p.sessionService.userId(),
            //        key: $scope.$p.sessionService.key()
            //    },
            //    onSuccess: function (r) {
            //        angular.forEach(r.Items, function (value, key) {
            //            if (value.NewsCategory.Name === 'Main') {
                            webService.call({
                                name: "New_GetListNews",
                                data: {
                                    actionUserId: $scope.$p.sessionService.userId(),
                                    newsCategoryId: $scope.newsCategoryId,
                                    pageIndex: $scope.pageIndex,
                                    pageSize: $scope.pageSize,
                                    key: $scope.$p.sessionService.key()
                                },
                                onSuccess: function (rs) {
                                    $scope.listEvent = $scope.listEvent.concat(rs.Items);
                                    $scope.canNext = rs.PageIndex < rs.PageCount - 1;
                                    $scope.$apply();
                                }
                            });
                    //    }
                    //});
                    
            //    }
            //});
        };
        //#endregion

        //#region [Global Event]

        //#endregion

        //#region [On Load]
        sessionService.isReady(function () {
            $scope.onLoadMainNews();
        });
        //#endregion
    }
]);