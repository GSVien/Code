giasinhvienApp.controller("userinboxController", [
    "$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService) {

        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.IdUserSession = $scope.$p.sessionService.userId();
        if ($routeParams) {
            userId = $routeParams.id;
        }
        //#endregion

        //#region [Layout]

        $scope.$p.layoutShowHeader = true;
        $scope.$p.layoutShowFooter = true;
        $scope.$p.layoutShowBanner = true;
        $scope.$p.layoutFullBody = true;

        //#endregion

        //#region [Event]

        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
        });
        //#endregion
    }
]);