giasinhvienApp.factory("signalRService", ["mogolab_config",
    function (mogolab_config) {
        var _hostLink = mogolab_config.baseUrlSignalRService;
        //var _hostLink = "http://teenidol.vn:1239";
        //var _hostLink = "http://teenidol.vn:1235";
        var _hub;

        $("head").append("<script type='text/javascript' src='" + _hostLink + "/signalr/hubs'></script>");

        var service = new function () {
            this.hub = function () {
                return _hub;
            };

            this.createConnection = function (o) {
                //#region [Validation]

                o = getOrDefault(o, {});
                if (o.onInit && typeof o.onInit !== "function")
                    throw "onInit must be function";
                if (o.onSuccess && typeof o.onSuccess !== "function")
                    throw "onSuccess must be function";

                //#endregion

                var connection = $.hubConnection(_hostLink + "/signalr", { useDefaultPath: false });
                connection.qs = o.queryString;

                _hub = connection.createHubProxy("teenidol");

                if (o.onInit)
                    o.onInit(_hub);
                connection.start({ waitForPageLoad: false })
                    .done(function () {
                        if (o.onSuccess)
                            o.onSuccess(_hub);
                    })
                    .fail(function (r) {
                        if (o.onError)
                            o.onError(r);
                    });
            };

            this.getShowCount = function (listId, success, error) {
                $.ajax({
                    url: "https://teenidol.vn:9239/showCount/" + listId.join(),
                    error: function () {
                        if (error && typeof error === "function")
                            error();
                    },
                    success: function (r) {
                        if (success && typeof success === "function")
                            success(r);
                    }
                });
            };
        };
        return service;
    }
]);