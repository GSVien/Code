giasinhvienApp.directive("showMessage", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ShowMessage.html",
            scope: {
                listSentGift: "=",
                scheduleId: "@",
                starId: "@",
                showId: "@",
                message: "=",
            },
            controllerAs: "$ctrl",
            controller: ["$rootScope","$scope", "helperService", "sessionService", "webService",
                function ($rootScope,$scope, helperService, sessionService, webService) {

                    //#region [Field]
                    $scope.sessionService = sessionService;
                    //event
                    $scope.$on("User_GetNumberTurnRotation", function (event, data) {
                        $scope.numberTurnRotation = data.numberTurnRotation;
                    });

                    $rootScope.$on("User_GetUserGranary", function (event, data) {
                        $scope.numberUnit = data.numberUnit;
                    });

                    var SetUcControl = null;

                    SetUcControl = setInterval(function () {
                        if (
                            $(".uc-private-message").data("$ucPrivateMessageController") == undefined) {
                            return;
                        } else {
                            $scope.privateMessageCtrl = $(".uc-private-message").data("$ucPrivateMessageController");
                            clearInterval(SetUcControl);
                        }
                    }, 100);

                    $scope.helper = helperService;
                    $scope.privateMessagePanelIsSelected = false;
                    $scope.privateMessagePanel = false;
                    //#endregion


                    $scope.onPrivateMessagePanelDeselect = function () {
                        $scope.privateMessagePanelIsSelected = false;
                    };

                    $scope.onPrivateMessagePanelSelect = function () {
                        $scope.privateMessagePanelIsSelected = true;
                        //#region [Load Private Message]
                        if ($scope.privateMessageCtrl && $scope.privateMessagePanel === false) {
                            //#region [Load Private Message]
                            $scope.privateMessageCtrl.load([$scope.starId]);
                            $scope.privateMessagePanel = true;
                            //#endregion
                        }
                        //#endregion
                    };

                    $scope.$on("dropdownUser_onSendPrivateMessage", function (event, data) {
                        $scope.privateMessagePanelIsSelected = true;
                        $scope.onPrivateMessagePanelSelect();
                        $scope.privateMessageCtrl.addTarget(data.userData.User.Id, data.userData.User.Name, data.userData.User.AvatarPhoto);
                        var $list = $(".list-target");
                        //                        $list.scrollLeft($list[''].scrollWidth);
                        $("#dropdown-user-info").jqDropdown("hide");
                    });

                    //#region [Event]

                    //#endregion
                }
            ]
        };
    }
]);