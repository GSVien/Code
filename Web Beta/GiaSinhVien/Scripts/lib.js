var _tfl = {
    pageVisibility: undefined
};

// Kiểm tra biến có null hoặc undefined 
function isNoU(variable) {
    return variable === undefined || variable === null;
};

// Kiểm tra chuỗi không bị undefined, null hoặc toàn ký tự khoảng trắng
function isNoUoW(variable) {
    return variable === undefined || variable === null || variable.trim() === "";
};

// Lấy giá trị mặc định cho biến trường hợp biến bị undefined
function getOrDefault(variable, defaultValue) {
    if (variable === undefined)
        return defaultValue;
    return variable;
}

// Định dạng số
function formatNumber(number, separator, thousand, million, billion) {
    //#region [Tham số mặc định]

    separator = getOrDefault(separator, ",");

    //#endregion

    //#region [Kiểm tra tham số]

    if (isNoU(number))
        throw "'number' can not be null or undefined";

    //#endregion

    //#region [Rút gọn số]

    var tail;
    if (billion !== undefined && number > 1000000000) {
        tail = billion;
        number = Math.round(number / 1000000000);
    }
    else if (million !== undefined && number > 1000000) {
        tail = million;
        number = Math.round(number / 1000000);
    }
    else if (thousand !== undefined && number > 1000) {
        tail = thousand;
        number = Math.round(number / 1000);
    }

    //#endregion

    // Cách phần nghìn
    number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    if (isNoUoW(tail))
        return number;
    return number + tail;
}

// Chuyển hình thành base64
function convertImgToBase64(url, callback, outputFormat) {
    //#region [Tham số mặc định]

    outputFormat = getOrDefault(outputFormat, "image/jpeg");

    //#endregion

    //#region [Kiểm tra tham số]

    if (isNoU(url))
        throw "'url' can not be null or undefined";
    if (isNoU(callback) || typeof callback !== "function")
        throw "'callback' must be a function";

    //#endregion
    
    var img = new Image();

    img.onload = function () {
        var canvas = document.createElement("CANVAS");

        var ctx = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);

        var dataUrl = canvas.toDataURL(outputFormat);
        canvas = undefined;

        callback(dataUrl);
    };

    img.onerror = function () {
        callback(undefined);
    };

    img.crossOrigin = "Anonymous";
    img.src = url;
}

// Kiểm tra xem trang có đang được người dùng focus hay không
function checkPageVisibility() {
    // Cài đặt Page Visibility
    if (isNoU(_tfl.pageVisibility)) {
        var visProp = null;

        if ("hidden" in document)
            visProp = "hidden";
        else {
            var prefixes = ["webkit", "moz", "ms", "o"];
            for (var i = 0; i < prefixes.length; i++) {
                if ((prefixes[i] + "Hidden") in document) {
                    visProp = prefixes[i] + "Hidden";
                    break;
                }
            }
        }

        if (visProp === null) {
            console.warn("Your browser is not supported Page Visibility API");
            return undefined;
        }
        else {
            _tfl.pageVisibility = true;

            var eventName = visProp.replace(/[H|h]idden/, "") + "visibilitychange";
            document.addEventListener(eventName, function () {
                _tfl.pageVisibility = !document[visProp];
            });
        }
    }

    return _tfl.pageVisibility;
};

// Bộ phân giải URL Query
function query(link) {
    var url;
    var r = {};

    if (isNoU(link))
        url = window.location.search;
    else {
        url = "";
        link = link.split("?");
        if (link[1])
            url = "?" + link[1];
    }

    if (url === "")
        return r;

    url = url.substring(1).split("&");
    for (var i = 0; i < url.length; i++) {
        var x = url[i];
        r[x.split("=")[0]] = x.split("=")[1];
    }

    r.toString = function () {
        var s = "";
        for (x in this) {
            if (x === "toString")
                continue;
            s += "&" + x + "=" + this[x];
        }

        if (s !== "")
            s = "?" + s.substring(1);
        return s;
    };

    return r;
};

// Canh giữa Bootstrap Modal
function modalReposition(element) {
    var modal = element;
    var dialog = modal.find(".modal-dialog");

    modal.css("display", "block");
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}