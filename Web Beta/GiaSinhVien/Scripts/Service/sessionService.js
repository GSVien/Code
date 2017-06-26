giasinhvienApp.factory("sessionService", [
    "$rootScope", "$http", "$interval", "$cookies", "webService", "helperService", "Notification",
    function ($rootScope, $http, $interval, $cookies, webService, helperService, Notification) {
        var _userId, _key, _data, _level,_groupUserId;
        var _status = "unloaded";

        var service = new function () {
            this.isSigned = function () {
                return !isNoU(_userId) && _data !== undefined;
            };

            this.isLoaded = function () {
                return _status === "loaded";
            };

            this.userId = function () {
                if (_userId)
                    return _userId;
                return -1;
            };

            this.groupUserId = function () {
                if (_groupUserId)
                    return _groupUserId;
                return -1;
            };

            this.vipId = function () {
                if (_data && _data.user && _data.user.VipItem && _data.user.VipItem.Id)
                    return _data.user.VipItem.Id;
                else
                    return -1;
            };

            this.key = function () {
                if (_key)
                    return _key;
                return "";
            };

            this.data = function () {
                return _data;
            }

            this.clear = function () {
                _userId = undefined;
                _key = undefined;
                _data = undefined;
                _groupUserId = undefined;
                $cookies.remove("session");
            };

            this.set = function (userId,  onDone) {
                _userId = userId;

                //webService.call({
                //    name: "GetUserInfo",
                //    data: { id: _userId },
                //    onError: function (error, msg) {
                //        Notification.error(msg + "! Vui lòng F5 để tải lại");
                //        service.clear();
                //    },
                //    onSuccess: function (r) {
                //        _data = {
                //            user: r.Result
                //        };
                //        _groupUserId = r.Result.GroupId;
                //        $cookies.putObject("session", {
                //            userId: _userId,
                //        }, {
                //            expires: moment().add(7, "days").toDate()
                //        });
                //        if (typeof onDone === "function")
                //            onDone();
                //    }
                //});
            };

            this.levelidol = function () {
                return _level;
            }

            this.clearlevel = function () {
                _level = undefined;
                $cookies.remove("sessionlevel");
            };

            this.setlevel = function (level) {
                _level = level;
                $cookies.putObject("sessionlevel", {
                    _level: level,
                }, {
                    expires: moment().add(1, "days").toDate()
                });

            };
            this.load = function () {
                if (_status !== "unloaded")
                    return;
                _status = "loading";

                var data = $cookies.getObject("session");
                if (!data) {
                    _status = "loaded";
                    $rootScope.$broadcast("session_onLoad");
                } else {
                    service.set(data.userId, data.key, function () {
                        _status = "loaded";
                        $rootScope.$broadcast("session_onLoad");
                    });
                }
            };

            this.reload = function () {
                //webService.call({
                //    name: "User_GetDetails",
                //    data: { actionUserId: _userId, userId: _userId, isStar: true, key: _key },
                //    onSuccess: function (r) {
                //        _data = {
                //            user: r.Result
                //        };
                //        $rootScope.$apply();
                //    }
                //});
            };


            this.isReady = function (callback) {
                console.log("safafa");
                var handler = $interval(function () {
                    if (_status !== "loaded")
                        return;

                    $interval.cancel(handler);
                    angular.element(document).ready(callback);
                }, 100);
            };

            this.getFingerprint = function (callback) {
                new Fingerprint2({ excludeLanguage: true, excludeCpuClass: true, excludePlatform: true, excludeAdBlock: true, excludeHasLiedOs: true }).get(function (r) {
                    callback(r);
                });
            };
        };
        return service;
    }
]);