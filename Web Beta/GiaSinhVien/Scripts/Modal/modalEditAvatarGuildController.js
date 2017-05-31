teenidolApp.controller("modalEditAvatarGuildController", ["$scope", "$rootScope", "$uibModalInstance", "sessionService", "webService", "data", "Notification",
    function ($scope, $rootScope, $uibModalInstance, sessionService, webService, data, Notification) {
        //#region [Field]
        $scope.uploadavatarguild = {
            linkPhoto: undefined,
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        $scope.UploadImage = function () {
            $('.image-cropper .cropit-image-input.hidden').trigger('click');
        }
        if (data.icongiatoc) {
            $scope.title = "Thay đổi icon gia tộc";
            $scope.class = 'icon';
        } else {
            $scope.title = "Thay đổi ảnh gia tộc";
        }
        $scope.EditAvarta = function () {
            if (data.icongiatoc) {
                var img = $scope.uploadavatarguild.linkPhoto;
                if (img) {
                    var file_data = $('#icon-gia-toc');
                    var f = file_data.prop('files')[0];
                    if (f) {
                        var Nameicon = f.name;
                    } else {
                        Notification.error("Vui lòng chọn lại icon gia tộc !");
                        return;
                    }
                    var res = img.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                    webService.call({
                        type: "POST",
                        name: "User_UploadFile",
                        data: {
                            actionUserId: sessionService.userId(),
                            base64Photo: res,
                            name: Nameicon,
                            key: sessionService.key(),
                        },
                        displayError: true,
                        onSuccess: function (r) {
                            $scope.url = r.Result;
                            if (r.ErrorCode == null) {
                                webService.call({
                                    type: "POST",
                                    name: "User_UpdateGuild",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        guildId: sessionService.data().user.Guild.Id,
                                        name: null,
                                        description: null,
                                        photolink: null,
                                        avatar: $scope.url,
                                        key: sessionService.key(),
                                    },
                                    onError: function(err, msg) {
                                        Notification.error(err);
                                    },
                                    onSuccess: function(a) {
                                        $rootScope.$broadcast("editiconguild", { Items: a.Result });
                                        Notification.success("Đổi icoin Gia Tộc Thành Công !");
                                        $uibModalInstance.dismiss();
                                        $scope.$apply();
                                    }
                                });
                            } else {
                                Notification.error("Bạn chưa chọn hình upload!");
                            }
                            $scope.$apply();
                        }
                    });
                } else {
                    Notification.error("Bạn chưa chọn hình upload!");
                }
            } else {
                var img = $scope.uploadavatarguild.linkPhoto;
                if (img) {
                    var res = img.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                    webService.call({
                        type: "POST",
                        name: "User_UploadPhoto",
                        data: {
                            actionUserId: sessionService.userId(),
                            base64Photo: res,
                            key: sessionService.key(),
                        },
                        displayError: true,
                        onSuccess: function (r) {
                            $scope.url = r.Result;
                            if (r.ErrorCode == null) {
                                webService.call({
                                    type: "POST",
                                    name: "User_UpdateGuild",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        guildId: sessionService.data().user.Guild.Id,
                                        name: null,
                                        description: null,
                                        photolink: $scope.url,
                                        key: sessionService.key(),
                                    },
                                    onError: function (err, msg) {
                                        Notification.error(err);
                                    },
                                    onSuccess: function (a) {
                                        $rootScope.$broadcast("editavatarguild", { Items: a.Result });
                                        Notification.success("Đổi Avarta Gia Tộc Thành Công !");
                                        $uibModalInstance.dismiss();
                                        $scope.$apply();
                                    }
                                })
                            } else {
                                Notification.error("Bạn chưa chọn hình upload!");
                            }
                            $scope.$apply();
                        }
                    });
                } else {
                    Notification.error("Bạn chưa chọn hình upload!");
                }
            }
        }
        //#endregion
    }
])