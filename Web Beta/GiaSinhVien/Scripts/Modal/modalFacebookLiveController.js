giasinhvienApp.controller("modalFacebookLiveController", ["$scope", "$uibModalInstance", "data", "Notification", "webService", "sessionService", "apiService",
    function ($scope, $uibModalInstance, data, notification, webService, sessionService, apiService) {
        //#region [Field]

        $scope.customStream = {
            host: undefined,
            key: undefined
        };
        $scope.message = undefined;
        $scope.pageId = undefined;
        $scope.locations = {
            list: [
                { id: 0, text: "Trang cá nhân" },
                { id: 1, text: "Fan Page của tôi" },
                { id: 2, text: "Facebook Stream Link" }
            ],
            selected: undefined
        };
        $scope.liststatus = [
            {
                status: "Mọi người vào #Teenidol chơi với e nhé! Muốn xem e đẹp hơn, âm thanh hay hơn và ko lag thì mọi người vào link này nhé! :* \n" + "https://teenidol.vn/show/" + data.showId + "\n#livestreamteenidol",
            },
            {
                status: "Đố ai định nghĩa được chữ yêu \nCó khó gì đâu mà hỏi nhiều... \nVào #Teenidol xem em diễn \nNhìn thấy em cười thế là yêu! :*\n" + "https://teenidol.vn/show/" + data.showId + "\n#livestreamteenidol",
            },
            {
                status: "Để tiết kiệm tiền bạc và thời gian, chúng ta hãy... yêu nhau từ cái nhìn đầu tiên! :v \nMọi người vào chơi với e nhé! :*\n" + "https://teenidol.vn/show/" + data.showId + "\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Đẹp cũng chỉ để yêu, yêu kiều cũng chỉ để ngắm <3 <3 \nNhưng … vừa đẹp vừa đằm thắm thì say đắm cả đời ! :v \nMọi người vào chơi với e nhé! :*\n" + "https://teenidol.vn/show/" + data.showId + "\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Khi bạn buồn hãy gọi cho tôi, tôi không hứa sẽ làm bạn cười, nhưng tôi hứa … sẽ cười vào mặt bạn! =)) \nNói chứ ai buồn vào show coi e diễn là vui lại ngay mà! :*\n" + "https://teenidol.vn/show/" + data.showId + "\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Giang hồ hiểm ác em không sợ, chỉ sợ lên diễn không ai xem!:v \nBà coan cô bác zô show chơi với em nhé! :*\n" + "https://teenidol.vn/show/" + data.showId + "\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Em không hát hay :v \nNhưng em hay hát\nVào chơi với em nha <3\n" + "https://teenidol.vn/show/" + data.showId + "\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Vào " + "https://teenidol.vn/show/" + data.showId + " quẫy cùng em nào <3 <3 <3\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Anhonxeo :* Sáng zui zẻ, vào nghe em hát nhé <3 <3 <3\n" + "https://teenidol.vn/show/" + data.showId + "\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Lướt FB làm giề??? VÀO" + "https://teenidol.vn/show/" + data.showId + " chém gió với chế nè! <3\n#Teenidol #livestreamteenidol",
            },
            {
                status: "Nghĩ suy gì nữa mà không vào" + "https://teenidol.vn/show/" + data.showId + " đi nào!!! <3 <3 <3\n#Teenidol #livestreamteenidol",
            }
        ];

        $scope.locations.selected = $scope.locations.list[0];
        $scope.isBusy = false;

        //#endregion

        //#region [Event]

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        }

        $scope.onLive = function () {
            if ($scope.locations.selected.id === 1 && !$scope.pageId) {
                notification.error("Bạn chưa nhập Page Id");
                return;
            }
            if ($scope.locations.selected.id === 2 && (!$scope.customStream.host || !$scope.customStream.key)) {
                notification.error("Bạn chưa nhập thông tin Stream của Facebook");
                return;
            }

            if ($scope.locations.selected.id === 2) {
                data.player.jsCallStartStream1({
                    host: $scope.customStream.host,
                    chanel: $scope.customStream.key
                });

                $uibModalInstance.close({ isCustom: true });
                return;
            }

            var action = function (accessToken) {
                apiService.post({
                    module: "Teenidol.Admin.LiveFacebook",
                    method: "GoLiveSelf",
                    data: {
                        starId: sessionService.userId(),
                        scheduleId: data.scheduleId,
                        accessToken: accessToken,
                        postStatus: $scope.message,
                        session: sessionService.key(),
                    },
                    displayError: true,
                    onError: function () {
                        $scope.isBusy = false;
                    },
                    onSuccess: function (r) {
                        $scope.isBusy = false;
                        if (!$scope.$$phase) $scope.$apply();

                        data.player.jsCallStartStream1({
                            host: r.Data.LiveLink.substr(0, r.Data.LiveLink.lastIndexOf('/')),
                            chanel: r.Data.LiveLink.substr(r.Data.LiveLink.lastIndexOf('/') + 1)
                        });

                        $uibModalInstance.close(r.Data);
                    }
                });
            };

            $scope.isBusy = true;
            if (!$scope.$$phase) $scope.$apply();
            FB.getLoginStatus(function (response) {
                if (response.status === "connected")
                    action(response.authResponse.accessToken);
                else {
                    FB.login(function (response) {
                        if (response.error) {
                            notification.error(response.error.message);
                            return;
                        }
                        action(response.authResponse.accessToken);
                    }, { scope: "public_profile,email,publish_actions,manage_pages,publish_pages", auth_type: "reauthenticate" });
                }
            });
        }

        //#endregion
    }
]);