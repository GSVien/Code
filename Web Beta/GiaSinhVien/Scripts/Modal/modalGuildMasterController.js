giasinhvienApp.controller("modalGuildMasterController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification", "$rootScope",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification, $rootScope) {
        //#region [Field]
        $scope.sessionService = sessionService;
        $scope.ListUserInGuild = {
            Items: undefined,
            Items1: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: true,
        }
        $scope.ListUserJoinGuild = {
            Items: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: false,
        };
        $scope.listStar = {
            Items: undefined,
            status: "loading"
        }
        $scope.support = '<p align="left">- Sử dụng RUBY hoặc TIM trong show diễn của idol bất kì sẽ giúp tăng cống hiến cho gia tộc.</p>' +
            '<p align="left">- Cống hiến giúp tăng level gia tộc, gia tộc level càng cao giới hạn số thành viên sẽ càng tăng.</p>' +
            '<p align="left">- Top 3 user cống hiến nhiều nhất của gia tộc sẽ là trưởng lão của gia tộc (cập nhật lúc 11h59 chủ nhật hàng tuần).</p>';
        $scope.ListUserInGuild.remove = function (userId) {
            $($scope.ListUserInGuild.Items).each(function (i, x) {
                if (x.User.Id === userId) {
                    $scope.ListUserInGuild.Items.splice(i, 1);
                    return false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };
        $scope.ListUserJoinGuild.remove = function (userId) {
            $($scope.ListUserJoinGuild.Items).each(function (i, x) {
                if (x.User.Id === userId) {
                    $scope.ListUserJoinGuild.Items.splice(i, 1);
                    return false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };
        //#endregion

        //#region [Event]


        if (data.data) {
            $scope.nexlevel = data.data;
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onUserKickOutUser = function (id) {
            if (sessionService.data().user.User.Id == id) {
                var massage = "Bạn chắc chắn muốn rời khỏi gia tộc này chứ?";
            } else {
                var massage = "Bạn chắc chắn muốn kick người này chứ?";
            }

            modalService.showAlert({
                title: "Xác nhận",
                message: massage,
                buttons: [
                    { text: "Không", style: "btn-default", closeModal: true },
                    {
                        text: "Có",
                        style: "btn-primary",
                        closeModal: true,
                        onClick: function () {
                            webService.call({
                                name: "User_KickOutUser",
                                type: "POST",
                                data: {
                                    actionUserId: sessionService.userId(),
                                    guildId: sessionService.data().user.Guild.Id,
                                    userId: id,
                                    key: sessionService.key()
                                },
                                onError: function (err, msg) {
                                    Notification.error(msg);
                                },
                                onSuccess: function (r) {
                                    if (sessionService.data().user.User.Id == id) {
                                        Notification.success('Rút khỏi gia tộc thành công');
                                        window.location = "/guild";
                                    } else {
                                        Notification.success('Kích ra khỏi gia tộc thành công');
                                    }
                                    $(".get-reward").tooltip("hide");
                                    $scope.ListUserInGuild.remove(id);
                                    if (!$scope.$$phase) $scope.$apply();
                                }
                            });
                        }
                    }
                ]
            });
        }

        $scope.onGetListUserInGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserInGuild.pageIndex = $scope.ListUserJoinGuild.pageIndex + 1;
            }
            if (!sessionService.isSigned()) {
                $scope.ListUserInGuild.status = "error";
                $scope.ListUserInGuild.message = "Bạn cần đăng nhập để xem thông tin gia tộc";
                return;
            };
            if (sessionService.data().user.Guild == null) {
                $scope.ListUserInGuild.status = "error";
                $scope.ListUserInGuild.message = "Hiện bạn chưa gia nhập gia tộc nào";
                return;
            };
            webService.call({
                name: "User_GetListUserInGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserInGuild.pageIndex,
                    pageSize: $scope.ListUserInGuild.pageSize,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserInGuild.message = msg;
                    $scope.ListUserInGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserInGuild.Items) {
                        $scope.ListUserInGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserInGuild.Items = r.Items;
                    }

                    $scope.ListUserInGuild.status = "loaded";
                    $scope.ListUserInGuild.nextList = (r.PageIndex + 1) === r.PageCount;
                    $scope.Total = r.Total;
                    $scope.Totalmax = r.Total;
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
            webService.call({
                name: "User_GetGuildInfo",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                },
                onSuccess: function (r) {
                    $scope.ListUserInGuild.Items1 = r.Result;
                    if (r.Result.Guild.Ruby > 0) {
                        $scope.phantram = ((r.Result.Guild.Ruby - r.Result.GuildLevel.Point) / (r.Result.NextLevel.Point - r.Result.GuildLevel.Point)) * 100;
                    }
                    else {
                        $scope.phantram = 0;
                    }
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }

        $scope.showInfoTower = function () {
            webService.call({
                name: "Guild_GetTowers",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    modalService.showInfoTower({
                        data: rs.Result[0],
                    });
                },

            });
        }

        $scope.onGetListUserJoinGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserJoinGuild.pageIndex = $scope.ListUserJoinGuild.pageIndex + 1;
            }

            if (!sessionService.isSigned()) {
                $scope.ListUserJoinGuild.status = "error";
                $scope.ListUserJoinGuild.message = "Bạn cần đăng nhập để xem thông tin gia tộc";
                return;
            };
            webService.call({
                name: "User_GetListUserJoinGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserJoinGuild.pageIndex,
                    pageSize: $scope.ListUserJoinGuild.pageSize,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserJoinGuild.message = msg;
                    $scope.ListUserJoinGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserJoinGuild.Items) {
                        $scope.ListUserJoinGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserJoinGuild.Items = r.Items;
                    }

                    $scope.ListUserJoinGuild.nextList = r.PageIndex === r.PageCount;
                    $scope.ListUserJoinGuild.status = "loaded";
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }

        $scope.onAcceptUserJoinGuild = function (id) {
            webService.call({
                name: "User_AcceptUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (error, msg) {
                    if (error == 5 || error == 6) {
                        Notification.error(msg);
                    } else {
                        Notification.error(msg);
                        $scope.ListUserJoinGuild.remove(id);
                    }
                },
                onSuccess: function (r) {
                    Notification.success("Chấp nhận user vào gia tộc thành công");
                    $scope.onGetListUserInGuild();
                    $scope.ListUserJoinGuild.remove(id);
                }
            });
        }

        $scope.onDeclineUserJoinGuild = function (id) {
            webService.call({
                name: "User_DeclineUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                    Notification.error("Có lỗi xin thử lại");
                },
                onSuccess: function (r) {
                    Notification.success("Không chấp nhận thành công");
                    $scope.ListUserJoinGuild.remove(id);

                }
            });
        }
        $scope.onGetListIdolInGuild = function () {
            webService.call({
                name: "User_GetListIdolInGuild",
                type:"POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 4,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser:null,
                    key: sessionService.key()
                },
                onSuccess: function (r) {
                    $scope.listStar.Items = r.Items;
                    $scope.$apply();
                }
            });
        }
        $scope.$on("editavatarguild", function (event, args) {
            $scope.ListUserInGuild.Items1.Guild.PhotoLink = args.Items.PhotoLink;
            if (!$scope.$$phase) $scope.$apply;
        });

        $scope.openEditAvatar = function () {
            modalService.showEditAvatarGuild({});
        };
        //#endregion
    }
]);