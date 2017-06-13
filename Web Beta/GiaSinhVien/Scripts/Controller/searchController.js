giasinhvienApp.controller("searchController", [
    "$scope", "$rootScope", "$routeParams", "$location", "$http", "webService", "authenticationService", "modalService", "formService",
    function ($scope, $rootScope,$routeParams, $location, $http, webService, authenticationService, modalService, formService) {
        //#region [Field]
        var now = new Date();
        var endyear = now.getTime();
        $scope.stringText = undefined;
        $scope.categoryId = undefined;
        $scope.proviceId = undefined;
        $scope.$p = $scope.$parent;
        $scope.pageSizeProduct = 16;

        if ($routeParams) {
            $scope.stringText = $routeParams.keystring;
            $("#searchValue").val($scope.stringText);
        }

        
        //#endregion

        //#region [Layout]
        $scope.$p.resetLayout();
        $scope.$p.layoutFullBody = true;
        //#endregion

        //#region [Event]


        $scope.OnSelectProvice = function(id) {
                $scope.proviceId = id;
        };


        $scope.OnSelectCategory = function (id) {
                $scope.categoryId = id;
        };

        $scope.onLoadProvince = function () {
            webService.call({
                name: "GetAllProvince",
                data: {
                    key: 1
                },

                onError: function (errorCode, message) {
                },

                onSuccess: function (r) {
                    $scope.ListProvince = r.Result;
                    if (!$scope.$$phase) $scope.$apply();
                },
            });
        };

        $scope.onLoadCategory = function () {
            webService.call({
                name: "GetListCategory",
                data: {
                    key: 1
                },

                onError: function (errorCode, message) {
                },

                onSuccess: function (r) {
                    $scope.ListCategory = r.Result;
                    if (!$scope.$$phase) $scope.$apply();
                },
            });
        };

        $scope.onLoadProductData = function () {
            webService.call({
                name: "GetListProductModel",
                data: {
                    actionUserId: 1,
                    pageIndex: 0,
                    pageSize: $scope.pageSizeProduct,
                    str_Name: $("#searchValue").val(),
                    num_CategoryId: $scope.categoryId,
                    num_ProviceId: $scope.proviceId
                },

                onError: function (errorCode, message) {
                },

                onSuccess: function (r) {
                    $scope.ListProduct = r.Items;
                    if (!$scope.$$phase) $scope.$apply();
                },
            });
        };

        $scope.viewShowMore = function() {
            $scope.pageSizeProduct += 16;
            $scope.onLoadProductData();
        }

        //#endregion

        //#region [Global Event]

        $rootScope.$on("authentication_onSignIn", function () {
            $scope.onLoadProductData();
        });

        $rootScope.$on("authentication_onSignOut", function () {
            $scope.onLoadProductData();
        });

        //#endregion

        //#region [On Load]
        $scope.$on("$viewContentLoaded", function () {


            //$("body").css("background-image", "url('/Content/Image/Background-home/home.png')");

            $scope.onLoadProductData();
            $scope.onLoadProvince();
            $scope.onLoadCategory();

            //load meta seo data
            $("meta[name='title']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='keywords']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='description']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");


        });

        //#endregion
    }
]);