giasinhvienApp.controller("modalEditGuildController", ["$scope", "$rootScope", "$uibModalInstance", "sessionService", "webService", "data", "Notification",
    function ($scope, $rootScope, $uibModalInstance, sessionService, webService, data, Notification) {
        //#region [Field]
        $scope.uploadavatarguild = {
            linkPhoto: undefined,
        };
        $scope.UserGuildInfo = {
            name: data.GuildInfo.Guild.Name,
            description: data.GuildInfo.Guild.Description,
            photolink: data.GuildInfo.Guild.PhotoLink,
            Avatar: data.GuildInfo.Guild.Avatar,
            isBusy: false,
        };
        //#endregion
        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        $scope.EditAvarta = function () {
            var avatar_giatoc = $('#avatar-giatoc');
            var f = avatar_giatoc.prop('files')[0];
            var icon_giatoc = $('#icon-giatoc');
            var f1 = icon_giatoc.prop('files')[0];
            if (f && f1) {
                var base64Photo = $scope.UserGuildInfo.Avatar.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                var Nameicon = f1.name;
                var base64Photo1 = $scope.UserGuildInfo.photolink.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                webService.call({
                    type: "POST",
                    name: "User_UploadFile",
                    data: {
                        actionUserId: sessionService.userId(),
                        base64Photo: base64Photo,
                        name: Nameicon,
                        key: sessionService.key(),
                    },
                    displayError: true,
                    onSuccess: function (r) {
                        $scope.url_icon = r.Result;
                        webService.call({
                            type: "POST",
                            name: "User_UploadPhoto",
                            data: {
                                actionUserId: sessionService.userId(),
                                base64Photo: base64Photo1,
                                key: sessionService.key(),
                            },
                            displayError: true,
                            onSuccess: function (r) {
                                $scope.url_avatar = r.Result;
                                $scope.uploadguild($scope.url_avatar, $scope.url_icon);
                            },
                        });
                        $scope.$apply();
                    }
                });
            } else if (!f && !f1) {
                $scope.uploadguild($scope.UserGuildInfo.photolink, $scope.UserGuildInfo.Avatar);
            }
            else if (!f && f1) {
                var Nameicon = f1.name;
                var base64Photo = $scope.UserGuildInfo.Avatar.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                webService.call({
                    type: "POST",
                    name: "User_UploadFile",
                    data: {
                        actionUserId: sessionService.userId(),
                        base64Photo: base64Photo,
                        name: Nameicon,
                        key: sessionService.key(),
                    },
                    displayError: true,
                    onSuccess: function (r) {
                        $scope.url_icon = r.Result;
                        $scope.uploadguild($scope.UserGuildInfo.photolink, $scope.url_icon);
                        $scope.$apply();
                    }
                });
            }
            else if (f && !f1) {
                var base64Photo = $scope.UserGuildInfo.photolink.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                webService.call({
                    type: "POST",
                    name: "User_UploadPhoto",
                    data: {
                        actionUserId: sessionService.userId(),
                        base64Photo: base64Photo,
                        key: sessionService.key(),
                    },
                    displayError: true,
                    onSuccess: function (r) {
                        $scope.url_avatar = r.Result;
                        $scope.uploadguild($scope.url_avatar, $scope.UserGuildInfo.Avatar);
                    },
                });
            }
        }

        $scope.uploadguild = function (avatar, icon) {
            $scope.UserGuildInfo.isBusy = true;
            webService.call({
                type: "POST",
                name: "User_UpdateGuild",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    name: $scope.UserGuildInfo.name,
                    description: $scope.UserGuildInfo.description,
                    photolink: avatar,
                    avatar: icon,
                    key: sessionService.key(),
                },
                onError: function (err, msg) {
                    Notification.error(err);
                    $scope.UserGuildInfo.isBusy = false;
                },
                onSuccess: function (a) {
                    $scope.UserGuildInfo.isBusy = false;
                    $rootScope.$broadcast("onEditGuild", { Items: a.Result });
                    Notification.success("Đổi thông tin gia tộc thành công !");
                    $uibModalInstance.dismiss();
                    $scope.$apply();
                }
            });
        }
        //#endregion
    }
])