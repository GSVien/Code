giasinhvienApp.controller("modalShowScheduleController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "helperService",
    function ($scope, $uibModalInstance, data, sessionService, webService, helperService) {
        //#region [Field]
        $scope.data = data.data;
        $scope.showSchedule = {
            currentStatus: "loading",
            currentError: undefined,
            listCurrent: undefined,

            otherStatus: "loading",
            otherError: undefined,
            listOther: undefined
        };
        $scope.helper = helperService;
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onShowSchedule = function () {
            var now = new Date();
            var startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
            var d = now.getDate();
            webService.call({
                name: "Star_GetListShowTime",
                data: {
                    actionUserId: sessionService.userId(),
                    starId: $scope.data.starId,
                    pageIndex: 0,
                    pageSize: 999999,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showSchedule.currentStatus = "error";
                    $scope.showSchedule.currentError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.showSchedule.listCurrent = [[], []];

                    $(r.Items).each(function (i, x) {
                        var startTime = new Date(x.StarSchedule.StartTime);
                        var l = (startTime.getUTCDate() === d) ? $scope.showSchedule.listCurrent[0] : $scope.showSchedule.listCurrent[1];

                        if (!l[startTime.getUTCHours()]) {
                            l[startTime.getUTCHours()] = {
                                startTime: x.StarSchedule.StartTime,
                                endTime: x.StarSchedule.EndTime,
                            };
                        }
                    });
                    $scope.showSchedule.currentStatus = "loaded";
                    $scope.$apply();
                }
            });

            webService.call({
                name: "List_ShowSchedule",
                data: {
                    actionUserId: sessionService.userId(),
                    startTime: startTime.getTime(),
                    endTime: endTime.getTime(),
                    pageIndex: 0,
                    pageSize: 999999,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showSchedule.otherStatus = "error";
                    $scope.showSchedule.otherError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.showSchedule.listOther = [[], []];

                    $(r.Items).each(function (i, x) {
                        var startTime = new Date(x.Schedule.StartTime);
                        var l = (startTime.getUTCDate() === d) ? $scope.showSchedule.listOther[0] : $scope.showSchedule.listOther[1];
                        l.push(x);
                    });

                    $scope.showSchedule.otherStatus = "loaded";
                    $scope.$apply();

                    $("#modal-show-schedule-other a[data-toggle='tab']").on("shown.bs.tab", function (e) {
                        $("#modal-show-schedule-other .photo img").imageScale();
                    });
                }
            });
        };
        sessionService.isReady(function () {
            $scope.onShowSchedule();
            $(".modal-show-schedule").on("shown.bs.modal", $scope.onShowSchedule);
        })
        //#endregion
    }
])