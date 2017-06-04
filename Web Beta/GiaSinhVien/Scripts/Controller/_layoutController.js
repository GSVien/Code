giasinhvienApp.controller("layoutController", ["$window", "$http", "$scope", "$rootScope", "$location", "$cookies",
    "helperService", "authenticationService", "Notification", "formService",
    "webService", "modalService",
function ($window, $http, $scope, $rootScope, $location, $cookies,
    helperService, authenticationService, Notification, formService,
    webService, modalService) {
    //#region [Field]

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
    $scope.ListCategory = [
        {
            Id: 1,
            Name: "Đồ Điện Tử",
            Photo: null,
            Status: 1
        },
        {
            Id: 2,
            Name: "Xe Cộ",
            Photo: null,
            Status: 1
        },
        {
            Id: 3,
            Name: "Bất Động Sản",
            Photo: null,
            Status: 1
        },
        {
            Id: 4,
            Name: "Thời Trang Phụ Kiện",
            Photo: null,
            Status: 1
        },
        {
            Id: 6,
            Name: "Đồ Gia Dụng",
            Photo: null,
            Status: 1
        },
        {
            Id: 7,
            Name: "Nội Ngoại Thất",
            Photo: null,
            Status: 1
        },
        {
            Id: 8,
            Name: "Giải Trí Thể Thao",
            Photo: null,
            Status: 1
        },
        {
            Id: 9,
            Name: "Đồ Dùng Văn Phòng,Công Nông Nghiệp",
            Photo: null,
            Status: 1
        },
        {
            Id: 10,
            Name: "Sách Báo Đồ Nghệ Thuật",
            Photo: null,
            Status: 1
        },
        {
            Id: 13,
            Name: "Vật Nuôi,Thú Cưng",
            Photo: null,
            Status: 1
        },
        {
            Id: 14,
            Name: "Dịch Vụ,Việc Làm",
            Photo: null,
            Status: 1
        },
        {
            Id: 15,
            Name: "Các Loại Khác",
            Photo: null,
            Status: 1
        }
    ];
    console.log($scope.ListCategory);
    //#region [Service]

    //webService.call({
    //    name: "GetListCategory",
    //    data: {
    //        key:"sdgsg"
    //    },

    //    onError: function (errorCode, message) {
    //    },

    //    onSuccess: function (r) {
    //        console.log(r);
    //        $scope.ListCategory = r;
    //        if (!$scope.$$phase) $scope.$apply();
    //    },
    //});

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


    //#endregion

    //#region [Event]


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

    $scope.redirectlink = function (link) {
        if (!$scope.showvideo) {
            $scope.showvideo = true;
        } else {
            $scope.showvideo = false;
        }
    }


    //#endregion

    //#region [On Load]

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

    //#endregion
}
]);