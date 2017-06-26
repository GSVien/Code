giasinhvienApp.controller("searchController", [
    "$window", "$scope", "$rootScope", "$routeParams", "$location", "$http", "webService", "authenticationService", "modalService", "formService",
    function ($window,$scope, $rootScope, $routeParams, $location, $http, webService, authenticationService, modalService, formService) {
        //#region [Field]
        var now = new Date();
        var endyear = now.getTime();
        $scope.stringText = undefined;
        $scope.linkProvice = undefined;
        $scope.linkCategory = undefined;
        $scope.categoryId = undefined;
        $scope.proviceId = undefined;
        $scope.province = undefined;
        $scope.category = undefined;
        $scope.$p = $scope.$parent;
        $scope.pageSizeProduct = 16;

        if ($routeParams) {
            if ($routeParams.keystring) {
                $scope.stringText = $routeParams.keystring;
                $("#searchValue").val($scope.stringText);
            }
            if ($routeParams.keyProvice) {
                $scope.linkProvice = $routeParams.keyProvice;
                webService.call({
                    name: "GetProviveByLink",
                    data: {
                        link: $scope.linkProvice
                    },

                    onError: function (errorCode, message) {
                    },

                    onSuccess: function (r) {
                        if (r.Result) {
                            $scope.province = r.Result;
                            $scope.proviceId = $scope.province.Id;
                            if ($routeParams.keyCategory) {
                                $scope.linkCategory = $routeParams.keyCategory;
                                webService.call({
                                    name: "GetCategoryByLink",
                                    data: {
                                        link: $scope.linkCategory
                                    },

                                    onError: function(errorCode, message) {
                                    },

                                    onSuccess: function(rs) {
                                        if (rs.Result) {
                                            $scope.category = rs.Result;
                                            $scope.categoryId = $scope.category.Id;
                                            //$scope.OnSelectCategory($scope.category.Id, $scope.category);
                                            $("#sp-menu2").html($scope.category.Name);
                                            $("#sp-menu1").html($scope.province.Name);
                                            if (!$scope.$$phase) $scope.$apply();
                                        }
                                    },
                                });
                            } else {
                                //$scope.OnSelectProvice($scope.province.Id, $scope.province);
                                $("#sp-menu1").html($scope.province.Name);
                            }
                        } else {
                            $window.location.href = '/Search/';
                        }
                        $scope.onLoadProductData();
                        if (!$scope.$$phase) $scope.$apply();
                    },
                });


            }

        }


        //#endregion

        //#region [Layout]
        $scope.$p.resetLayout();
        $scope.$p.layoutFullBody = true;
        //#endregion

        //#region [Event]


        $scope.OnSelectProvice = function (id,o) {
            $scope.proviceId = id;
            if (o) {
                $scope.province = o;
                if (!$scope.$$phase) $scope.$apply();
            }
            $scope.onLoadProductData();
        };


        $scope.OnSelectCategory = function (id,o) {
            $scope.categoryId = id;
            if (o) {
                $scope.category = o;
                if (!$scope.$$phase) $scope.$apply();
            }
            $scope.onLoadProductData();
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

        $scope.viewShowMore = function () {
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

            $('.dropdown-menu').on('click', 'a', function () {
                var text = $(this).html();
                var htmlText = text + ' <span class="caret"></span>';
                $(this).closest('.dropdown').find('.dropdown-toggle').html(htmlText);
            });

        });

        //#endregion
    }
]);