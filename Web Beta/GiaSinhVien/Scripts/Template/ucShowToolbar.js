teenidolApp.directive("ucShowToolbar", [
    "helperService", function (helperService) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            templateUrl: "/Layouts/Template/ucShowToolbar.html",
            scope: {
                scheduleId: "@",
                showId: "@",
                starId: "@",
                hideDirection: "@",
                isMobile: "=",
                onHide: "&",
                onShowTabUser: "&",
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "sessionService", "modalService", "$rootScope", "helperService",
                function ($scope, sessionService, modalService, $rootScope, helperService) {
                    $scope.onShowRank = function() {
                        modalService.showShowRank({
                            data: {
                                scheduleId: $scope.scheduleId,
                                showId: $scope.showId,
                                starId: $scope.starId,
                            },
                        });
                    };
                    $scope.onShowOpening = function () {
                        modalService.showShowOpening({
                            data: {
                                scheduleId: '',
                                showId: '',
                                starId: '',
                            },
                        });
                    }
                    $scope.onShowSchedule = function() {
                        modalService.showShowSchedule({
                            data: {
                                starId: $scope.starId,
                            },
                        });
                    };
                }],
        };
    }
]);