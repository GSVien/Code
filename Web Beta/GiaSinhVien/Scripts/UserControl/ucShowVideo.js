giasinhvienApp.directive("ucShowVideo", [
    "$compile", "$timeout", "$interval", "webService", "sessionService", "helperService", "authenticationService", "Notification", "modalService", "apiService",
    function ($compile, $timeout, $interval, webService, sessionService, helperService, authenticationService, Notification, modalService, apiService) {
        var controller = function ($scope, $element, $attrs) {
            //#region [Field]

            $scope.liveChecker = undefined;

            $scope._ctrl = this;
            $scope.player = undefined;
            $scope.sessionService = sessionService;
            $scope.helper = helperService;
            $scope.scheduleId = undefined;
            $scope.allowFullscreen = $attrs.allowFullscreen === "false" ? false : true;
            $scope.qualityChecker = undefined;
            $scope.qualityIsOk = true;
            $scope.quality = {
                list: [
                    { id: "0", text: "Cao", width: 480, height: 360 },
                    { id: "1", text: "Vừa", width: 360, height: 270 },
                    { id: "2", text: "Thấp", width: 240, height: 180 },
                    { id: "4", text: "640x480", width: 640, height: 480 },
                    { id: "3", text: "HD", width: 1280, height: 720 },
                ]
            };
            $scope.quality.current = $scope.quality.list[0];

            $scope.starStatus = "loading";
            $scope.starError = undefined;
            $scope.showId = undefined;
            $scope.starId = undefined;
            $scope.starAvatar = undefined;
            $scope.starName = undefined;
            $scope.starLevelName = undefined;
            $scope.starLevelPhoto = undefined;
            $scope.starNextLevelName = undefined;
            $scope.starNextLevelPhoto = undefined;
            $scope.starNextLevelNeed = undefined;
            $scope.starNextLevelProgress = undefined;
            $scope.starCoinGet = undefined;
            $scope.starFreeCoinGet = undefined;
            $scope.starStarShow = undefined;
            $scope.starFollowStatus = undefined;
            $scope.starFacebookLink = undefined;
            $scope.supportFullScreen = window.fullScreenApi.supportsFullScreen;
            $scope.addFullscreenHandler = false;
            $scope.isFullScreen = false;
            $scope.browser = helperService.detectBrowser();

            $scope.seatStatus = "loading";
            $scope.seatError = undefined;
            $scope.seatCurrentUserId = undefined;
            $scope.seatCurrentPrice = undefined;
            $scope.seatCurrentIndex = undefined;
            $scope.seatCurrentCreateDate = undefined;
            $scope.seatCurrentEndDate = undefined;
            $scope.listSeat = [];
            $scope.listSeatPrice = [];

            $scope.showStartFlashButton = false;
            $scope.showStatus = undefined;
            $scope.streamKey = undefined;
            $scope.rtmpHost = undefined;
            $scope.hlsHost = undefined;
            $scope.offlineVideoLink = undefined;
            $scope.videoFlashLink = undefined;
            $scope.isMute = false;
            $scope.facebookLive = {
                handle: undefined,
                current: {
                    LiveId: null,
                },
                secondsLeft: 0,
                liveViews: 0,
                lastCommentId: undefined,
                lastAutoCommentId: undefined,
                lastAutoCommentTime: undefined
            }

            $scope.sampleStar = undefined;
            $scope.percentSample = 0;

            //#endregion

            //#region [Method]

            this.getsampleStar = function (csampleStar, cpercentSample) {
                $scope.sampleStar = csampleStar;
                $scope.percentSample = cpercentSample;
            }

            this.startFlash = function () {
                $scope.player = document.getElementById("flash-player");

                if ($scope.player === null)
                    return false;

                try {
                    if ($scope.player.jsCallGetStatus() === 1)
                        return true;
                } catch (ex) {

                }

                try {
                    if ($scope.pageStatus === "user") {
                        if ($scope.showMobile) {
                            var flashvar = {
                                host: $scope.rtmpHost,
                                chanel: $scope.streamKey,
                                width: 9,
                                height: 16,
                                bf: 2,
                            };
                        } else {
                            var flashvar = {
                                host: $scope.rtmpHost,
                                chanel: $scope.streamKey,
                                bf: 2,
                            };
                        }

                        if ($scope.width !== null && $scope.height !== null) {
                            flashvar.width = $scope.width;
                            flashvar.height = $scope.height;
                        }

                        $scope.player.jsCall(flashvar);
                    } else if ($scope.pageStatus === "caster") {
                        $scope.player.jsCallStartStream({
                            host: $scope.rtmpHost,
                            chanel: $scope.streamKey,
                            width: $scope.quality.current.width,
                            height: $scope.quality.current.height
                        });

                        if (!$scope.qualityChecker) {
                            //$scope.qualityChecker = $interval(function () {
                            //    $scope.onFlashQualityCheck($scope.player.jsCallGetBitRate());
                            //}, 1000 * 10);
                        }
                    }
                    $scope.showStartFlashButton = false;
                    return true;
                } catch (ex) {
                    return false;
                }
            };

            this.stopFlash = function () {
                try {
                    $scope.player = document.getElementById("flash-player");
                    $scope.player.jsCallStopStream({
                        host: $scope.rtmpHost,
                        chanel: $scope.streamKey
                    });
                    return true;
                } catch (ex) {
                    return false;
                }
            };

            this.loadVideo = function (showId, showStatus, starId, streamKey, rtmpHost, hlsHost, offlineVideoLink, startTime, width, height, isMute, showMobile) {
                $scope.showStatus = showStatus;
                $scope.showId = showId;
                $scope.starId = starId;
                $scope.streamKey = streamKey;
                $scope.rtmpHost = rtmpHost;
                $scope.hlsHost = hlsHost;
                $scope.offlineVideoLink = offlineVideoLink;
                $scope.startTime = startTime;
                $scope.width = width;
                $scope.height = height;
                $scope.isMute = isMute;
                $scope.showMobile = showMobile;
                if ($scope.starId && sessionService.userId() === $scope.starId) {
                    $scope.videoFlashLink = "/Content/Flash/streamer.swf";
                    $scope.videomode = "idol";
                }
                else {
                    $scope.videoFlashLink = "/Content/Flash/playermobile.swf";
                    $scope.videomode = "user";
                }

                var now = new Date();
                startTime = new Date(startTime);
                $scope.isShowToday = startTime.getDate() === now.getDate();
                if ($scope.starId == 5) {
                    $scope.offlineVideoLink = null;
                }
                $scope.$apply();

                //#region [Render Flash Player]

                //                var videoElement = $element.find(".flash-player");
                //                if (videoElement[0]) {
                //                    var template = kendo.template($("#flash-player-template").html());
                //                    videoElement.replaceWith(template({
                //                        videoFlashLink: $scope.videoFlashLink,
                //                        rtmpHost: $scope.rtmpHost,
                //                        streamKey: $scope.streamKey,
                //                        isMute: $scope.isMute
                //                    }));

                if ($scope.pageStatus === "user") {
                    $timeout(function () {
                        var player = document.getElementById("flash-player");
                        try {
                            if (player.jsCallGetStatus() === 1)
                                return;
                        } catch (ex) {
                            $scope.showStartFlashButton = true;
                            $scope.$apply();
                        }
                    }, 2000);
                }
                //                }

                //#endregion

                $scope.$apply();
            };

            this.loadStarInfo = function (starId) {
                $scope.starId = starId;
                webService.call({
                    name: "User_GetDetails",
                    data: {
                        actionUserId: sessionService.userId(),
                        userId: $scope.starId,
                        isStar: true,
                        key: sessionService.key()
                    },
                    onError: function (errorCode, message) {
                        $scope.starError = message;
                        $scope.starStatus = "error";
                        $scope.$apply();
                    },
                    onSuccess: function (r) {
                        sessionService.setlevel('level' + r.Result.GroupLevel.Id);

                        webService.call({
                            name: "GetTimeIdolStarShow",
                            data: {
                                actionUserId: sessionService.userId(),
                                scheduleId: $scope.scheduleId,
                                starId: $scope.starId,
                                key: sessionService.key()
                            },
                            onError: function (errorCode, message) {
                                $scope.starError = message;
                                $scope.starStatus = "error";
                                $scope.$apply();
                            },
                            onSuccess: function (timeShow) {
                                $scope._ctrl.setStarInfo(
                                    r.Result.User.Name,
                                    r.Result.User.AvatarPhoto,
                                    r.Result.UserStarData ? r.Result.UserStarData.CoinGetFromGift : undefined,
                                    r.Result.UserStarData ? r.Result.UserStarData.TotalFreeCoinGet : undefined,
                                    r.Result.GroupLevel.Name,
                                    r.Result.GroupLevel.Photo,
                                    r.Result.NextGroupLevel ? r.Result.NextGroupLevel.Name : undefined,
                                    r.Result.NextGroupLevel ? r.Result.NextGroupLevel.Photo : undefined,
                                    r.Result.UserStarData && r.Result.NextGroupLevel ? r.Result.NextGroupLevel.Point - r.Result.UserStarData.CoinGetFromGift : undefined,
                                    r.Result.UserStarData && r.Result.NextGroupLevel ? Math.min(Math.round((r.Result.UserStarData.CoinGetFromGift - r.Result.GroupLevel.Point) / (r.Result.NextGroupLevel.Point - r.Result.GroupLevel.Point) * 100), 100) : undefined);
                                $scope._ctrl.setStarEvent(r.Result.TotalStar);
                                $scope.starStarShow = timeShow.Result;
                                $scope.starFollowStatus = r.Result.FollowByInfo ? r.Result.FollowByInfo.Status : undefined;
                                $scope.starFacebookLink = r.Result.UserStarData.Facebook;

                                $scope.starStatus = "loaded";
                                $scope.$apply();
                            }
                        });
                    }
                });
            };

            this.setStarInfo = function (name, avatar, coinGet, freeCoinGet, levelName, levelPhoto, nextLevelName, nextLevelPhoto, nextLevelNeed, nextLevelProgress) {
                $scope.starName = name;
                $scope.starAvatar = avatar;
                $scope.starLevelName = levelName;
                $scope.starLevelPhoto = levelPhoto;
                if (nextLevelName && nextLevelPhoto) {
                    $scope.starNextLevelName = nextLevelName;
                    $scope.starNextLevelPhoto = nextLevelPhoto;
                } else {
                    $scope.starNextLevelName = undefined;
                    $scope.starNextLevelPhoto = undefined;
                }
                $scope.starNextLevelNeed = nextLevelNeed;
                $scope.starNextLevelProgress = nextLevelProgress;
                $scope.starCoinGet = coinGet;
                $scope.starFreeCoinGet = freeCoinGet;
                $scope.$apply();
            };

            this.setStarEvent = function (totalStar) {
                $scope.totalStar = totalStar;
                $scope.$apply();
            };

            this.loadSeat = function (scheduleId) {
                $scope.scheduleId = scheduleId;

                $("#dropdown-seat").on("show", function (event, dropdownData) {
                    dropdownData.jqDropdown.css("top", (dropdownData.trigger.position().top + 70) + "px");
                    dropdownData.jqDropdown.css("left", (dropdownData.trigger.position().left + 30) + "px");

                    var seat = $scope.listSeat[dropdownData.trigger.data("index") - 1];

                    $scope.seatCurrentIndex = seat.index;
                    if (seat.userId) {
                        $scope.seatCurrentUserId = seat.userId;
                        $scope.seatCurrentPrice = seat.currentPrice;
                        $scope.seatCurrentCreateDate = seat.createDate;
                        $scope.seatCurrentEndDate = seat.endDate;
                    } else {
                        $scope.seatCurrentUserId = undefined;
                        $scope.seatCurrentPrice = undefined;
                    }
                    $scope.$apply();
                });

                $scope._ctrl.refreshSeat();
            };

            this.refreshSeat = function () {
                webService.call({
                    name: "ShowItem_UserGetListShowItemPrice",
                    data: {
                        actionUserId: sessionService.userId(),
                        pageIndex: 0,
                        pageSize: 999999,
                        minPrice: 0,
                        key: sessionService.key()
                    },
                    onError: function (errorCode, message) {
                        $scope.seatError = message;
                        $scope.seatStatus = "error";
                        $scope.$apply();
                    },
                    onSuccess: function (listPriceResult) {
                        $scope.listSeatPrice = [];
                        $(listPriceResult.Items).each(function (i, x) {
                            $scope.listSeatPrice.push(x.ShowItemPrice.Price);
                        });
                        webService.call({
                            name: "List_GetListUserBuySeatInShow",
                            data: {
                                actionUserId: sessionService.userId(),
                                scheduleId: $scope.scheduleId,
                                key: sessionService.key()
                            },
                            onError: function (errorCode, message) {
                                $scope.seatError = message;
                                $scope.seatStatus = "error";
                                $scope.$apply();
                            },
                            onSuccess: function (r) {

                                $scope.listSeat = new Array(5);

                                for (var index = 1; index <= 5; index++) {
                                    var seat = { index: index };

                                    $(r.Items).each(function (i, x) {
                                        if (JSON.parse(x.UserShowItem.Info).Index === index) {
                                            seat.userId = x.UserInfo.Id;
                                            seat.avatar = x.UserInfo.AvatarPhoto;
                                            seat.name = x.UserInfo.Name;
                                            seat.currentPrice = x.UserShowItem.CurrentPrice;
                                            seat.createDate = x.UserShowItem.CreateDate;
                                            seat.endDate = x.UserShowItem.EndTime;
                                            return false;
                                        }
                                    });
                                    $scope.listSeat[index - 1] = seat;
                                }
                                $(listPriceResult.Items).each(function (i, x) {
                                    if (x.ShowItemPrice.Price == $scope.listSeat[0].currentPrice) {
                                        $scope.listSeat[0].imageseat = x.ShowItemPrice.Photo;
                                        $scope.listSeat[0].Animation = x.ShowItemPrice.Animation;
                                    }
                                    if (x.ShowItemPrice.Price == $scope.listSeat[1].currentPrice) {
                                        $scope.listSeat[1].imageseat = x.ShowItemPrice.Photo;
                                        $scope.listSeat[1].Animation = x.ShowItemPrice.Animation;
                                    }
                                    if (x.ShowItemPrice.Price == $scope.listSeat[2].currentPrice) {
                                        $scope.listSeat[2].imageseat = x.ShowItemPrice.Photo;
                                        $scope.listSeat[2].Animation = x.ShowItemPrice.Animation;
                                    }
                                    if (x.ShowItemPrice.Price == $scope.listSeat[3].currentPrice) {
                                        $scope.listSeat[3].imageseat = x.ShowItemPrice.Photo;
                                        $scope.listSeat[3].Animation = x.ShowItemPrice.Animation;
                                    }
                                    if (x.ShowItemPrice.Price == $scope.listSeat[4].currentPrice) {
                                        $scope.listSeat[4].imageseat = x.ShowItemPrice.Photo;
                                        $scope.listSeat[4].Animation = x.ShowItemPrice.Animation;
                                    }
                                });
                                $scope.seatStatus = "loaded";
                                $scope.$apply();
                            }
                        });
                    }
                });
            };

            this.setSeat = function (index, userId, name, avatar, currentPrice, photo, Animationphoto,CreateDate,EndDate) {
                var seat = {
                    index: index,
                    userId: userId,
                    avatar: avatar,
                    imageseat: photo,
                    Animation: Animationphoto,
                    name: name,
                    currentPrice: currentPrice,
                    createDate: CreateDate,
                    endDate: EndDate
                };
                console.log(seat);
                $scope.listSeat[index - 1] = seat;
                $scope.$apply();
            };

            //#endregion

            //#region [Callback]

            // onAfterBuySeat(index, coin)
            // onFullscreenChange(isFullscreenMode)
            // onFacebookLiveViewsChanged(count)

            //#endregion

            //#region [Event]

            $scope.$on("$destroy", function () {
                //$interval.cancel($scope.qualityChecker);
                $interval.cancel($scope.liveChecker);
            });

            $scope.onBuySeat = function ($event) {
                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var $target = $($event.target);
                var $priceElement = $target.find(".price");
                var $buttonElement = $target.find("[type=submit]");

                var index = $target.attr("data-current-index") * 1;
                var coin = $priceElement.val();

                if ($scope.helper.isLoading($buttonElement))
                    $buttonElement.button("loading");

                webService.call({
                    type: "POST",
                    name: "User_BuySeatInShow",
                    data: {
                        actionUserId: sessionService.userId(),
                        index: index,
                        scheduleId: $scope.scheduleId,
                        coin: coin,
                        isInEvent: false,
                        key: sessionService.key(),
                        plaform: 1
                    },
                    displayError: true,
                    onError: function (errorCode, message) {
                        $buttonElement.button("reset");
                    },
                    onSuccess: function (r) {
                        $("#dropdown-seat").jqDropdown("hide");
                        $buttonElement.button("reset");
                        $scope.$apply();

                        // $scope._ctrl.refreshSeat();

                        if (typeof $scope._ctrl.onAfterBuySeat === "function")
                            $scope._ctrl.onAfterBuySeat(index, coin);
                    }
                });
            };

            $scope.onStartFlash = function ($event) {
                if ($scope._ctrl.startFlash() === false) {
                    modalService.showAlert({
                        title: "Lỗi",
                        message: "Có lỗi trong quá trình mở Video. Xin kiểm tra chắc chắn trình duyệt bạn có cho phép sử dụng Adobe Flash. Xin đảm bảo trình duyệt bạn đang sử dụng là phiên bản mới nhất. Hoặc liện hệ hỗ trợ để nhận được sự giúp đỡ",
                        buttons: [
                            { text: "Đóng", style: "btn-default", closeModal: true },
                        ]
                    });
                }
            };

            $scope.onShareFacebook = function ($event) {
                if (typeof $scope._ctrl.onShareFacebook === "function") {
                    $scope._ctrl.onShareFacebook();
                }
            };

            $scope.onFullscreen = function ($event) {
                var $document = $("html")[0];

                if ($scope.supportFullScreen && $scope.addFullscreenHandler === false) {
                    $document.addEventListener(fullScreenApi.fullScreenEventName, function () {
                        $scope.isFullScreen = fullScreenApi.isFullScreen();
                        if (typeof $scope._ctrl.onFullscreenChange === "function")
                            $scope._ctrl.onFullscreenChange($scope.isFullScreen);
                    }, true);
                    $scope.addFullscreenHandler = true;
                }

                window.fullScreenApi.requestFullScreen($document);
            };

            $scope.onFlashQualityCheck = function (data) {
                if (!data || !data.video)
                    return;

                if ($scope.quality.current.id === "0" && (data.video < 300 || data.video > 2000))
                    $scope.qualityIsOk = false;
                else if (data.video > 2000)
                    $scope.qualityIsOk = false;
                else
                    $scope.qualityIsOk = true;
            };

            $scope.$watch("quality.current", function (data) {
                if ($scope._ctrl.stopFlash()) {
                    $scope._ctrl.startFlash();
                }
            });

            $scope.onQuickLiveFacebook = function ($event) {
                FB.ui({
                    display: "popup",
                    method: "live_broadcast",
                    phase: "create"
                }, function (response) {
                    if (!response.id)
                        return;

                    var fbStreamHost, fbStreamKey;
                    for (var i = response.stream_url.length - 1; i >= 0; i--) {
                        if (response.stream_url[i] === "/") {
                            fbStreamHost = response.stream_url.substr(0, i);
                            fbStreamKey = response.stream_url.substr(i + 1, response.stream_url.length);
                            break;
                        }
                    }

                    $scope.player.jsCallStartStream1({
                        host: fbStreamHost,
                        chanel: fbStreamKey
                    });

                    FB.ui({
                        display: "popup",
                        method: "live_broadcast",
                        phase: "publish",
                        broadcast_data: response
                    }, function (response) { });
                });
            };

            $scope.onLiveFacebook = function ($event) {
                if ($scope.facebookLive.handle) {
                    modalService.showAlert({
                        title: "Kết thúc Facebook Live",
                        message: "Bạn muốn ngắt kênh Facebook Live đang sử dụng",
                        buttons: [
                            {
                                text: "Không",
                                style: "btn-default",
                                closeModal: true
                            },
                            {
                                text: "Có",
                                style: "btn-default",
                                closeModal: true,
                                onClick: function () {
                                    if (!$scope.facebookLive.isCustom) {
                                        apiService.post({
                                            module: "Teenidol.Admin.LiveFacebook",
                                            method: "StopCurrentLive",
                                            data: {
                                                starId: sessionService.userId(),
                                                session: sessionService.key(),
                                            }
                                        });
                                    }

                                    $interval.cancel($scope.facebookLive.handle);
                                    $scope.facebookLive.handle = undefined;
                                    $scope.player.jsCallStopStream1({});
                                    Notification.success("Đã kết thúc Facebook Live");
                                }
                            }
                        ]
                    });

                    if (typeof $scope._ctrl.onFacebookLiveViewsChanged === "function")
                        $scope._ctrl.onFacebookLiveViewsChanged(undefined);
                    return;
                }

                if (!$scope.player || $scope.player == null) {
                    modalService.showAlert({
                        title: "Lỗi",
                        message: "Facebook Live Stream đã kết thúc.",
                        buttons: [
                            {
                                text: "Đóng",
                                style: "btn-default",
                                closeModal: true
                            }
                        ]
                    });
                    return;
                }

                if ($scope.player.jsCallGetBitRate() === null) {
                    modalService.showAlert({
                        title: "Lỗi",
                        message: "Bạn cần nhấn nút thu hình ở Teenidol trước khi share lên facebook.",
                        buttons: [
                            {
                                text: "Đóng",
                                style: "btn-default",
                                closeModal: true
                            }
                        ]
                    });
                    return;
                }

                if ($scope.showStatus !== 2) {
                    modalService.showAlert({
                        title: "Lỗi",
                        message: "Bạn cần bắt đầu show để tiến hành live stream facebook.",
                        buttons: [
                            {
                                text: "Đóng",
                                style: "btn-default",
                                closeModal: true
                            }
                        ]
                    });
                    return;
                }

                modalService.showFacebookLive({
                    scheduleId: $scope.scheduleId,
                    showId: $scope.showId,
                    player: $scope.player,
                    onSuccess: function (streamResult) {
                        $scope.facebookLive.isCustom = streamResult.isCustom;

                        if ($scope.facebookLive.handle !== undefined || $scope.facebookLive.handle !== null) {
                            $interval.cancel($scope.facebookLive.handle);
                            $scope.facebookLive.handle = undefined;
                        }

                        if ($scope.facebookLive.isCustom)
                            return;

                        $scope._ctrl.liveCheck();
                    }
                });
            };

            $scope.$on("signalrOnGoLive", function ($event, data) {
                $scope._ctrl.liveCheck();
            });

            $scope.$on("signalrOnStopLive", function ($event) {
                $scope._ctrl.liveCheck();
            });

            this.onLoadPopup = function (link) {
                $scope.ShowHide = false;

                if (link === 1) {
                    $scope.popupcontent = null;
                    $scope.loadPopup = "loading";
                    $scope.ShowHide = false;

                } else {
                    $scope.popupcontent = link;
                    $scope.loadPopup = "loaded";
                    $scope.ShowHide = true;
                }
                $scope.$apply();
            }

            $scope._ctrl.liveCheck = function () {
                if (sessionService.userId() !== $scope.starId)
                    return;
                if ($scope.player === undefined || $scope.player == null)
                    return;
                if ($scope.player.jsCallGetBitRate() === null)
                    return;
                if ($scope.showStatus !== 2)
                    return;

                apiService.get({
                    module: "Teenidol.Admin.LiveFacebook",
                    method: "GetStarLiveInfo",
                    data: {
                        starId: sessionService.userId(),
                        session: sessionService.key(),
                    },
                    onSuccess: function (r) {
                        if (r.Data !== null && $scope.facebookLive.current.LiveId === r.Data.LiveId) {
                            if (r.Data.LiveId !== null && $scope.player.jsCallGetBitRate1() === null) {
                                $scope.player.jsCallStartStream1({
                                    host: r.Data.LiveLink.substr(0, r.Data.LiveLink.lastIndexOf('/')),
                                    chanel: r.Data.LiveLink.substr(r.Data.LiveLink.lastIndexOf('/') + 1)
                                });
                            }
                            return;
                        }
                        $scope.facebookLive.current = r.Data;

                        if ($scope.facebookLive.handle) {
                            $interval.cancel($scope.facebookLive.handle);
                            $scope.facebookLive.handle = undefined;
                            $scope.player.jsCallStopStream1({});

                            if (typeof $scope._ctrl.onFacebookLiveViewsChanged === "function")
                                $scope._ctrl.onFacebookLiveViewsChanged(undefined);
                        }

                        if ($scope.facebookLive.current.LiveId === null) {
                            Notification.success("Đã tắt kênh stream");
                            return;
                        }

                        $scope.player.jsCallStartStream1({
                            host: r.Data.LiveLink.substr(0, r.Data.LiveLink.lastIndexOf('/')),
                            chanel: r.Data.LiveLink.substr(r.Data.LiveLink.lastIndexOf('/') + 1)
                        });

                        $scope.facebookLive.handle = $interval(function () {
                            if ($scope.facebookLive.handle === undefined)
                                return;
                            if (!$scope.player || $scope.player == null)
                                return;
                            if ($scope.player.jsCallGetBitRate() === null)
                                return;
                            if ($scope.showStatus !== 2)
                                return;

                            if ($scope.facebookLive.isBusy) return;
                            $scope.facebookLive.isBusy = true;

                            FB.api("/" + $scope.facebookLive.current.LiveId + "?fields=live_views,seconds_left&access_token=" + $scope.facebookLive.current.LiveToken, function (r) {
                                if (r.error) {
                                    return;
                                } else {
                                    var s = r.seconds_left;

                                    $scope.facebookLive.minutesLeft = parseInt(s / 60);
                                    $scope.facebookLive.secondsLeft = s % 60;
                                }

                                if ($scope.facebookLive.liveViews !== r.live_views) {
                                    $scope.facebookLive.liveViews = r.live_views;

                                    if (typeof $scope._ctrl.onFacebookLiveViewsChanged === "function")
                                        $scope._ctrl.onFacebookLiveViewsChanged($scope.facebookLive.liveViews);
                                }

                                FB.api("/" + $scope.facebookLive.current.LiveId + "/comments?order=reverse_chronological&access_token=" + $scope.facebookLive.current.LiveToken, function (r) {
                                    $scope.facebookLive.isBusy = false;
                                    if (r && !r.error && r.data[0] && r.data[0].id !== $scope.facebookLive.lastCommentId) {
                                        $scope.facebookLive.lastCommentId = r.data[0].id;
                                        if (typeof $scope._ctrl.onFacebookLiveNewComment === "function")
                                            $scope._ctrl.onFacebookLiveNewComment(r.data[0]);
                                    }
                                });
                            });
                        }, 500);
                    }
                });

                if ($scope.facebookLive.current.LiveToken !== undefined && $scope.facebookLive.current.LiveToken !== null
                        && ($scope.facebookLive.lastAutoCommentId === undefined || $scope.facebookLive.lastCommentId !== $scope.facebookLive.lastAutoCommentId)
                        && ($scope.facebookLive.current.lastAutoCommentTime === undefined || (new Date() - $scope.facebookLive.current.lastAutoCommentTime) / 60000 > 5)) {

                    apiService.get({
                        module: "Teenidol.Admin.LiveFacebook",
                        method: "GetRandomComment",
                        data: {
                            starId: sessionService.userId(),
                            session: sessionService.key(),
                        },
                        onSuccess: function (r) {
                            if (r.Data === undefined || r.Data === null)
                                return;

                            FB.api("/" + $scope.facebookLive.current.LiveId,
                                {
                                    "fields": "video",
                                    "access_token": $scope.facebookLive.current.LiveToken
                                },
                                function (r1) {
                                    if (r1 && !r1.error) {
                                        FB.api("/" + r1.video.id + "/comments",
                                            "POST",
                                            {
                                                "message": r.Data,
                                                "access_token": $scope.facebookLive.current.LiveToken
                                            },
                                            function (r2) {
                                                if (r2 && !r2.error) {
                                                    $scope.facebookLive.lastAutoCommentId = r2.id;
                                                    $scope.facebookLive.lastCommentId = r2.id;
                                                    $scope.facebookLive.current.lastAutoCommentTime = new Date();
                                                }
                                            });
                                    }
                                });
                        }
                    });
                }
            };

            $scope._ctrl.liveCheck();
            $scope.liveChecker = $interval($scope._ctrl.liveCheck, 60000);

            //#endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "/Views/UserControl/ucShowVideo.html",
            controller: controller
        };
    }
]);