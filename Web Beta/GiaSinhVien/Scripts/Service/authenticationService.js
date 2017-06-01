giasinhvienApp.factory("authenticationService", [
    "$rootScope", "webService", "sessionService", "modalService", function ($rootScope, webService, sessionService, modalService) {
        var service = new function () {
            this.signUp = function (o) {
                //#region [Validation]

                o = getOrDefault(o, {});
                if (isNoUoW(o.email))
                    throw "email must be declared";
                if (isNoUoW(o.password))
                    throw "password must be declared";
                if (isNoUoW(o.name))
                    throw "name must be declared";
                o.gender = getOrDefault(o.gender, true);
                if (typeof o.gender !== "number")
                    throw "gender must be number";
                if (o.onDone && typeof o.onDone !== "function")
                    throw "onDone must be function";
                if (isNoUoW(o.secretkey))
                    throw "secretkey must be declared";

                //#endregion

                if (sessionService.isSigned()) {
                    $rootScope.$broadcast("authentication_onSignUp");
                    $rootScope.$broadcast("authentication_onSignIn");
                    if (o.onDone) o.onDone();
                } else {
                    sessionService.getFingerprint(function (userkey) {
                        webService.call({
                            type: "POST",
                            name: "User_RegisterByTeenIdolForWeb",
                            data: {
                                user: {
                                    Email: o.email,
                                    Password: o.password,
                                    Name: o.name,
                                    Gender: o.gender,
                                    UserToken: userkey
                                },
                                secretkey: o.secretkey,
                                key: sessionService.key()
                            },
                            displayError: true,
                            onError: function () {
                                if (o.onDone) o.onDone();
                                return grecaptcha.reset();
                            },
                            onSuccess: function (r) {
                                if (r.Result && r.Result.Id && r.Result.Key)
                                    sessionService.set(r.Result.Id, r.Result.Key, function () {
                                        $rootScope.$broadcast("authentication_onSignUp");
                                        $rootScope.$broadcast("authentication_onSignIn");
                                        if (o.onDone) o.onDone();
                                    });
                            }
                        });
                    });
                }
            };

            this.signIn = function (o) {
                //#region [Validation]

                o = getOrDefault(o, {});
                o.mode = getOrDefault(o.mode, "teenidol");
                if (o.mode !== "teenidol" && o.mode !== "facebook")
                    throw "mode must be 'teenidol', 'facebook'";
                if (o.onDone && typeof o.onDone !== "function")
                    throw "onDone must be function";

                //#endregion

                if (sessionService.isSigned()) {
                    $rootScope.$broadcast("authentication_onSignIn");
                    if (o.onDone) o.onDone();
                } else {
                    switch (o.mode) {
                        case "teenidol":
                            sessionService.getFingerprint(function (userkey) {
                                webService.call({
                                    type: "POST",
                                    name: "User_LoginTeenIdol",
                                    data: {
                                        email: o.email,
                                        password: o.password,
                                        key: sessionService.key(),
                                        userToken: userkey,
                                    },
                                    displayError: true,
                                    onError: function () {
                                        if (o.onDone) o.onDone();
                                    },
                                    onSuccess: function (r) {
                                        if (r.Result && r.Result.Id && r.Result.Key)
                                            sessionService.set(r.Result.Id, r.Result.Key, function () {
                                                $rootScope.$broadcast("authentication_onSignIn");
                                                if (o.onDone) o.onDone();
                                            });
                                    }
                                });
                            });
                            break;

                        case "facebook":
                            var callback = function (r) {
                                webService.call({
                                    type: "POST",
                                    name: "User_LoginByFacebook",
                                    data: {
                                        accessToken: r.accessToken,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onError: function () {
                                        if (o.onDone) o.onDone();
                                    },
                                    onSuccess: function (r) {
                                        if (r.Result && r.Result.Id && r.Result.Key)
                                            sessionService.set(r.Result.Id, r.Result.Key, function () {
                                                $rootScope.$broadcast("authentication_onSignIn");
                                                if (o.onDone) o.onDone();
                                            });
                                    }
                                });
                            };

                            FB.getLoginStatus(function (r) {
                                if (r.status === "connected") {
                                    callback(r.authResponse);
                                } else {
                                    FB.login(function (r) {
                                        if (r.status === "connected") {
                                            callback(r.authResponse);
                                        }
                                    },
                                    { scope: "public_profile,email" });
                                }
                            });
                            break;
                    }
                }
            };

            this.signOut = function () {
                webService.call({
                    type: "POST",
                    name: "User_LogoutTeenIdol",
                    data: {
                        key: sessionService.key()
                    }
                });
                sessionService.clear();
                $rootScope.$broadcast("authentication_onSignOut");
            };

            this.showModal = function (o) {
                //#region [Validation]

                o = getOrDefault(o, {});
                if (!isNoUoW(o.mode))
                    o.mode = o.mode.trim().toLowerCase();
                if (o.mode !== "sign-in" && o.mode !== "sign-up" && o.mode !== "sign-out" && o.mode !== "re-pass")
                    throw "mode must be 'sign-in' or 'sign-up' or 'sign-out' or 're-pass'";
                o.message = getOrDefault(o.message, undefined);
                o.messageType = getOrDefault(o.messageType, "warning");

                //#endregion

                if (o.mode === "sign-in" || o.mode === "sign-up" || o.mode === "re-pass") {
                    if (sessionService.isSigned()) {
                        console.info("Không thể thực hiện lệnh đăng ký / đăng nhập nữa vì bạn hiện đang đăng nhập với tài khoản userId: " + sessionService.userId());
                        return;
                    }

                    //#region [Message]

                    var $alertElement = $("#modal-authentication .alert");
                    $alertElement.removeClass().addClass("alert");

                    if (o.message)
                        $alertElement.addClass("alert-" + o.messageType).html(o.message);
                    else
                        $alertElement.addClass("hidden").html("");

                    //#endregion

                    //#region [Reset input]

                    $("#modal-authentication-sign-in .email").val("");
                    $("#modal-authentication-sign-in .password").val("");
                    $("#modal-authentication-sign-up .email").val("");
                    $("#modal-authentication-sign-up .password").val("");
                    $("#modal-authentication-sign-up .re-password").val("");
                    $("#modal-authentication-sign-up .name").val("");
                    $("#modal-authentication-sign-up .gender").val("0");

                    //#endregion

                    //#region [Show modal]

                    if ($rootScope.showPopupInterval) {
                        var setshowpopup = {
                            backdrop: 'static',
                            keyboard: false
                        };
                    } else {
                        var setshowpopup = 'show';
                    };
                    $("#modal-authentication")
                        .modal(setshowpopup)
                        .find("a[data-target='#modal-authentication-" + o.mode + "']").tab("show");

                    //#endregion
                } else {
                    if (sessionService.isSigned()) {
                        modalService.showAlert({
                            title: "Đăng xuất",
                            message: "Bạn chắc chắn muốn đăng xuất khỏi tài khoản '" + sessionService.data().user.User.Name + "' chứ?",
                            buttons: [
                                {
                                    text: "Không",
                                    style: "btn-default",
                                    closeModal: true
                                },
                                {
                                    text: "Có",
                                    style: "btn-primary",
                                    closeModal: true,
                                    onClick: function () {
                                        service.signOut();
                                    }
                                }
                            ]
                        });
                    } else {
                        service.signOut();
                    }
                }
            };
        };
        return service;
    }
]);