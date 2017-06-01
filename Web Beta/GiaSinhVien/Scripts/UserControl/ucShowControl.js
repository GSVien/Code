giasinhvienApp.directive("ucShowControl", [
    "helperService", "sessionService", "webService", "modalService", "Notification",
    function (helperService, sessionService, webService, modalService, Notification) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;
            $scope.status = "loading";
            $scope.showId = undefined;
            $scope.showStatus = undefined;
            $scope.showName = undefined;
            $scope.showDescription = undefined;
            $scope.showPhoto = undefined;

            //#endregion

            //#region [Method]

            this.load = function (showId, showStatus, showName, showDescription, showPhoto) {
                $scope.showId = showId;
                $scope.showStatus = showStatus;
                $scope.showName = showName;
                $scope.showDescription = showDescription;
                $scope.showPhoto = showPhoto;
                $(".image-cropper").cropit({ imageBackground: true });
                $scope.status = "loaded";
                $scope.$apply();
            };

            //#endregion

            //#region [Event]

            $scope.onStartShow = function ($event) {
                modalService.showAlert({
                    title: "Bắt đầu diễn",
                    message: "Bạn đã sẵn sàng để diễn?",
                    buttons: [
                        { text: "Không", style: "btn-default", closeModal: true, },
                        {
                            text: "Có",
                            style: "primary",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "Show_StartShow",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onSuccess: function (r) {
                                        $scope.showStatus = 2;
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onStopShow = function ($event) {
                modalService.showAlert({
                    title: "Bắt đầu diễn",
                    message: "Bạn muốn kết thúc show diễn?",
                    buttons: [
                        { text: "Không", style: "btn-default", closeModal: true },
                        {
                            text: "Có",
                            style: "btn-primary",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "Show_EndShow",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onSuccess: function (r) {
                                        $scope.showStatus = 3;
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onPauseShow = function ($event) {
                modalService.showAlert({
                    title: "Bắt đầu diễn",
                    message: "Bạn muốn tạm ngưng diễn?",
                    buttons: [
                        { text: "Không", style: "default", closeModal: true },
                        {
                            text: "Có",
                            style: "primary",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "Show_PauseShow",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onSuccess: function (r) {
                                        $scope.showStatus = 1;
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onUploadImage = function ($event) {
                $element.find(".image-cropper .cropit-image-input.hidden").trigger("click");
            };

            $scope.onEditShow = function ($event) {

                var $target = $($event.target);
                var $button = $target.find("[type=submit]");

                //                if (formService.isLoading($button))
                //                    return;
                $button.button("loading");
                if (!$scope.showName || !$scope.showDescription) {
                    if ($scope.showName) {
                        Notification.error("Bạn chưa nhập tên show");
                    }
                    if ($scope.showDescription) {
                        Notification.error("Bạn chưa nhập mô tả show");
                    }
                    $button.button("reset");
                    return;
                }
                //                if (!formService.validate({
                //                    target: $button,
                //                    rule: [
                //                        {
                //                    check: function () {
                //                                return isNoUoW($scope.showName) === false;
                //                },
                //                    message: "Bạn chưa nhập tên show."
                //                },
                //                        {
                //                    check: function () {
                //                                return isNoUoW($scope.showDescription) === false;
                //                },
                //                    message: "Bạn chưa nhập mô tả show."
                //                }
                //                ]
                //                })) {
                //                    $button.button("reset");
                //                    return;
                //                };

                //#region [Edit status]

                webService.call({
                    type: "POST",
                    name: "Show_UpdateDescription",
                    data: {
                        showId: $scope.showId,
                        actionUserId: sessionService.userId(),
                        scheduleId: $scope.scheduleId,
                        name: $scope.showName,
                        content: $scope.showDescription,
                        key: sessionService.key()
                    },
                    displayError: true,
                    onError: function () {
                        $button.button("reset");
                    },
                    onSuccess: function (r) {
                        $button.button("reset");
                    }
                });

                //#endregion

                //#region [Edit show photo]

                var img = $element.find(".image-cropper").cropit("export", {
                    type: "image/jpeg",
                    quality: 1,
                    originalSize: true
                });

                if (img) {
                    webService.call({
                        type: "POST",
                        name: "User_UploadPhoto",
                        data: {
                            actionUserId: sessionService.userId(),
                            base64Photo: img.substring(23),
                            key: sessionService.key()
                        },
                        displayError: true,
                        onError: function() {
                            $button.button("reset");
                        },
                        onSuccess: function(imgLink) {
                            webService.call({
                                type: "POST",
                                name: "Show_UpdatePhoto",
                                data: {
                                    showId: $scope.showId,
                                    actionUserId: sessionService.userId(),
                                    scheduleId: $scope.scheduleId,
                                    photoLink: imgLink.Result,
                                    key: sessionService.key()
                                },
                                displayError: true,
                                onError: function() {
                                    $button.button("reset");
                                },
                                onSuccess: function(r) {
                                    $button.button("reset");
                                    $("#modal-edit-show").modal("hide");
                                }
                            });
                        }
                    });
                } else {
                    $("#modal-edit-show").modal("hide");
                }

                //#endregion
            };

            //#endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "/Views/UserControl/ucShowControl.html",
            controller: controller
        };
    }
]);