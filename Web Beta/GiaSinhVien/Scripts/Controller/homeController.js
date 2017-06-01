giasinhvienApp.controller("homeController", [
    "$scope", "$rootScope", "$location", "$http", "webService", "authenticationService", "modalService", "formService",
    function ($scope, $rootScope, $location, $http, webService, authenticationService, modalService, formService) {
        //#region [Field]
        var now = new Date();
        var endyear = now.getTime();

        $scope.$p = $scope.$parent;
        $scope.listSuggestStar = undefined;
        $scope.suggestCarouselIndex = undefined;

        $scope.recent = undefined;
        //#endregion

        //#region [Layout]
        $scope.$p.resetLayout();
        $scope.$p.layoutFullBody = true;
        //#endregion

        //#region [Event]


        $scope.onLoadStarPanel = function () {

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


            $("body").css("background-image", "url('/Content/Image/Background-home/home.png')");

            $scope.onLoadStarPanel();


            //load meta seo data
            $("meta[name='title']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='keywords']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='description']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");


        });

        //#endregion
    }
]);