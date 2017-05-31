teenidolApp.directive("ucFollowButton", [
    function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                status: "@",
                targetUserId: "@"
            },
            templateUrl: "/Views/UserControl/ucFollowButton.html",
            controllerAs: "$ctrl",
            controller: ["$scope", "webService", "sessionService", "authenticationService", "Notification",
                function ($scope, webService, sessionService, authenticationService, Notification) {
                    $scope.showIt = function () {
                        $(event.target).closest('.uc-follow-button.followed .fa').addClass('fa-remove');
                        $(event.target).closest('.uc-follow-button.followed').removeClass('followed');
                    };
                    // mouseleave event
                    $scope.hideIt = function () {
                        $(event.target).closest('.uc-follow-button .fa-check').removeClass('fa-remove');
                        $(event.target).closest('.uc-follow-button').addClass('followed');
                    };
                    $scope.Follow = function (event) {
                        if ($(event).hasClass("loading"))
                            return;

                        if (!sessionService.isSigned()) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: "Bạn cần đăng nhập để sử dụng tính năng này"
                            });
                            return;
                        }

                        $(event).addClass("loading");
                        webService.call({
                            type: "POST",
                            name: "User_FollowUser",
                            data: {
                                currentUserId: sessionService.userId(),
                                followUserId: $scope.targetUserId,
                                isFollow: $scope.status != 1,
                                key: sessionService.key()
                            },
                            displayError: true,
                            onError: function () {
                                $(event).removeClass("loading");
                            },
                            onSuccess: function (r) {
                                $(event).removeClass("loading");

                                if ($scope.status != 1) {
                                    Notification.success("Đã theo dõi");
                                    $scope.status = 1;

                                } else {
                                    Notification.success("Đã hủy theo dõi");
                                    $scope.status = 0;
                                }

                                showController.onUpdateEventNoel();
                                //webService.call({
                                //    name: "Star_GetInfoMissionNoel",
                                //    type: "get",
                                //    data: {
                                //        actionUserId: sessionService.userId(),
                                //        pageIndex: 0,
                                //        pageSize: 1,
                                //        startDate: 1482724800000,
                                //        endDate: 1483203600000,
                                //        starId: $scope.targetUserId,
                                //        key: sessionService.key(),
                                //    },
                                //    onError: function (error, msg) {
                                //        Notification.error(error);
                                //    },
                                //    onSuccess: function (rs) {
                                //        $scope.InfoEventNoel = {
                                //            eventNoel: rs.IsStarEvent,
                                //            InfoEventNoel: rs
                                //        }
                                //        //$rootScope.$broadcast("onDoneMissionIdol");
                                //    },
                                //});
                                if (!$scope.$$phase) $scope.$apply();
                            }
                        });
                    };
                }],
            link: function(scope, element, attrs) {}
        };
    }
]);