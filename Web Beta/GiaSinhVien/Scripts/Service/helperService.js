giasinhvienApp.factory("helperService", [
    function () {
        var service = new function () {
            this.formatMessage = function (message) {
                var m;
                
                //#region [Clear HTML]

                message = message.replace(/<[^<>]+>/gi, "");
                message = message.replace(/\\n/gi, "<br/>");

                //#endregion

                //#region [url Regex]
                function urlify(text) {
                    //var urlRegex = /(https?:\/\/[^\s]+)/g;
                    var urlRegex = /(https?:\/\/(?!file.teenidol|teenidol.vn\/Flash)[^\s]+)/g;
                    return text.replace(urlRegex, function (url) {
                        return '<a style="font-style: italic" href="' + url + '" target="_blank">' + url + '</a>';
                    });
                }

                //message = urlify(message);

                //#endregion

                //#region {user}
                
               
                m = message.match(/\{user(\|(\d+)){2}(\|([^|{}]*)){1}\}/g);
                $(m).each(function (i, x) {
                    try {
                        x = x.replace("{", "").replace("}", "");
                        x = x.substring(x.indexOf("|") + 1);
                        var id = parseInt(x.substring(0, x.indexOf("|")));
                        x = x.substring(x.indexOf("|") + 1);
                        var scheduleId = parseInt(x.substring(0, x.indexOf("|")));
                        x = x.substring(x.indexOf("|") + 1);
                        var name = urlify(x);
                        x = m[i];
                        if (id == 123456789) {
                            var r = "<span style='color:#f15d69;font-style: italic'>" + name + "</span>";
                        } else {
                            var r = "<a href='#' ud-role='user-popup' user-id='" + id + "' schedule-id='" + scheduleId + "'>" + name + "</a>";
                        }
                           
                        while (message.indexOf(x) !== -1) {
                            message = message.replace(x, r);
                        }
                       
                    } catch (ex) { }
                });

                m = message.match(/\{user(\|(\d+)){2}(\|([^|{}]*)){5}\}/g);
                $(m).each(function (i, x) {
                    try {
                        x = x.replace("{", "").replace("}", "");
                        x = x.substring(x.indexOf("|") + 1);
                        var id = parseInt(x.substring(0, x.indexOf("|")));
                        x = x.substring(x.indexOf("|") + 1);
                        var scheduleId = parseInt(x.substring(0, x.indexOf("|")));
                        x = x.substring(x.indexOf("|") + 1);
                        var name = x.indexOf("|") === -1 ? x : x.substring(0, x.indexOf("|"));
                        x = x.substring(x.indexOf("|") + 1);
                        var vipPhoto = x.substring(0, x.indexOf("|"));
                        x = x.substring(x.indexOf("|") + 1);
                        var badgePhoto = x.substring(0, x.indexOf("|"));
                        x = x.substring(x.indexOf("|") + 1);
                        var vipColor = x.substring(0, x.indexOf("|"));
                        x = x.substring(x.indexOf("|") + 1);
                        var rankTitle = x;
                        x =m[i];
                        console.log(rankTitle);
                        var r = "<span style='color:#00a8c3;FONT-WEIGHT: bold;font-size: 10px;margin-right: 3px; '>" + rankTitle + "</span><a class='vip-text' " + (vipColor ? "style='color: " + vipColor + ";'" : "") + " href='#' ud-role='user-popup' user-id='" + id + "' schedule-id='" + scheduleId + "'>" +
                                (vipPhoto && !isNoUoW(vipPhoto) && vipPhoto !== "null" ? "<img class='vip' src='" + vipPhoto + "'/>" : "") +
                                (badgePhoto && !isNoUoW(badgePhoto) && badgePhoto !== "null" ? "<img class='badge' src='" + badgePhoto + "'/>" : "") +
                                name +
                                "</a>";

                        while (message.indexOf(x) !== -1) {
                            message = message.replace(x, r);
                        }
                    } catch (ex) { }
                });
                    
                //#endregion

                //#region {gift}

                m = message.match(/\{gift\|(\d+)(\|([^|{}]*)){2}\}/g);
                $(m).each(function (i, x) {
                    try {
                        x = x.replace("{", "").replace("}", "");
                        x = x.substring(x.indexOf("|") + 1);
                        var quantity = parseInt(x.substring(0, x.indexOf("|")));
                        x = x.substring(x.indexOf("|") + 1);
                        var name = x.indexOf("|") === -1 ? x : x.substring(0, x.indexOf("|"));
                        x = x.substring(x.indexOf("|") + 1);
                        var photo = x;
                        x = m[i];
                        if (quantity == 10001) {
                            var r = "<img-scale class='gift' link='" + photo + "' scale='best-fit' uib-tooltip='" + name + "' tooltip-placement='top'></img-scale>";
                        } else {
                            var r = "<img-scale class='gift' link='" + photo + "' scale='best-fit' uib-tooltip='" + quantity + " " + name + "' tooltip-placement='top'></img-scale>";
                        }
                       

                        while (message.indexOf(x) !== -1) {
                            message = message.replace(x, r);
                        }
                    } catch (ex) { }
                });

                //#endregion

                //#region {animation-item}

                m = message.match(/\{animation-item(\|([^|{}]*)){2}\}/g);
                $(m).each(function (i, x) {
                    try {
                        x = x.replace("{", "").replace("}", "");
                        x = x.substring(x.indexOf("|") + 1);
                        var name = x.substring(0, x.indexOf("|"));
                        x = x.substring(x.indexOf("|") + 1);
                        var photo = x;
                        x = m[i];

                        var r = "<img-scale class='animation-item' link='" + photo + "' scale='best-fit' uib-tooltip='" + name + "' tooltip-placement='top'></img-scale>";

                        while (message.indexOf(x) !== -1) {
                            message = message.replace(x, r);
                        }
                    } catch (ex) { }
                });

                //#endregion

                //#region {free-coin}

                m = message.match(/\{free-coin\|(\d+)\}/g);
                $(m).each(function (i, x) {
                    try {
                        x = x.replace("{", "").replace("}", "");
                        x = x.substring(x.indexOf("|") + 1);
                        var quantity = x;
                        x = m[i];

                        var r = "<span><b>" + formatNumber(quantity) + "</b> <i class='free-coin-icon'></i><span>";

                        while (message.indexOf(x) !== -1) {
                            message = message.replace(x, r);
                        }
                    } catch (ex) { }
                });

                //#endregion

                //#region [emoticon]

                m = message.match(/\{(\w+)-(\d+)\}/g);
                $(m).each(function (i, x) {
                    try {
                        x = x.replace("{", "").replace("}", "");
                        x = x.split("-");
                        var link = "/Content/Image/Emoticon/" + x[0] + "/" + x[1] + ".gif";
                        x = m[i];

                        var r = "<img class='emoticon' src='" + link + "'/>";
                        while (message.indexOf(x) !== -1) {
                            message = message.replace(x, r);
                        }
                    } catch (ex) { }
                });

                //#endregion

                return message;
            };

            this.linkAction = function (link) {
                return link;
            };

            this.urlify = function (text) {
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                var kq =  text.replace(urlRegex, function (url) {
                    return '<a style="font-style: italic" href="' + url + '" target="_blank">' + url + '</a>';
                });
                return kq;
            }

            this.linkImage = function (link, size) {
                if (!link || !size)
                    return link;
                if (link.indexOf("https://file.teenidol.vn/image/") === -1)
                    return link;
                return link.substring(0, link.lastIndexOf("/")) + "/" + size + ".jpg";
            };

            this.formatNumber = formatNumber;

            this.formatTime = function (timeTamps) {
                var d = new Date(timeTamps);
                return d.getUTCHours() + ":" + kendo.toString(d.getUTCMinutes(), "00");
            };

            this.formatDate = function (timeTamps) {
                var d = new Date(timeTamps);
                return d.getUTCDate() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCFullYear() + " " + d.getUTCHours() + ":" + kendo.toString(d.getUTCMinutes(), "00");
            };

            this.formatStortDate = function (timeTamps) {
                var d = new Date(timeTamps);
                return d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
            };

            this.formatString = function (string) {
                var str = string;
                var res = str.replace(/\$/g, "");
                return res;
            };

            this.isYoutubeVideo = function (link) {
                if (!link)
                    return false;
                return (link.indexOf("https://www.youtube.com/embed") !== -1);
            };

            this.playNotificationSound = function () {
                $("#sound").attr("src", "/Content/Sound/notification.mp3");
            };

            this.replaceLinkSlider = function (LinkBaner) {
                var x = LinkBaner.replace("o.jpg", "715x402.jpg");
                return x;
            };

            this.isLoading = function (target) {
                if (target.data("bs.button"))
                    return target.data("bs.button").isLoading;

                return false;
            };

            this.isDisabled = function (target) {
                return target.hasClass("disabled");
            };

            this.detectBrowser = function () {
                if (navigator.userAgent.match(/Android/i))
                    return "android";
                else if (navigator.userAgent.match(/webOS/i))
                    return "webos";
                else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i))
                    return "ios";
                else if (navigator.userAgent.match(/BlackBerry/i))
                    return "blackberry";
                else if (navigator.userAgent.match(/Windows Phone/i))
                    return "windowsphone";
                else
                    return "desktop";
            };

            this.checkCookies = function () {
                var cookieEnabled = (navigator.cookieEnabled) ? true : false;

                if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
                    document.cookie = "testcookie";
                    cookieEnabled = (document.cookie.indexOf("testcookie") !== -1) ? true : false;
                }
                return cookieEnabled;
            };
        };
        return service;
    }
]);