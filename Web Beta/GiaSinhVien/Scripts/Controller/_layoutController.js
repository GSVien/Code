giasinhvienApp.controller("layoutController", ["$window", "$http", "$scope", "$rootScope", "$location", "$cookies",
    "helperService", "sessionService", "signalRService", "authenticationService", "Notification", "formService",
    "webService", "modalService",
function ($window, $http, $scope, $rootScope, $location, $cookies,
    helperService, sessionService, signalRService, authenticationService, Notification, formService,
    webService, modalService) {
        //#region [Field]
        $scope.helper = helperService;
        $scope.sessionService = sessionService;
        $scope.hub = undefined;
        $scope.dropdownStatus = "loading";
        $scope.dropdownMessage = undefined;
        $scope.dropdownUserId = undefined;
        $scope.dropdownUserData = undefined;
        $scope.emoticon = [];
        $scope.forgetpassword = {
            email: undefined,
        }
        $scope.showSchedule = undefined;
        $scope.showRank = undefined;
        $scope.statusGuild = {
            Items: undefined,
            NoReadNotification: undefined,
            status: "loading",
            pageSize: 0,
            pageIndex: 5,
            isNext: false,
        }
        $scope.signUp = {
            email: undefined,
            password: undefined,
            repassword: undefined,
            name: undefined,
            gender: 0,
            isBusy: false,

        };
        $scope.guildInfo = {
            guildBusy: false,
            Id: undefined,
            nameGuild: undefined,
            photoGuild: undefined,
            iconGuild: undefined,
            levelPhoto: undefined,
            nameMaster: undefined,
            totalUserGuild: undefined,
            totalUserMaxGuild: undefined,
        }
        //#endregion

        //#region [Layout Parameter]

        $scope.layoutTitle = "GiaSinhVien";
        $scope.layoutShowHeader = true;
        $scope.layoutShowFooter = true;
        $scope.layoutShowBanner = true;
        $scope.layoutFullBody = false;
        $scope.layoutShowRightBar = true;
        $scope.layoutShowHeaderevent = false;

        //#endregion

        //#region [Service]

        $scope.helper = helperService;
        $scope.sessionService = sessionService;
        $scope.formService = formService;

        //#endregion

        //#region [Method]

        $scope.resetLayout = function () {
            $("body").css("background-image", "");
            $scope.layoutTitle = "GiaSinhVien";
            $scope.layoutShowHeader = true;
            $scope.layoutShowFooter = true;
            $scope.layoutShowBanner = true;
            $scope.layoutFullBody = false;
            $scope.layoutShowRightBar = true;
            $scope.layoutShowLeftBar = true;
            $scope.layoutShowHeaderevent = false;
        };

        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };

        //#endregion

        //#region [Event]

        $scope.onSignUp = function ($event) {
            $scope.signUp.isBusy = true;
            var grecapt = grecaptcha.getResponse();
            if (!grecapt) {
                Notification.error('Bạn chưa check recptcha !');
                $scope.signUp.isBusy = false;
                return;
            }
            authenticationService.signUp({
                email: $scope.signUp.email,
                password: $scope.signUp.password,
                name: $scope.signUp.name,
                gender: $scope.signUp.gender * 1,
                secretkey: grecapt,
                onDone: function () {
                    $scope.signUp.isBusy = false;
                }
            });
        };

        $scope.onSignInWithFacebook = function ($event) {
            var $target = $($event.target);

            $target.button("loading");
            authenticationService.signIn({
                mode: "facebook",
                onDone: function () {
                    $target.button("reset");
                }
            });
        };

        $scope.onSignInWithEmail = function ($event) {
            var $target = $($event.target);
            var $emailElement = $target.find(".email");
            var $passwordElement = $target.find(".password");
            var $buttonElement = $target.find("[type=submit]");

            if (formService.isLoading($buttonElement))
                return;
            $buttonElement.button("loading");

           authenticationService.signIn({
                mode: "giasinhvien",
                email: $emailElement.val(),
                password: $passwordElement.val(),

                onDone: function () {
                    $buttonElement.button("reset");
                }
            });
        };

        $scope.onForgetPassword = function ($event) {
            webService.call({
                name: "User_CreateResetPasswordKey",
                data: {
                    actionUserId: $scope.sessionService.userId(),
                    email: $scope.forgetpassword.email,
                    key: $scope.sessionService.key(),
                },
                displayError: true,
                onSuccess: function (a) {
                    Notification.success("Gửi email thành công");
                    $scope.forgetpassword.email = undefined;
                    $("#modal-authentication").modal("hide");
                    $scope.$apply();
                }
            });
        }

        $scope.$watch("dropdownUserId", function (data) {
            if (!data)
                return;

            $scope.dropdownStatus = "loading";
            $scope.dropdownMessage = undefined;
            if (!$scope.dropdownUserId.vipId || $scope.dropdownUserId.vipId !== 100) {
                webService.call({
                    name: "User_GetDetails",
                    data: {
                        actionUserId: sessionService.userId(),
                        userId: data.userId,
                        isStar: false,
                        key: sessionService.key(),
                    },
                    onError: function (errorCode, message) {
                        $scope.dropdownStatus = "error";
                        $scope.dropdownMessage = message;
                        $scope.$apply();
                    },
                    onSuccess: function (r1) {
                        webService.call({
                            name: "User_IsUserCanChatShow",
                            data: {
                                actionUserId: sessionService.userId(),
                                userId: data.userId,
                                scheduleId: $scope.dropdownUserId.scheduleId,
                                key: sessionService.key()
                            },
                            onError: function (errorCode, message) {
                                $scope.dropdownStatus = "error";
                                $scope.dropdownMessage = message;
                                $scope.$apply();
                            },
                            onSuccess: function (r2) {
                                if (r1.Result.Guild && r1.Result.GuildLevel) {
                                    $scope.guildInfo.guildBusy = true,
                                    $scope.guildInfo.nameGuild = r1.Result.Guild.Name;
                                    $scope.guildInfo.Id = r1.Result.Guild.Id;
                                    $scope.guildInfo.photoGuild = r1.Result.Guild.PhotoLink;
                                    $scope.guildInfo.iconGuild = r1.Result.Guild.Avatar;
                                    $scope.guildInfo.levelPhoto = r1.Result.GuildLevel.Photo;
                                    $scope.guildInfo.nameMaster = r1.Result.GuildLeader.Name;
                                    $scope.guildInfo.totalUserGuild = r1.Result.Guild.TotalUser;
                                    $scope.guildInfo.totalUserMaxGuild = r1.Result.GuildLevel.TotalUser;
                                } else {
                                    $scope.guildInfo.guildBusy = false;
                                };
                                $scope.dropdownUserData = r1.Result;
                                $scope.dropdownUserData.isCanChat = r2.Result;
                                $scope.dropdownUserData.isMod = r2.Extra;
                                $scope.dropdownStatus = "loaded";
                                $scope.$apply();
                            }
                        });
                    }
                });
            }
        });

        $scope.onMessageEmoticon = function ($event) {
            var code = $($event.target).closest(".emoticon-item").data("emoticon-code");
            var $target = $($("#dropdown-message-emoticon").data("emoticon-target"));
            $target.val($target.val() + code);
            $("#message-text").focus();
        };

        $scope.onSearchIdol = function () {
            var stringkey = $("#search-text").val();
            if (!stringkey) {
                return;
            }
            $("#search-text").val("");
            $location.path('/search/' + stringkey);
        };

        $scope.onHideModalVip = function () {
            return $location.path("/shop/");
        }

        $scope.$on("authentication_onSignUp", function () {
            Notification.success("Đăng ký thành công");
        });

        $scope.$on("authentication_onSignIn", function () {
            $("#modal-authentication").modal("hide");
            $rootScope.showPopupInterval = false;
            Notification.success("Đăng nhập thành công");
        });

        $scope.$on("authentication_onSignOut", function () {
            Notification.success("Đăng xuất thành công");
        });

        $scope.$on("onUserMission", function () {
            $scope.onUserMission();
        });

        $scope.$on("onUserDayCheck", function () {
            $scope.onUserDayCheck();
        });

        $scope.$on("onRegisterstar", function () {
            $scope.onRegisterstar();
        });

        $scope.$on("onUserRechargeCoin", function () {
            $scope.onUserRechargeCoin();
        });

        $scope.onUserMission = function ($event) {
            if (!sessionService.isSigned()) {
                authenticationService.showModal({
                    mode: "sign-in",
                    message: "Bạn cần đăng nhập để sử dụng tính năng này"
                });
                return;
            }
            modalService.showUserMission({
            });
        }

        $scope.onUserDayCheck = function ($event) {
            if (!sessionService.isSigned()) {
                authenticationService.showModal({
                    mode: "sign-in",
                    message: "Bạn cần đăng nhập để sử dụng tính năng này"
                });
                return;
            }
            modalService.showUserDayCheck({
            });
        }

        $scope.onRegisterstar = function ($event) {
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSeV8X9GuTTzwKHaIfaZCw4VpO-wiKyDgR0ZVRny5_f1qBCfyQ/viewform?fbzx=576265889300412700', '_blank');
            //modalService.showRegisterstar({
            //});
        }

        $scope.onUserRechargeCoin = function ($event) {
            if (!sessionService.isSigned()) {
                authenticationService.showModal({
                    mode: "sign-in",
                    message: "Bạn cần đăng nhập để sử dụng tính năng này"
                });
                return;
            }
            modalService.showUserRechargeCoin({
            });
        }

        $scope.onLoadStatusGuild = function (page) {

            if (sessionService.isSigned()) {
                webService.call({
                    name: "User_GetUserNotification",
                    data: {
                        actionUserId: sessionService.userId(),
                        pageIndex: 0,
                        pageSize: 5,
                        status: "1,2",
                        key: sessionService.key()
                    },
                    displayError: true,
                    onError: function () {
                    },
                    onSuccess: function (rs) {
                        $scope.statusGuild.Items = rs.Items;
                        var count = 0;
                        $(rs.Items).each(function (i, x) {
                            if (x.User_Notification.Status == 1) {
                                count = count + 1;
                            }
                        });
                        $scope.statusGuild.NoReadNotification = count;

                    }
                });
            }
        }

        $scope.onActionReadNotification = function (data) {
            webService.call({
                name: "User_ActionReadNotification",
                data: {
                    actionUserId: sessionService.userId(),
                    userNotificationId: data,
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function () {
                },
                onSuccess: function (rs) {
                    $scope.onLoadStatusGuild();
                }
            });
        }

        $scope.redirectlink = function (link) {
            if (!$scope.showvideo) {
                $scope.showvideo = true;
            } else {
                $scope.showvideo = false;
            }
        }

        
        //#endregion

        //#region [On Load]
        sessionService.isReady(function () {

            $scope.onLoadStatusGuild();

            webService.call({
                name: "Config_GetConfig",
                data: {
                    actionUserId: sessionService.userId(),
                    value: "WebClientVersion",
                    key: sessionService.key()
                },
                onSuccess: function (r) {
                    if (r.Result.Value !== undefined && r.Result.Value !== null && $cookies.get("version") !== r.Result.Value) {
                        $cookies.put("version", r.Result.Value, { expires: moment().add(1, "days").toDate() });
                        location.reload(true);
                    }
                }
            });

            if (!helperService.checkCookies()) {
                Notification.showAlert({
                    title: "Xin bật Cookies",
                    message: "Hiện bạn đã tắt chức năng Cookies của trình duyệt." +
                        "<br/> Xin vui lòng kiểm tra và bật lại để có những trải nghiệm tốt nhất tại TeenIdol.",
                    buttons: [
                        { text: "OK", type: "close" }
                    ]
                });
            }

            for (var i = 0; i <= 65; i++) {
                $scope.emoticon.push(i);
            };

            $("#dropdown-user-info").on("show", function (event, dropdownData) {
                $scope.dropdownUserId = {
                    userId: dropdownData.jqDropdown.data("user-id"),
                    userName: dropdownData.jqDropdown.data("user-name"),
                    scheduleId: dropdownData.jqDropdown.data("schedule-id"),
                    vipId: dropdownData.jqDropdown.data("vip-id")
                };

                if ($scope.dropdownUserId.vipId === 100) {
                    $scope.dropdownStatus = "loading";
                    webService.call({
                        name: "IsUserCanFacebookChat",
                        data: {
                            userId: $scope.dropdownUserId.userId,
                            scheduleId: $scope.dropdownUserId.scheduleId
                        },
                        onSuccess: function (r) {
                            $scope.dropdownStatus = "loaded";
                            $scope.dropdownUserId.isCanChatFacebook = r.Result;
                            $scope.$apply();
                        }
                    });
                }

                $scope.$apply();
            });
            
        });
        //#endregion
    }
]);