giasinhvienApp.controller("productController", [
    "$scope", "$rootScope", "$routeParams", "$log", "$sce", "sessionService", "webService", "helperService", "$window", "authenticationService", "Notification",
function ($scope, $rootScope, $routeParams, $log, $sce, sessionService, webService, helperService, $window, authenticationService, Notification) {
    //#region [Field]
    $scope.htmlContent = undefined;
    $scope.productId = undefined;
    $scope.pageSizeSimilarProduct = 8;
    $scope.$p = $scope.$parent;
    if ($routeParams) {
        $scope.productId = $routeParams.id;
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

    $scope.onLoadMainProduct = function () {
        webService.call({
            name: "GetInfoProductModel",
            data: {
                actionUserId: 1,
                id: $scope.productId
            },

            onError: function (errorCode, message) {
            },

            onSuccess: function (r) {
                $scope.district = r.Items[0].District.Name;
                $scope.province = r.Items[0].Province.Name;
                $scope.category = r.Items[0].ProductCategory.Name;

                $scope.productTitle = r.Items[0].Product.Title;
                $scope.description = r.Items[0].Product.Description;
                $scope.createDate = r.Items[0].Product.CreateDate;
                $scope.price = r.Items[0].Product.Price;
                $scope.productaddrress = r.Items[0].District.Name + ' ' + r.Items[0].Province.Name;
                $scope.createdate = r.Items[0].Product.CreateDate;

                $scope.userphoto = r.Items[0].UserInfo.AvatarPhoto;
                $scope.username = r.Items[0].UserInfo.UserName;
                $scope.userphone = r.Items[0].UserInfo.Phone;
                $scope.userdate = r.Items[0].UserInfo.CreateDate;


                $scope.onLoadSimilarProductData();

                if (!$scope.$$phase) $scope.$apply();
            },
        });
    }

    $scope.onLoadSimilarProductData = function () {
        webService.call({
            name: "GetListProductModel",
            data: {
                actionUserId: 1,
                pageIndex: 0,
                pageSize: $scope.pageSizeSimilarProduct
            },

            onError: function (errorCode, message) {
            },

            onSuccess: function (r) {
                $scope.ListSimilarProduct = r.Items;
                if (!$scope.$$phase) $scope.$apply();
            },
        });
    };

    $scope.viewShowMore = function () {
        $scope.pageSizeSimilarProduct += 8;
        $scope.onLoadSimilarProductData();
    }
    
    //#endregion

    //#region [On Load]
    sessionService.isReady(function () {
        $scope.onLoadMainProduct();


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