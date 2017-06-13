giasinhvienApp.factory("webService", [
    "Notification", "mogolab_config", function (Notification, mogolab_config) {
        var _hostLink = mogolab_config.baseUrlWebService;
        //var _hostLink = "https://teenidol.vn:9240/TeenIdolsService.svc/";
        //var _hostLink = "https://teenidol.vn:9236/TeenIdolsService.svc/";
        var service = new function () {
            this.call = function (o) {
                //#region [Validation]

                if (!o || typeof o !== "object")
                    return undefined;
                if (isNoUoW(o.name))
                    throw "name must be declared";
                o.type = getOrDefault(o.type, "GET").trim().toUpperCase();
                if (o.type !== "GET" && o.type !== "POST")
                    throw "type must be 'GET' or 'POST'";
                if (o.onSuccess && typeof o.onSuccess !== "function")
                    throw "success must be function type";
                if (o.onError && typeof o.onError !== "function")
                    throw "error must be function type";
                o.displayError = getOrDefault(o.displayError, false);
                if (o.displayError && typeof o.displayError !== "boolean")
                    throw "displayError must be boolean type";
                //#endregion
                $.ajax({
                    url: _hostLink + o.name,
                    type: o.type,
                    dataType: o.type === "GET" ? undefined : "text",
                    contentType: o.type === "GET" ? undefined : "application/json",
                    data: o.type === "GET" ? o.data : JSON.stringify(o.data),
                    error: function () {
                        if (o.displayError)
                            Notification.error("Có lỗi, xin thử lại");
                        if (o.onError)
                            o.onError();
                    },
                    success: function (response) {
                        if (response && typeof response === "string" && response.indexOf("$Exception$") !== -1) {
                            if (o.displayError)
                                Notification.error(response);
                            if (o.onError)
                                o.onError();
                        }
                        if (response && o.type === "POST") {
                            try {
                                response = JSON.parse(response);
                            } catch (e) { }
                        }

                        if ((isNoU(response.ErrorCode) === false && response.ErrorCode > 0) || (isNoU(response.errorCode) === false && response.errorCode > 0)) {
                            if (o.displayError)
                                Notification.error(response.Message ? response.Message : response.message);
                            if (o.onError)
                                o.onError(response.ErrorCode ? response.ErrorCode : response.errorCode, response.Message ? response.Message : response.message);
                        } else {
                            if (o.onSuccess)
                                o.onSuccess(response);
                        }
                    }
                });
            }
        };
        return service;
    }
]);