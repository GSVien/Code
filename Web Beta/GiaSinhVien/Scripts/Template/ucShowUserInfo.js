giasinhvienApp.directive("ucShowUserInfo", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ucShowUserInfo.html",
            scope: {
                isFullscreen: "=",
                onShowChanged: "&",
                starId:"@"
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "sessionService", "modalService", "$rootScope", "helperService",
                function ($scope, sessionService, modalService, $rootScope, helperService) {
                    //#region [Field]

                    $scope.sessionService = sessionService;
                    $scope.helper = helperService;
                    //#endregion

                    //#region [Event]

                    $scope.onLogin = function ($event) {
                        $rootScope.$broadcast("onLogin");
                    };

                    $scope.onLogout = function (event) {
                        $rootScope.$broadcast("onLogout");
                    }

                    $scope.onShowReport = function (starId) {
                        $('head').append('<script src="App_Lib/html2canvas-0.5.0-alpha1/html2canvas.min.js"></script>');
                        modalService.showReport({
                            data: {
                                starId: starId,
                            }
                        });
                    }

                    $scope.onUserMission = function () {
                        $rootScope.$broadcast("onUserMission");
                    }
                    $scope.onUserMission = function () {
                        $rootScope.$broadcast("onUserMission");
                    }
                    $scope.onUserDayCheck = function () {
                        $rootScope.$broadcast("onUserDayCheck");
                    }
                    //#endregion
                }
            ]
        };
    }
]);