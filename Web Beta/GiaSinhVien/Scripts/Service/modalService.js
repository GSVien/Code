giasinhvienApp.factory("modalService", ["$uibModal", "sessionService",
    function ($uibModal, sessionService) {
        var service = new function () {
            this.showAlert = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-alert",
                    animation: true,
                    templateUrl: "/Layouts/Modal/Alert.html",
                    controller: "modalAlertController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            };
            this.showAlertKickAdmin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-alert",
                    animation: true,
                    templateUrl: "/Layouts/Modal/AlertKickAdmin.html",
                    controller: "modalAlertController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            };

            this.showFacebookLive = function (o) {
                if (o === undefined || o === null)
                    o = {};

                var modal = $uibModal.open({
                    windowClass: "modal-facebook-live",
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    templateUrl: "/Layouts/Modal/FacebookLive.html",
                    controller: "modalFacebookLiveController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });

                modal.result.then(function (r) {
                    o.onSuccess(r);
                });
            };

            //            this.showLogin = function (o) {
            //                if (o === undefined || o === null)
            //                    o = {};
            //                if (!o.onSuccess && typeof o.onSuccess !== "function")
            //                    throw "onSuccess must be function";
            //
            //                var modal = $uibModal.open({
            //                    windowClass: "modal-login",
            //                    animation: true,
            //                    size: "lg",
            //                    templateUrl: "/Layouts/Modal/Login.html",
            //                    controller: "modalLoginController",
            //                    resolve: {
            //                        data: function () {
            //                            return o;
            //                        }
            //                    }
            //                });
            //
            //                modal.result.then(function (r) {
            //                    if (o.onSuccess)
            //                        o.onSuccess(r);
            //                });
            //            };
            //
            //            this.showLogout = function (o) {
            //                if (o === undefined || o === null)
            //                    o = {};
            //                if (!o.onSuccess && typeof o.onSuccess !== "function")
            //                    throw "onSuccess must be function";
            //
            //                var modal = $uibModal.open({
            //                    windowClass: "modal-logout",
            //                    animation: true,
            //                    templateUrl: "/Layouts/Modal/Alert.html",
            //                    controller: "modalAlertController",
            //                    resolve: {
            //                        data: function () {
            //                            return {
            //                                title: "Đăng xuất",
            //                                message: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản '" + sessionService.user().name + "' ? Các idol sẽ nhớ bạn lắm đấy",
            //                                buttons: [
            //                                {
            //                                    text: "Không",
            //                                    style: "btn-default",
            //                                    closeModal: true
            //                                },
            //                                {
            //                                    text: "Có",
            //                                    style: "btn-primary",
            //                                    closeModal: true,
            //                                    onClick: function () {
            //                                        var userId = sessionService.userId();
            //                                        sessionService.clearLoginInfo();
            //                                        if (o.onSuccess && typeof o.onSuccess === "function")
            //                                            o.onSuccess(userId);
            //                                    }
            //                                }]
            //                            }
            //                        }
            //                    }
            //                });
            //            };

            //            this.AdminKick = function (o) {
            //                if (o === undefined || o === null)
            //                    o = {};
            //                if (o.title === undefined)
            //                    o.title = "";
            //                if (o.buttons !== undefined && o.buttons.constructor !== Array)
            //                    throw "buttons must be array type";
            //
            //                var modal = $uibModal.open({
            //                    windowClass: "modal-adminkick",
            //                    animation: true,
            //                    size: "lg",
            //                    templateUrl: "/Layouts/Modal/AdminKick.html",
            //                    controller: "modalAdminKickController",
            //                    resolve: {
            //                        data: function () {
            //                            return o;
            //                        }
            //                    }
            //                });
            //            };

            this.showUserDayCheck = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-daycheck",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/DayCheck.html",
                    controller: "modalDayCheckController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showRegisterstar = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-registerstar",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/Registerstar.html",
                    controller: "modalRegisterstarController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showUserMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-usermission",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/UserMission.html",
                    controller: "modalUserMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showUserRechargeCoin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-recharge-coin",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/RechargeCoin.html",
                    controller: "modalRechargeCoinController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showShowRank = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-rank",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowRank.html",
                    controller: "modalShowRankController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showShowOpening = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-opening",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowOpening.html",
                    controller: "modalShowOpeningController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showShowSchedule = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-schedule",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowSchedule.html",
                    controller: "modalShowScheduleController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showPopupEvent = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-popup-event",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowPopupEvent.html",
                    controller: "modalPopupEventController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showBannerEvent = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-banner-event",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/BannerEvent.html",
                    controller: "modalBannerEventController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showIframeRechargeCoin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-iframe-recharge-coin",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/IframeRechargeCoin.html",
                    controller: "modalIframeRechargeCoinController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showDetailGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-detail-guild",
                    animation: true,
                    backdrop: "static",
                    size: "lg",
                    keyboard: false,
                    templateUrl: "/Layouts/Modal/DetailGuild.html",
                    controller: "modalDetailGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showChangePassword = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-change-password",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ChangePassword.html",
                    controller: "modalChangePasswordController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showGuildMaster = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-guild-master",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/GuildMaster.html",
                    controller: "modalGuildMasterController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showListUserJoin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-list-user-join",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/ListUserJoin.html",
                    controller: "modalListUserJoinController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showShopGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-shop-guild",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/ShopGuild.html",
                    controller: "modalShopGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showGoldMine = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-gold-mine",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/GoldMine.html",
                    controller: "modalGoldMineController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showRankGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-rank-guild",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/RankGuild.html",
                    controller: "modalRankGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showInfoTower = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-info-tower",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/InfoTower.html",
                    controller: "modalInfoTowerController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showEditAvatarGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-edit-avatar-guild",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/EditAvatarGuild.html",
                    controller: "modalEditAvatarGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showEditGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-edit-guild",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/EditGuild.html",
                    controller: "modalEditGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showTakingMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-taking-mission",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/TakingMission.html",
                    controller: "modalTakingMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showIdolMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-idol-mission",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/IdolMission.html",
                    controller: "modalIdolMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showIdolDoneMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-idol-done-mission",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/IdolDoneMission.html",
                    controller: "modalIdolDoneMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showReport = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-report",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/Report.html",
                    controller: "modalReportController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
        };
        return service;
    }
]);