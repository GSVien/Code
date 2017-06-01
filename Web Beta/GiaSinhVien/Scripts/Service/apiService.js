giasinhvienApp.factory("apiService", ["$rootScope", "mogolab_config", "Notification",
    function ($rootScope, config, notification) {
        var service = new function () {
            this.call = function (o) {
                if (o === undefined) o = {}
                o.type = o.type === undefined ? "GET" : o.type.toUpperCase();
                o.async = o.async === undefined ? true : o.async;

                if (o.type !== "GET" && o.type !== "POST")
                    throw "'type' must be GET or POST";
                if (o.module === undefined)
                    throw "'module' is undefined";
                if (o.method === undefined)
                    throw "'method' is undefined";
                if (o.onDone !== undefined && typeof o.onDone !== "function")
                    throw "'onDone' must be function";
                if (o.onError !== undefined && typeof o.onError !== "function")
                    throw "'onError' must be function";
                if (o.onSuccess !== undefined && typeof o.onSuccess !== "function")
                    throw "'onSuccess' must be function";

                if (o.data === undefined || o.data === null)
                    o.data = {};
                o.data.timezoneOffset = moment().utcOffset();

                $.ajax({
                    url: config.baseManagerService + "/" + o.module + "/" + o.method,
                    type: o.type,
                    contentType: o.type === "GET" ? undefined : "application/json",
                    data: o.type === "GET" ? o.data : JSON.stringify(o.data),
                    async: o.async,
                    error: function (r, t, str) {
                        if (o.onDone)
                            o.onDone();

                        var msg = "Có lỗi từ phía máy chủ";
                        if (r.responseJSON.Status)
                            msg = r.responseJSON.Message;
                        else
                            msg += ": " + r.statusText;

                        if (o.displayError)
                            notification.error(msg);
                        if (o.onError)
                            o.onError(msg);

                        if (!$rootScope.$$phase) $rootScope.$apply();
                    },
                    success: function (r) {
                        if (o.onDone)
                            o.onDone();

                        if (r.Status === undefined || r.Status !== 0) {
                            if (o.displayError)
                                notification.error(r.Message);
                            if (o.onError)
                                o.onError(r.Message);
                        } else if (o.onSuccess)
                            o.onSuccess(r);

                        if (!$rootScope.$$phase) $rootScope.$apply();
                    }
                });
            };
         
            this.get = function (o) {
                if (o === undefined) o = {}
                o.type = "GET";
                return service.call(o);
            };

            this.post = function (o) {
                if (o === undefined) o = {}
                o.type = "POST";
                return service.call(o);
            };
        };
        return service;
    }
]);