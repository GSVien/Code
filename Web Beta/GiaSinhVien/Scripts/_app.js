// Application config
giasinhvienApp.config([
    "$locationProvider", "$routeProvider", "$sceDelegateProvider", "$uibTooltipProvider", "calendarConfig", "moment", "NotificationProvider",
    function ($locationProvider, $routeProvider, $sceDelegateProvider, $uibTooltipProvider, calendarConfig, moment, NotificationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.html5Mode(true).hashPrefix('!');
        // Tooltip default
        $uibTooltipProvider.options({
            appendToBody: true
        });

        // Whitelist url
        $sceDelegateProvider.resourceUrlWhitelist([
            "self",
            "http://teenidol.vn/**",
            "https://www.youtube.com/**"
        ]);

        // Calendar
        calendarConfig.allDateFormats.moment.date.hour = "H";
        calendarConfig.displayEventEndTimes = true;
        calendarConfig.dateFormatter = "moment";
        calendarConfig.i18nStrings = {
            eventsLabel: "Show diễn",
            timeLabel: "Giờ",
            weekNumber: "Tuần {week}"
        },
        moment.locale("vi");

        // List url
        $routeProvider
            .when("/", {
                css: "Styles/Views/Home.min.css",
                templateUrl: function (params) { return "Views/Home.html"; },
                controller: "homeController",
            })
            .when("/Search/", {
                css: "Styles/Views/Search.min.css",
                templateUrl: function (params) { return "Views/Search.html"; },
                controller: "searchController",
                caseInsensitiveMatch: true,
            })
            .when("/Search/:keystring", {
                css: "Styles/Views/Search.min.css",
                templateUrl: function (params) { return "Views/Search.html"; },
                controller: "searchController",
                caseInsensitiveMatch: true,
            })
            .when("/:keyProvice", {
                css: "Styles/Views/Search.min.css",
                templateUrl: function (params) { return "Views/Search.html"; },
                controller: "searchController",
                caseInsensitiveMatch: true,
            })
            .when("/:keyProvice/:keyCategory", {
                css: "Styles/Views/Search.min.css",
                templateUrl: function (params) { return "Views/Search.html"; },
                controller: "searchController",
                caseInsensitiveMatch: true,
            })
            .when("/:keyProvice/:keyCategory/:keyProduct", {
                css: "Styles/Views/Product.min.css",
                templateUrl: function (params) { return "Views/Product/Product.html"; },
                controller: "productController",
                caseInsensitiveMatch: true,
            })
            .when("/product/:id", {
                css: "Styles/Views/Product.min.css",
                templateUrl: function (params) { return "Views/Product/Product.html"; },
                controller: "productController",
                caseInsensitiveMatch: true,
            })
            .otherwise({
                redirectTo: "/"
            });
        // Notification
        NotificationProvider.setOptions({
            delay: 5000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: "center",
            positionY: "top"
        });
    }
]);
//Run Application
giasinhvienApp.run([
    "$rootScope", "sessionService", "$window", "$location", "helperService", "webService", function ($rootScope, sessionService, $window, $location, helperService, webService) {
        
        if (helperService.detectBrowser() != 'desktop' && $location.$$path != '/' && $location.$$path != '/news'
            && $location.$$path != '/teenidol-giai-tri-tha-ga'
            && ($location.$$path.indexOf('/detailnews/') == -1)) {
            $rootScope.showvideo = false;
            $rootScope.showAppBanner = true;
        };

        

        sessionService.load();


        $rootScope.$on('$stateChangeSuccess', function (event) {
            $window.ga('send', 'pageview', $location.path());
        });

        angular.element(document).ready(function () {
            $(window).on("resize", function () {
                $(".modal:visible").each(function (i, x) {
                    modalReposition($(x));
                });
            });
        });
    }
]);
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
giasinhvienApp.controller("homeController", [
    "$scope", "$rootScope", "$location", "$http", "webService", "authenticationService", "modalService", "formService",
    function ($scope, $rootScope, $location, $http, webService, authenticationService, modalService, formService) {
        //#region [Field]
        var now = new Date();
        var endyear = now.getTime();

        $scope.$p = $scope.$parent;
        $scope.listSuggestStar = undefined;
        $scope.suggestCarouselIndex = undefined;

        $scope.recent = undefined;
        //#endregion

        //#region [Layout]
        $scope.$p.resetLayout();
        $scope.$p.layoutFullBody = true;
        //#endregion

        //#region [Event]

        $scope.pageSizeProduct = 16;
        $scope.onLoadProductData = function () {
            webService.call({
                name: "GetListProductModel",
                data: {
                    actionUserId: 1,
                    pageIndex: 0,
                    pageSize: $scope.pageSizeProduct
                },

                onError: function (errorCode, message) {
                },

                onSuccess: function (r) {
                    $scope.ListProduct = r.Items;
                    if (!$scope.$$phase) $scope.$apply();
                },
            });
        };

        $scope.viewShowMore = function() {
            $scope.pageSizeProduct += 16;
            $scope.onLoadProductData();
        }

        //#endregion

        //#region [Global Event]

        $rootScope.$on("authentication_onSignIn", function () {
            $scope.onLoadProductData();
        });

        $rootScope.$on("authentication_onSignOut", function () {
            $scope.onLoadProductData();
        });

        //#endregion

        //#region [On Load]
        $scope.$on("$viewContentLoaded", function () {


            //$("body").css("background-image", "url('/Content/Image/Background-home/home.png')");

            $scope.onLoadProductData();


            //load meta seo data
            $("meta[name='title']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='keywords']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='description']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");


        });

        //#endregion
    }
]);
giasinhvienApp.controller("productController", [
    "$scope", "$rootScope", "$routeParams", "$log", "$sce", "sessionService", "webService", "helperService", "$window", "authenticationService", "Notification",
function ($scope, $rootScope, $routeParams, $log, $sce, sessionService, webService, helperService, $window, authenticationService, Notification) {
    //#region [Field]
    $scope.htmlContent = undefined;
    $scope.productId = undefined;
    $scope.pageSizeSimilarProduct = 8;
    $scope.$p = $scope.$parent;
    if ($routeParams) {
        $scope.productId = $routeParams.id;
    }
    //#endregion
    //#region [Layout]

    $scope.$p.resetLayout();
    $scope.$p.layoutFullBody = false;
    //#endregion

    //#region [Event]
    $scope.getTimeFormat = function (e) {
        return helperService.formatStortDate(e);
    }

    $scope.onLoadMainProduct = function () {
        
        webService.call({
            name: "GetInfoProductModel",
            data: {
                actionUserId: 1,
                id: $scope.productId
            },

            onError: function (errorCode, message) {
            },

            onSuccess: function (r) {
                $scope.district = r.Items[0].District.Name;
                $scope.province = r.Items[0].Province.Name;
                $scope.category = r.Items[0].ProductCategory.Name;

                $scope.productTitle = r.Items[0].Product.Title;
                $scope.description = r.Items[0].Product.Description;
                $scope.createDate = r.Items[0].Product.CreateDate;
                $scope.price = r.Items[0].Product.Price;
                $scope.productaddrress = r.Items[0].District.Name + ' ' + r.Items[0].Province.Name;
                $scope.createdate = r.Items[0].Product.CreateDate;

                $scope.userphoto = r.Items[0].UserInfo.AvatarPhoto;
                $scope.username = r.Items[0].UserInfo.UserName;
                $scope.userphone = r.Items[0].UserInfo.Phone;
                $scope.userdate = r.Items[0].UserInfo.CreateDate;


                $scope.onLoadSimilarProductData();

                if (!$scope.$$phase) $scope.$apply();
            },
        });
    }

    $scope.onLoadSimilarProductData = function () {
        webService.call({
            name: "GetListProductModel",
            data: {
                actionUserId: 1,
                pageIndex: 0,
                pageSize: $scope.pageSizeSimilarProduct
            },

            onError: function (errorCode, message) {
            },

            onSuccess: function (r) {
                $scope.ListSimilarProduct = r.Items;
                if (!$scope.$$phase) $scope.$apply();
            },
        });
    };

    $scope.viewShowMore = function () {
        $scope.pageSizeSimilarProduct += 8;
        $scope.onLoadSimilarProductData();
    }
    
    //#endregion

    //#region [On Load]
    //sessionService.isReady(function () {
        $scope.onLoadMainProduct();

        
    //    $($window).bind("scroll", function () {
    //        if (this.pageYOffset > 750) {
    //            $(".crolltop").css("position", "fixed");
    //            $(".crolltop").css("top", "0");
    //            $(".crolltop").css("width", "23.4%");
    //        } else {
    //            $(".crolltop").css("position", "relative");
    //            $(".crolltop").css("top", "0");
    //            $(".crolltop").css("width", "auto");
    //        }
    //    });
    //});

    //#endregion
}
]);
giasinhvienApp.controller("searchController", [
    "$window", "$scope", "$rootScope", "$routeParams", "$location", "$http", "webService", "authenticationService", "modalService", "formService",
    function ($window,$scope, $rootScope, $routeParams, $location, $http, webService, authenticationService, modalService, formService) {
        //#region [Field]
        var now = new Date();
        var endyear = now.getTime();
        $scope.stringText = undefined;
        $scope.linkProvice = undefined;
        $scope.linkCategory = undefined;
        $scope.categoryId = undefined;
        $scope.proviceId = undefined;
        $scope.province = undefined;
        $scope.category = undefined;
        $scope.$p = $scope.$parent;
        $scope.pageSizeProduct = 16;

        if ($routeParams) {
            if ($routeParams.keystring) {
                $scope.stringText = $routeParams.keystring;
                $("#searchValue").val($scope.stringText);
            }
            if ($routeParams.keyProvice) {
                $scope.linkProvice = $routeParams.keyProvice;
                webService.call({
                    name: "GetProviveByLink",
                    data: {
                        link: $scope.linkProvice
                    },

                    onError: function (errorCode, message) {
                    },

                    onSuccess: function (r) {
                        if (r.Result) {
                            $scope.province = r.Result;
                            $scope.proviceId = $scope.province.Id;
                            if ($routeParams.keyCategory) {
                                $scope.linkCategory = $routeParams.keyCategory;
                                webService.call({
                                    name: "GetCategoryByLink",
                                    data: {
                                        link: $scope.linkCategory
                                    },

                                    onError: function(errorCode, message) {
                                    },

                                    onSuccess: function(rs) {
                                        if (rs.Result) {
                                            $scope.category = rs.Result;
                                            $scope.categoryId = $scope.category.Id;
                                            //$scope.OnSelectCategory($scope.category.Id, $scope.category);
                                            $("#sp-menu2").html($scope.category.Name);
                                            $("#sp-menu1").html($scope.province.Name);
                                            if (!$scope.$$phase) $scope.$apply();
                                        }
                                    },
                                });
                            } else {
                                //$scope.OnSelectProvice($scope.province.Id, $scope.province);
                                $("#sp-menu1").html($scope.province.Name);
                            }
                        } else {
                            $window.location.href = '/Search/';
                        }
                        $scope.onLoadProductData();
                        if (!$scope.$$phase) $scope.$apply();
                    },
                });


            }

        }


        //#endregion

        //#region [Layout]
        $scope.$p.resetLayout();
        $scope.$p.layoutFullBody = true;
        //#endregion

        //#region [Event]


        $scope.OnSelectProvice = function (id,o) {
            $scope.proviceId = id;
            if (o) {
                $scope.province = o;
                if (!$scope.$$phase) $scope.$apply();
            }
            $scope.onLoadProductData();
        };


        $scope.OnSelectCategory = function (id,o) {
            $scope.categoryId = id;
            if (o) {
                $scope.category = o;
                if (!$scope.$$phase) $scope.$apply();
            }
            $scope.onLoadProductData();
        };

        $scope.onLoadProvince = function () {
            webService.call({
                name: "GetAllProvince",
                data: {
                    key: 1
                },

                onError: function (errorCode, message) {
                },

                onSuccess: function (r) {
                    $scope.ListProvince = r.Result;
                    if (!$scope.$$phase) $scope.$apply();
                },
            });
        };

        $scope.onLoadCategory = function () {
            webService.call({
                name: "GetListCategory",
                data: {
                    key: 1
                },

                onError: function (errorCode, message) {
                },

                onSuccess: function (r) {
                    $scope.ListCategory = r.Result;
                    if (!$scope.$$phase) $scope.$apply();
                },
            });
        };

        $scope.onLoadProductData = function () {
            webService.call({
                name: "GetListProductModel",
                data: {
                    actionUserId: 1,
                    pageIndex: 0,
                    pageSize: $scope.pageSizeProduct,
                    str_Name: $("#searchValue").val(),
                    num_CategoryId: $scope.categoryId,
                    num_ProviceId: $scope.proviceId
                },

                onError: function (errorCode, message) {
                },

                onSuccess: function (r) {
                    $scope.ListProduct = r.Items;
                    if (!$scope.$$phase) $scope.$apply();
                },
            });
        };

        $scope.viewShowMore = function () {
            $scope.pageSizeProduct += 16;
            $scope.onLoadProductData();
        }

        //#endregion

        //#region [Global Event]

        $rootScope.$on("authentication_onSignIn", function () {
            $scope.onLoadProductData();
        });

        $rootScope.$on("authentication_onSignOut", function () {
            $scope.onLoadProductData();
        });

        //#endregion

        //#region [On Load]
        $scope.$on("$viewContentLoaded", function () {


            //$("body").css("background-image", "url('/Content/Image/Background-home/home.png')");

            $scope.onLoadProductData();
            $scope.onLoadProvince();
            $scope.onLoadCategory();

            //load meta seo data
            $("meta[name='title']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='keywords']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");
            $("meta[name='description']").attr("content", "Giải trí thả ga - Tự tin thể hiện mình cùng teenidol, giao lưu với dàn idol xinh xắn, đa tài, đa phong cách trên nền platform ưu việt nhất.");

            $('.dropdown-menu').on('click', 'a', function () {
                var text = $(this).html();
                var htmlText = text + ' <span class="caret"></span>';
                $(this).closest('.dropdown').find('.dropdown-toggle').html(htmlText);
            });

        });

        //#endregion
    }
]);
giasinhvienApp.controller("layoutController", ["$window", "$http", "$scope", "$rootScope", "$location", "$cookies",
    "helperService", "authenticationService", "Notification", "formService",
    "webService", "modalService","sessionService","menulinkService",
function ($window, $http, $scope, $rootScope, $location, $cookies,
    helperService, authenticationService, Notification, formService,
    webService, modalService, sessionService,menulinkService) {
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

    $scope.userSession = sessionService.data();
    console.log($scope.userSession);
    //#endregion
    $scope.ListMenuHead = menulinkService.listMenuHead();

    $scope.ListCategory = menulinkService.listCategory();

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
    $scope.dangNhapBangEmail = function ($event) {
       
        //goi service dang nhap
        var $target = $($event.target);
        var $emailElement = $target.find(".email");
        var $passwordElement = $target.find(".password");

        webService.call({
            name: "DangNhapBangEmail",
            type: "POST",
            data: {
                email: $emailElement.val(),
                passwork: $passwordElement.val()
            },
            displayError: true,
            onError: function () {
                Notification.error("Đăng nhập thất bại!");
            },

            onSuccess: function (r) {
                if (r.Result && r.Result.Id)
                    sessionService.set(r.Result.Id, function () {
                        $("#modal-authentication").modal("hide");
                        $rootScope.showPopupInterval = false;
                        Notification.success("Đăng nhập thành công");
                        if (o.onDone) o.onDone();
                    });
                if (!$scope.$$phase) $scope.$apply();
            },
        });
    };

    $scope.onSearchProduct = function () {
        $window.location.href = '/Search/' + $("#search-text").val();
    }

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
giasinhvienApp.controller("usercoinlogController", [
    "$scope", "$routeParams", "sessionService", "webService", "authenticationService", "formService", "helperService", "$log",
    function ($scope, $routeParams, sessionService, webService, authenticationService, formService, helperService, $log) {
        var suggestStarCarousel;
        var carouselData = [];
        $scope.popup1 = {
            opened: false,
            date:new Date(),
        };

        $scope.popup2 = {
            opened: false,
            date: new Date(),
        };
        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.helperService = helperService;
        $scope.IdUserSession = $scope.$p.sessionService.userId();
        var pageindex = 0;
        $scope.CurrentPage = 1;
        if ($routeParams) {
            $scope.userId = $routeParams.id;
        }
        //#region [Method]
        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };
        //#endregion

        //#region [Layout]

        $scope.$p.layoutShowHeader = true;
        $scope.$p.layoutShowFooter = true;
        $scope.$p.layoutShowBanner = true;
        $scope.$p.layoutFullBody = true;

        //#endregion

        //#region [Event]
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.onLoadUserGetDetails = function () {
            webService.call({
                name: "User_GetDetails",
                data: {
                    actionUserId: $scope.IdUserSession,
                    userId: $scope.userId,
                    isStar: true,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.userSession = r.Result;
                    $scope.$apply();
                }
            });
        };

        $scope.onLoadUserSpend = function (a) {
            var type = 1;
            $scope.a = 1;
            pageindex = $scope.CurrentPage - 1;
            if (a) {
                type = a;
                $scope.a = a;
            }
            webService.call({
                name: "List_UserSpend",
                data: {
                    pageIndex: pageindex,
                    pageSize: 10,
                    userId: $scope.IdUserSession,
                    type: type,
                    startTime: 0,
                    endTime: 0,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.total = r.Total;
                    $scope.ListUserSpend = r.Items;
                    $scope.TotalItems = r.Total;
                    $scope.CurrentPage = pageindex + 1;
                    $scope.numPages = r.PageCount;
                    $scope.maxSize = 3;
                    $scope.b = 1;
                    $scope.$apply();
                }
            });
            $('.type a').click(function() {
                $('.type a').removeClass('active');
                $(event.target).addClass('active');
            });
        };

        $scope.onLoadSeachCoinLog = function (a) {
            pageindex = $scope.CurrentPage - 1;
            var type = a;
            webService.call({
                name: "List_UserSpend",
                data: {
                    pageIndex: pageindex,
                    pageSize: 10,
                    userId: $scope.IdUserSession,
                    type: type,
                    startTime: $scope.popup1.date.getTime(),
                    endTime: $scope.popup2.date.getTime(),
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.total = r.Total;
                    $scope.ListUserSpend = r.Items;
                    $scope.TotalItems = r.Total;
                    $scope.CurrentPage = pageindex + 1;
                    $scope.numPages = r.PageCount;
                    $scope.maxSize = 3;
                    $scope.b = 2;
                    $scope.$apply();
                }
            });
        };
        //#endregion

        //#region [Global Event]

        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $scope.onLoadUserGetDetails();
            $scope.onLoadUserSpend();
        });
        //#endregion
    }
]);
giasinhvienApp.controller("userfollowController", [
    "$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService) {
        var suggestStarCarousel;
        var carouselData = [];

        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.ListUserFollow = undefined;
        $scope.ListStarFollow = undefined;
        $scope.ListFollow = {
             status: "loading"
        };
        if ($routeParams) {
            $scope.userId = $routeParams.id;
        }
        //#region [Method]
        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };
        $scope.getDisplayPoint = function (x) {
            if (x != undefined)
                return x.TotalSumValue;
            return 0;
        }
        //#endregion

        //#endregion

        //#region [Layout]

        $scope.$p.layoutShowHeader = true;
        $scope.$p.layoutShowFooter = true;
        $scope.$p.layoutShowBanner = true;
        $scope.$p.layoutFullBody = true;

        //#endregion

        //#region [Event]
        $scope.onLoadUserGetDetails = function () {
            webService.call({
                name: "User_GetDetails",
                data: {
                    actionUserId: $scope.$p.sessionService.userId(),
                    userId: $scope.userId,
                    isStar: true,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function(r) {
                    $scope.name = r.Result.User.Name;
                    $scope.$apply();
                }
            });
        };
        $scope.onLoadListFollow = function (a) {
            var pageindex = 0;
            var type = 1;
            $scope.a = 1;
            if (a) {
                pageindex = $scope.CurrentPage - 1;
                type = a;
                $scope.a = a;
            }
            var currentTab = $(".right-panel .tab-pane.active").attr("id");
            switch (currentTab) {
                default:
                case "user-follow":
                    webService.call({
                        name: "User_GetListUserFollow",
                        data: {
                            actionUserId: $scope.$p.sessionService.userId(),
                            userId: $scope.userId,
                            pageIndex: pageindex,
                            pageSize: 8,
                            key: $scope.$p.sessionService.key(),
                        },
                        onSuccess: function (r) {

                            $scope.TotalUser = r.Total;
                            $scope.CurrentPage = pageindex + 1;
                            $scope.numPages = r.PageCount;
                            $scope.maxSize = 5;
                            if ($scope.TotalUser > 0) {
                                $scope.ListUserFollow = r.Items;
                            }
                            else {
                                $scope.ListUserFollow = [];
                            }
                            $scope.$apply();
                            $(".right-panel a[data-toggle='tab'].active").removeClass('active');
                            $(".right-panel a[data-target='#user-follow']").addClass('active');
                            $('#page-' + (parseInt($scope.pageUserindex) + 1)).addClass('active');
                        }
                    });
                    break;

                case "star-follow":
                    webService.call({
                        name: "User_GetListStarFollow",
                        data: {
                            actionUserId: $scope.$p.sessionService.userId(),
                            userId: $scope.userId,
                            pageIndex: pageindex,
                            pageSize: 8,
                            key: $scope.$p.sessionService.key(),
                        },
                        onSuccess: function (r) {

                            $scope.totalStar = r.Total;
                            $scope.CurrentPage = pageindex + 1;
                            $scope.numPages = r.PageCount;
                            $scope.maxSize = 5;
                            if ($scope.totalStar > 0) {
                                $scope.ListStarFollow = r.Items;
                            }
                            else {
                                $scope.ListStarFollow = [];
                            }

                            $scope.ListFollow.status = "loaded";
                            $scope.$apply();
                            $(".right-panel a[data-toggle='tab'].active").removeClass('active');
                            $(".right-panel a[data-target='#star-follow']").addClass('active');
                            $('#page-' + (parseInt($scope.pageStarindex) + 1)).addClass('active');
                        }
                    });
                    break;
            }
        };


        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $(".right-panel a[data-toggle='tab']").on("shown.bs.tab", function (e) {
                $scope.onLoadListFollow();
            });
            $(".right-panel .active a[data-toggle='tab']").trigger("shown.bs.tab");
            $scope.onLoadUserGetDetails();
        });
        //#endregion
    }
]);
giasinhvienApp.controller("userinboxController", [
    "$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService) {

        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.IdUserSession = $scope.$p.sessionService.userId();
        if ($routeParams) {
            userId = $routeParams.id;
        }
        //#endregion

        //#region [Layout]

        $scope.$p.layoutShowHeader = true;
        $scope.$p.layoutShowFooter = true;
        $scope.$p.layoutShowBanner = true;
        $scope.$p.layoutFullBody = true;

        //#endregion

        //#region [Event]

        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
        });
        //#endregion
    }
]);
giasinhvienApp.controller("userinventoryController", [
    "$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService) {
        var suggestStarCarousel;
        var carouselData = [];

        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.IdUserSession = $scope.$p.sessionService.userId();
        if ($routeParams) {
            userId = $routeParams.id;
        }
        //#region [Method]
        pageIndex = 0;

        var now = new Date();
        var today = now.getTime();
        $scope.today =  today;
        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };
        //#endregion

        //#endregion

        //#region [Layout]

        $scope.$p.layoutShowHeader = true;
        $scope.$p.layoutShowFooter = true;
        $scope.$p.layoutShowBanner = true;
        $scope.$p.layoutFullBody = true;
        //#endregion

        //#region [Event]
        $scope.onLoadListAnimationItem = function () {
            webService.call({
                name: "User_GetListAnimationItem",
                data: {
                    actionUserId: $scope.IdUserSession,
                    userId: userId,
                    pageIndex: 0,
                    pageSize: 9999,
                    key: $scope.$p.sessionService.key()
                },
                onSuccess: function (r) {
                    $scope.total = r.Total;
                    $scope.ListAnimationItem = r.Items;
                    $scope.$apply();
                }
            });
        }
        $scope.DefaultItem = function (a, b, c) {
            webService.call({
                name: "Store_ChoseAnimationDefaultItem",
                data: {
                    actionUserId: $scope.IdUserSession,
                    animationItemId: a,
                    rootCategoryId: b,
                    key: $scope.$p.sessionService.key()
                },
                //displayError: true,
                onError: function (code, msg) {
                    console.log(code, msg);
                },
                onSuccess: function (r) {
                    $scope.onLoadListAnimationItem();
                    $scope.$apply();
                }
            });
        }
        // };
        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $scope.onLoadListAnimationItem();
        });
        //#endregion
    }
]);
giasinhvienApp.controller("usermodroomController", [
    "$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService) {
        var suggestStarCarousel;
        var carouselData = [];

        //#region [Field]
        $scope.$p = $scope.$parent;
        $scope.IdUserSession = $scope.$p.sessionService.userId();
        if ($routeParams) {
            userId = $routeParams.id;
        }
        //#region [Method]
        $scope.userSession = function () {
            if (!sessionService.isSigned())
                return undefined;
            return sessionService.data().user;
        };
        //#endregion

        //#endregion

        //#region [Layout]

        $scope.$p.layoutShowHeader = true;
        $scope.$p.layoutShowFooter = true;
        $scope.$p.layoutShowBanner = true;
        $scope.$p.layoutFullBody = true;

        //#endregion

        //#region [Event]

        $scope.onLoadUserGetDetails = function () {
            webService.call({
                name: "User_GetDetails",
                data: {
                    actionUserId: $scope.$p.sessionService.userId(),
                    userId: userId,
                    isStar: true,
                    key: $scope.$p.sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.name = r.Result.User.Name;
                    $scope.$apply();
                }
            })
        };

        //#endregion

        //#region [Global Event]


        //#endregion

        //#region [On Load]

        sessionService.isReady(function () {
            $scope.onLoadUserGetDetails();
        });
        //#endregion
    }
]);
giasinhvienApp.controller("userrewardController", [
"$scope", "$rootScope", "$location", "$routeParams", "sessionService", "webService", "authenticationService", "formService", "helperService", function ($scope, $rootScope, $location, $routeParams, sessionService, webService, authenticationService, formService, helperService) {
    var suggestStarCarousel;
    var carouselData = [];
    $scope.popup1 = {
        opened: false,
        date: new Date(),
    };

    $scope.popup2 = {
        opened: false,
        date: new Date(),
    };
    //#region [Field]
    $scope.$p = $scope.$parent;

    //#region [Method]
    pageindex = 0;
    if ($routeParams.p) {
        pageindex = $routeParams.p - 1;
    }
    $scope.IdUserSession = $scope.$p.sessionService.userId();
    if ($routeParams) {
        $scope.userId = $routeParams.id;
    }
    var now = new Date();
    $scope.userSession = function () {
        if (!sessionService.isSigned())
            return undefined;
        return sessionService.data().user;
    };
    //#endregion

    //#endregion

    //#region [Layout]

    $scope.$p.layoutShowHeader = true;
    $scope.$p.layoutShowFooter = true;
    $scope.$p.layoutShowBanner = true;
    $scope.$p.layoutFullBody = true;

    //#endregion

    //#region [Event]
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.onLoadGetRewardLog = function () {
        webService.call({
            name: "User_GetRewardLog",
            data: {
                actionUserId: $scope.IdUserSession,
                userId: $scope.userId,
                pageIndex: pageindex,
                pageSize: 10,
                key: $scope.$p.sessionService.key(),
                startTime: 0,
                endTime: now.getTime(),
            },
            onSuccess: function (r) {
                $scope.helperService = helperService;
                $scope.total = r.Total;
                $scope.pageindex = r.PageIndex;
                $scope.pagecount = r.PageCount;
                $scope.GetRewardLog = r.Items;
                $scope.$apply();
                $('#page-' + (parseInt($scope.pageindex) + 1)).addClass('active');
            }
        });
    }
    $scope.onLoadSeachReward = function () {
        
        webService.call({
            name: "User_GetRewardLog",
            data: {
                actionUserId: $scope.IdUserSession,
                userId: $scope.userId,
                pageIndex: pageindex,
                pageSize: 12,
                key: $scope.$p.sessionService.key(),
                startTime: $scope.popup1.date.getTime(),
                endTime: $scope.popup2.date.getTime(),
            },
            onSuccess: function (r) {
                $scope.helperService = helperService;
                $scope.total = r.Total;
                $scope.pageindex = r.PageIndex;
                $scope.pagecount = r.PageCount;
                $scope.GetRewardLog = r.Items;
                $('#page-' + (parseInt($scope.pageindex) + 1)).addClass('active');
                $scope.$apply();
            }
        })
    }
    //#endregion

    //#region [Global Event]


    //#endregion

    //#region [On Load]

    sessionService.isReady(function () {
        $scope.onLoadGetRewardLog();
    });
    //#endregion
}
]);
giasinhvienApp.directive("compile", [
    "$compile", function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    }])
giasinhvienApp.directive("jqDropdown", [
    "$timeout", "helperService", function ($timeout, helperService) {
        return {
            restrict: "C",
            link: function (scope, element, attrs) {
                element.on("show", function (event, dropdownData) {
                    var bw = $(window).width();
                    var bh = $(window).height();
                    var tw = dropdownData.trigger.width();
                    var th = dropdownData.trigger.height();
                    var to = dropdownData.trigger.offset();
                    var t = "";
                    var b = "";
                    var l = "";
                    var r = "";
                    
                    if (bw - (to.left + tw) > 200) {
                        element.removeClass("jq-dropdown-anchor-right");
                        l = to.left;
                    } else {
                        element.addClass("jq-dropdown-anchor-right");
                        r = bw - (to.left + tw);
                    }

                    if (bh - (to.top + th) > 200) {
                        element.addClass("jq-dropdown-tip");
                        t = to.top + th;
                    } else {
                        element.removeClass("jq-dropdown-tip");
                        b = bh - to.top;
                    }

                    element.css("top", t);
                    element.css("bottom", b);
                    element.css("left", l);
                    element.css("right", r);
                });

                $(".jq-dropdown-menu, .jq-dropdown-panel").on("show", function (event, dropdownData) {
                    var $target = $(e.target).closest("[ud-role=user-popup]");
                    var right = $target.offset().left + $target.width();
                    var windowWidth = $(window).width();

                    $("#dropdown-user-info").data("user-id", attrs.userId * 1);
                    $("#dropdown-user-info").data("schedule-id", attrs.scheduleId ? attrs.scheduleId * 1 : undefined);
                    if (right >= windowWidth - 300) {
                        $("#dropdown-user-info").addClass("jq-dropdown-anchor-right");
                    } else {
                        $("#dropdown-user-info").removeClass("jq-dropdown-anchor-right");
                    }
                });
            }
        };
    }
]);
giasinhvienApp.directive('fbLike', [
        '$window', '$rootScope', function ($window, $rootScope) {
            return {
                restrict: 'A',
                scope: {
                    fbLike: '=?'
                },
                link: function (scope, element, attrs) {
                    if (!$window.FB) {
                        // Load Facebook SDK if not already loaded
                        $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
                            $window.FB.init({
                                appId: 196048937399956,
                                xfbml: true,
                                version: 'v2.0'
                            });
                            renderLikeButton();
                        });
                    } else {
                        renderLikeButton();
                    }

                    var watchAdded = false;
                    function renderLikeButton() {
                        if (!!attrs.fbLike && !scope.fbLike && !watchAdded) {
                            // wait for data if it hasn't loaded yet
                            watchAdded = true;
                            var unbindWatch = scope.$watch('fbLike', function (newValue, oldValue) {
                                if (newValue) {
                                    renderLikeButton();

                                    // only need to run once
                                    unbindWatch();
                                }

                            });
                            return;
                        } else {
                            element.html('<div class="fb-like"' + (!!scope.fbLike ? ' data-href="' + scope.fbLike + '"' : '') + ' data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>');
                            $window.FB.XFBML.parse(element.parent()[0]);
                        }
                    }
                }
            };
        }
]);
giasinhvienApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                var a = reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
giasinhvienApp.factory("formatText", [
    function () {
        var service = new function () {
            this.formatText = function (input) {
                var textreplace = input.replace(/á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|A|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, "a")
                 .replace(/đ|Đ|D/g, "d")
                 .replace(/ý|ỳ|ỷ|ỹ|ỵ|Y|Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, "y")
                 .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|U|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, "u")
                 .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|O|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, "o")
                 .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|E|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, "e")
                 .replace(/í|ì|ỉ|ĩ|ị|Í|Ì|Ỉ|Ĩ|Ị|I/g, "i");

                var output = textreplace.replace(/!|@|%|\^|\*|\”|\“|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-")
                .replace(/-+-/g, "-");//thay thế 2- thành 1-str= str.replace(/^\-+|\-+$/g,"");
                return output.toLowerCase();
            }
        };
        return service;
    }
]);
giasinhvienApp.directive("head", [
    "$rootScope", "$compile", "$window", "$location", "sessionService", function ($rootScope, $compile, $window, $location, sessionService) {
        return {
            restrict: "E",
            link: function (scope, element) {
                // Render template
                var html = "<link type='text/css' rel='stylesheet' ng-repeat='(routeCtrl, cssUrl) in routeStyles' ng-href='{{cssUrl}}' />";
                element.append($compile(html)(scope));

                // Điều chỉnh danh sách link
                scope.routeStyles = {};
                $rootScope.$on("$routeChangeStart", function (e, next, current) {

                    if (current && current.$$route && current.$$route.css) {
                        if (!angular.isArray(current.$$route.css)) {
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function (sheet) {
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if (next && next.$$route && next.$$route.css) {
                        if (!angular.isArray(next.$$route.css)) {
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function (sheet) {
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);
giasinhvienApp.directive("img", [
    function () {
        return {
            restrict: "E",
            link: function (scope, element, attrs) {
                //var errorSrc = getOrDefault($(this).attr("error-src"), "/Content/Image/Background-Item/Meo-gif.gif");

                //if (attrs.ngSrc === "")
                //    element.attr("src", errorSrc);

                //if (element.attr("img-error"))
                //    return;

                //element.error(function () {
                //    element.off("onerror")
                //        .attr("src", errorSrc)
                //        .attr("img-error", "");
                //});
            }
        };
    }
]);
giasinhvienApp.directive("imgScale", [
    function () {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                link: "@",
                errorSrc: "@",
                rescaleonresize: "@",
            },
            template: "<div class='img-container'><img ng-src='{{link}}' error-src='{{errorSrc}}'></div>",
            link: function (scope, element, attrs) {
                if (!scope.rescaleonresize) {
                    rescaleonresize = false;
                }
                else {
                    rescaleonresize = attrs.rescaleonresize;
                }
                element.find("img").imageScale({
                    rescaleOnResize: rescaleonresize,
                    scale: attrs.scale,
                    align: attrs.align
                });
            }
        };
    }
]);
giasinhvienApp.directive("isLoading", [
    function () {
        return {
            restrict: "A",
            scope: {
                isLoading: "="
            },
            link: function (scope, element) {
                scope.$watch("isLoading", function (newValue) {
                    if (newValue) {
                        element.button("loading");
                    } else {
                        element.button("reset");
                    }
                });
            }
        };
    }
]);
giasinhvienApp.directive("kendoTemplate", [
    "$compile", function ($compile) {
        return {
            restrict: "E",
            transclude: true,
            scope: {
                templateId: "@",
                templateData: "@"
            },
            link: function (scope, element, attrs) {
                //#region [Validation]

                if (isNoUoW(scope.templateId))
                    throw "'template-id' must be declared";

                //#endregion

                var html = "";
                
                if ($("#" + scope.templateId).length === 0) {
                    console.warn("Can not find the template '" + scope.templateId + "'");
                } else {
                    var template = kendo.template($("#" + scope.templateId).html());

                    scope.templateData = getOrDefault(scope.templateData, {});
                    
                    if (typeof scope.templateData !== "object") {
                        try {
                            scope.templateData = JSON.parse(scope.templateData);
                        } catch (e) {
                            scope.templateData = {};
                            console.warn("Can not parse template-data of template: '" + scope.templateId + "'");
                        }
                    }

                    html = template(scope.templateData);
                }

                element.replaceWith($compile(html)(scope.$parent.$parent));
            }
        };
    }
]);
giasinhvienApp.directive("modal", [
        function () {
            return {
                restrict: "C",
                link: function (scope, element, attrs) {
                    element.on("show.bs.modal", function () { modalReposition(element); });
                }
            };
        }
]);
giasinhvienApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
giasinhvienApp.directive('wrapOwlcarousel', function () {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope, element, attrs) {
		    
		    scope.initCarousel = function (element) {
				$(element).owlCarousel({
					loop: false,
					margin: 0,
				    items:4,
					nav: true,
					autoplay: true,
					autoplayTimeout: 40000,
					autoplayHoverPause: true,
					responsiveClass: true,
					dots: false,
					slideBy: 1,
					navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
					responsive: {
						0: {
							items: 4
						},
						600: {
							items: 4
						},
						1000: {
							items: 4
						}
					}
				});
			}
		}
	};
});
giasinhvienApp.directive('owlCarouselItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
            if (scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);

giasinhvienApp.directive("paging", [
    "helperService", "$routeParams", function (helperService, $routeParams) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                pageindex: "@",
                pagesize: "@",
                pagecount: "@",
                rank: "@",
                url:"@",
            },
            template:
                "<div class='list-wrapper'>" +
                "<ul class='page-list'>" +
                   " <li ng-if='dk'><a class='page-link'  href='{{url}}?p={{prev}}' ><i class='fa fa-angle-left'></i></a></li>" +
                   " <li ng-repeat='count in listpage'><a class='page-link'  id='page-{{count}}' data-page='{{count}}' href='{{url}}?p={{count}}'>{{count}}</a></li>" +
                   " <li ng-if='dk1'><a class='page-link'  href='{{url}}?p={{next}}' ><i class='fa fa-angle-right'></i></a></li>" +
                "</ul>" +
            "</div>",
            link: function (scope, element, attrs) {
                if ($routeParams.p) {
                    scope.pageindex = $routeParams.p;
                }
                if (!scope.url) scope.url = scope.url;
                scope.dk = (parseInt(scope.pageindex) > parseInt(scope.rank) + 1);
                scope.dk1 = (parseInt(scope.pagecount) - parseInt(scope.rank) > parseInt(scope.pageindex) + 1);
                var listpage = [];
                scope.listpage = [1, 2, 3];
                if (parseInt(scope.pageindex) == 1)
                {
                    scope.listpage = [parseInt(scope.pageindex), parseInt(scope.pageindex) + 1, parseInt(scope.pageindex) + 2];
                }
                if (parseInt(scope.pageindex) == parseInt(scope.pagecount) && parseInt(scope.pageindex) >=3) {
                    scope.listpage = [parseInt(scope.pagecount) - 2, parseInt(scope.pagecount) - 1, parseInt(scope.pagecount)];
                }
                if (parseInt(scope.pageindex) < parseInt(scope.pagecount) && parseInt(scope.pageindex) > 1) {
                    scope.listpage = [parseInt(scope.pageindex) - 1, parseInt(scope.pageindex), parseInt(scope.pageindex) + 1];
                }
                if (scope.pageindex - 1 == 0) {
                    scope.prev = parseInt(scope.pagecount);
                }
                else {
                    scope.prev = parseInt(scope.pageindex) - 1;
                }
                if (parseInt(scope.pageindex) + 1 > parseInt(scope.pagecount)) {
                    scope.next = 1;
                }
                else {
                    scope.next = parseInt(scope.pageindex) + 1;
                }
            }
        }
    }]);
giasinhvienApp.directive("toggle", [
    function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                scope.$watch(function() {
                    if (attrs.toggle === "tooltip") {
                        $(element).tooltip({
                            container: "body"
                        });
                    } else if (attrs.toggle === "popover") {
                        $(element).popover();
                    }
                });
            }
        };
    }
]);
giasinhvienApp.directive("udRole", [
    "authenticationService", "sessionService", "modalService", function (authenticationService, sessionService, modalService) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                switch (attrs.udRole) {
                    case "sign-in":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: element.data("message"),
                                messageType: element.data("message-type")
                            });
                        });
                        break;

                    case "sign-up":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "sign-up",
                                message: element.data("message"),
                                messageType: element.data("message-type")
                            });
                        });
                        break;

                    case "re-pass":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "re-pass",
                                message: element.data("message"),
                                messageType: element.data("message-type")
                            });
                        });
                        break;

                    case "sign-out":
                        element.on("click", function (e) {
                            authenticationService.showModal({
                                mode: "sign-out"
                            });
                        });
                        break;

                    case "modal-youtube-inshow":
                        element.on("click", function (e) {
                            $(function () { $('#modal-youtube-inshow').draggable({ handle: ".modal-header" }).resizable(); });
                        });
                        break;

                    case "user-popup":
                        element.jqDropdown("attach", "#dropdown-user-info");
                        element.on("click", function (e) {
                            $("#dropdown-user-info").data("user-id", attrs.userId * 1);
                            $("#dropdown-user-info").data("vip-id", attrs.vipId * 1);
                            $("#dropdown-user-info").data("schedule-id", attrs.scheduleId ? attrs.scheduleId * 1 : undefined);
                        });
                        break;

                    case "message-emoticon":
                        element.jqDropdown("attach", "#dropdown-message-emoticon");
                        element.on("click", function (e) {
                            $("#dropdown-message-emoticon").data("emoticon-target", attrs.emoticonTarget);
                        });
                        break;
                    case "open-guild":
                        element.on("click", function (e) {
                            modalService.showDetailGuild({
                                Id: attrs.id,
                            });
                        });
                        break;

                    default:
                        console.warn("ud-role: '" + attrs.udRole + "' is not declared");
                        break;
                }
            }
        };
    }
]);
giasinhvienApp.directive("validateError", ["$compile",
    function ($compile) {
        return {
            restrict: "E",
            scope: {
                target: "="
            },
            link: function (scope, element, attrs) {
                var child = element.html().replace(new RegExp("when=\"", "g"), "ng-if=\"target.");
                var html = "<div class='validate-error' ng-if='target.$invalid && (target.$touched || target.$$parentForm.$submitted)'>" + child    + "</div>";
                element.replaceWith($compile(html)(scope));
            }
        };
    }
]);
giasinhvienApp.directive("validateSubmit", [
    function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.attr("novalidate", "");
                element.bind("submit", function(e) {
                    e.preventDefault();
                    if (element.data("$formController").$valid)
                        scope.$eval(attributes.validateSubmit);
                });
            }
        };
    }
]);
giasinhvienApp.filter("currentListSeatPrice",
    function () {
        return function (input, currentPrice) {
            if (!currentPrice || input.constructor !== Array || isNaN(currentPrice))
                return input;

            var r = [];
            $(input).each(function(i, x) {
                if (x <= currentPrice)
                    return;
                r.push(x);
            });
            return r;
        };
    }
);
giasinhvienApp.controller("modalAlertController", ["$scope", "$uibModalInstance", "data",
    function ($scope, $uibModalInstance, data) {
        //#region [Field]

        $scope.title = data.title;
        $scope.message = data.message;
        $scope.listButton = data.buttons;

        //#endregion

        //#region [Event]

        $scope.onButtonClick = function (index) {
            var btn = $scope.listButton[index];
            if (typeof btn.onClick === "function")
                btn.onClick();
            if (btn.closeModal)
                $uibModalInstance.close();
        };

        //#endregion
    }
]);
giasinhvienApp.controller("modalBannerEventController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", 
    function ($scope, $uibModalInstance, data, sessionService, webService) {
        //#region [Field]
        $scope.openingShow = {
            status: "loading",
            error: undefined
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        if (data.data) {
            $scope.newBannerImg = data.data.newBannerImage;
            $scope.newBannerLink = data.data.newBannerLink;
        }

        sessionService.isReady(function () {
            //            if ($cookies.get('myFavorite')) {
            //                var favoriteCookie = $cookies.get('myFavorite');
            //                var now = new Date();
            //                var time = now.getTime();
            //                if ((favoriteCookie + 36000000) <= time) {
            //                    $scope.checktime = true;
            //                    $scope.onLoadNewsBanner();
            //                } else {
            //                    $scope.checktime = false;
            //                }
            //            } else {
            //                $scope.onLoadNewsBanner();
            //                $scope.checktime = true;
            //                var now = new Date();
            //                var time = now.getTime();
            //                $cookies.put('myFavorite', time, { 'expires': time });
            //            }
        });
        //#endregion
    }
])
giasinhvienApp.controller("modalChangePasswordController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "authenticationService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, authenticationService, Notification) {
        //#region [Field]
        $scope.changePassword = {
            oldpass: undefined,
            repass: undefined,
            newrepass: undefined,
            isBusy: false,
        }

        $scope.UpdateNewPassWord = function () {
            $scope.changePassword.isBusy = true;
            if ($scope.changePassword.repass != $scope.changePassword.newrepass) {
                Notification.error("Nhập lại mật khẩu không đúng");
                $scope.changePassword.isBusy = false;
                return;
            }
            webService.call({
                type: "POST",
                name: "User_UpdateNewPassWord",
                data: {
                    actionUserId: sessionService.userId(),
                    oldPass: $scope.changePassword.oldpass,
                    newPass: $scope.changePassword.repass,
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (code, msg) {
                    $scope.changePassword.isBusy = false;
                },
                onSuccess: function (r) {
                    Notification.success("Đổi Mật Khẩu Thành Công !");
                    $scope.changePassword.isBusy = false;
                    $scope.changePassword.oldpass = "";
                    $scope.changePassword.repass = "";
                    $uibModalInstance.dismiss();
                    $scope.$apply();
                }
            });
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        //#endregion
    }
]);
giasinhvienApp.controller("modalDayCheckController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "authenticationService","Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, authenticationService, Notification) {
        //#region [Field]
        $scope.listDayCheck = {
            Items: undefined,
            PageCount:undefined,
            status: "loading",
        }
        $scope.countDayCheck = {
            Length: undefined,
            status: "loading",
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        webService.call({
            name: "User_GetListDaySignIn",
            data: {
                actionUserId: sessionService.userId(),
                pageIndex: 0,
                pageSize: 5,
                key: sessionService.key(),
            },
            onSuccess: function (r) {
                $scope.listDayCheck.PageCount = r.PageCount;
                $scope.listDayCheck.Items = r.Items;
            }
        });

        webService.call({
            name: "User_GetUserDaySignInReward",
            data: {
                actionUserId: sessionService.userId(),
                key: sessionService.key(),
            },
            onSuccess: function (r) {
                if (r.Result != null) {
                    $scope.countDayCheck.Length = r.Result.SignInContinuesCount;
                } else {
                    $scope.countDayCheck.Length = 0;
                }
            }
        });

        $scope.DoDaySignIn = function ($event) {
            webService.call({
                type: "POST",
                name: "User_DoDaySignIn",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key(),
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success("Bạn Báo Danh Thành Công !");
                    $scope.countDayCheck.Length = r.Result.User_DaySignInReward.SignInContinuesCount;
                }
            });
        };

        //#endregion
    }
])
giasinhvienApp.controller("modalDetailGuildController", ["$scope","$rootScope", "$uibModalInstance", "sessionService", "webService", "data", "Notification",
    function ($scope,$rootScope, $uibModalInstance, sessionService, webService, data, Notification) {
        //#region [Field]
        $scope.openingShow = {
            status: "loading",
            error: undefined
        };
        $scope.ListUserInGuild = {
            Items: undefined,
            Items1: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: false,
            isBusy: false,
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $rootScope.$broadcast("onCloseDetailGuild");
            $uibModalInstance.dismiss();
        };
        $scope.onGetListUserInGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserInGuild.pageIndex = $scope.ListUserInGuild.pageIndex + 1;
            }
            webService.call({
                name: "User_GetListUserInGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserInGuild.pageIndex,
                    pageSize: $scope.ListUserInGuild.pageSize,
                    guildId: data.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserInGuild.message = msg;
                    $scope.ListUserInGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserInGuild.Items) {
                        $scope.ListUserInGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserInGuild.Items = r.Items;
                    }
                    $scope.ListUserInGuild.status = "loaded";
                    $scope.ListUserInGuild.nextList = r.PageIndex + 1 === r.PageCount;
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
            webService.call({
                name: "User_GetGuildInfo",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: data.Id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                },
                onSuccess: function (r) {
                    $scope.ListUserInGuild.Items1 = r.Result;
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }
        $scope.onUserSendRequestJoinGuild = function () {
            webService.call({
                name: "User_SendRequestJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: data.Id,
                    userId: sessionService.userId(),
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (error, msg) {
                    $scope.ListUserInGuild.isBusy = false;
                },
                onSuccess: function (r) {
                    Notification.success('Yêu cầu vào gia tộc đã được gửi đi.');
                    $scope.ListUserInGuild.isBusy = false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        }
        $scope.onWhatDetailUser = function (data) {
            window.open("/user/" + data, '_blank');
        }
        sessionService.isReady(function () {
            $scope.onGetListUserInGuild();
        });
        //#endregion
    }
])
giasinhvienApp.controller("modalEditAvatarGuildController", ["$scope", "$rootScope", "$uibModalInstance", "sessionService", "webService", "data", "Notification",
    function ($scope, $rootScope, $uibModalInstance, sessionService, webService, data, Notification) {
        //#region [Field]
        $scope.uploadavatarguild = {
            linkPhoto: undefined,
        }
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        $scope.UploadImage = function () {
            $('.image-cropper .cropit-image-input.hidden').trigger('click');
        }
        if (data.icongiatoc) {
            $scope.title = "Thay đổi icon gia tộc";
            $scope.class = 'icon';
        } else {
            $scope.title = "Thay đổi ảnh gia tộc";
        }
        $scope.EditAvarta = function () {
            if (data.icongiatoc) {
                var img = $scope.uploadavatarguild.linkPhoto;
                if (img) {
                    var file_data = $('#icon-gia-toc');
                    var f = file_data.prop('files')[0];
                    if (f) {
                        var Nameicon = f.name;
                    } else {
                        Notification.error("Vui lòng chọn lại icon gia tộc !");
                        return;
                    }
                    var res = img.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                    webService.call({
                        type: "POST",
                        name: "User_UploadFile",
                        data: {
                            actionUserId: sessionService.userId(),
                            base64Photo: res,
                            name: Nameicon,
                            key: sessionService.key(),
                        },
                        displayError: true,
                        onSuccess: function (r) {
                            $scope.url = r.Result;
                            if (r.ErrorCode == null) {
                                webService.call({
                                    type: "POST",
                                    name: "User_UpdateGuild",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        guildId: sessionService.data().user.Guild.Id,
                                        name: null,
                                        description: null,
                                        photolink: null,
                                        avatar: $scope.url,
                                        key: sessionService.key(),
                                    },
                                    onError: function(err, msg) {
                                        Notification.error(err);
                                    },
                                    onSuccess: function(a) {
                                        $rootScope.$broadcast("editiconguild", { Items: a.Result });
                                        Notification.success("Đổi icoin Gia Tộc Thành Công !");
                                        $uibModalInstance.dismiss();
                                        $scope.$apply();
                                    }
                                });
                            } else {
                                Notification.error("Bạn chưa chọn hình upload!");
                            }
                            $scope.$apply();
                        }
                    });
                } else {
                    Notification.error("Bạn chưa chọn hình upload!");
                }
            } else {
                var img = $scope.uploadavatarguild.linkPhoto;
                if (img) {
                    var res = img.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                    webService.call({
                        type: "POST",
                        name: "User_UploadPhoto",
                        data: {
                            actionUserId: sessionService.userId(),
                            base64Photo: res,
                            key: sessionService.key(),
                        },
                        displayError: true,
                        onSuccess: function (r) {
                            $scope.url = r.Result;
                            if (r.ErrorCode == null) {
                                webService.call({
                                    type: "POST",
                                    name: "User_UpdateGuild",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        guildId: sessionService.data().user.Guild.Id,
                                        name: null,
                                        description: null,
                                        photolink: $scope.url,
                                        key: sessionService.key(),
                                    },
                                    onError: function (err, msg) {
                                        Notification.error(err);
                                    },
                                    onSuccess: function (a) {
                                        $rootScope.$broadcast("editavatarguild", { Items: a.Result });
                                        Notification.success("Đổi Avarta Gia Tộc Thành Công !");
                                        $uibModalInstance.dismiss();
                                        $scope.$apply();
                                    }
                                })
                            } else {
                                Notification.error("Bạn chưa chọn hình upload!");
                            }
                            $scope.$apply();
                        }
                    });
                } else {
                    Notification.error("Bạn chưa chọn hình upload!");
                }
            }
        }
        //#endregion
    }
])
giasinhvienApp.controller("modalEditGuildController", ["$scope", "$rootScope", "$uibModalInstance", "sessionService", "webService", "data", "Notification",
    function ($scope, $rootScope, $uibModalInstance, sessionService, webService, data, Notification) {
        //#region [Field]
        $scope.uploadavatarguild = {
            linkPhoto: undefined,
        };
        $scope.UserGuildInfo = {
            name: data.GuildInfo.Guild.Name,
            description: data.GuildInfo.Guild.Description,
            photolink: data.GuildInfo.Guild.PhotoLink,
            Avatar: data.GuildInfo.Guild.Avatar,
            isBusy: false,
        };
        //#endregion
        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        $scope.EditAvarta = function () {
            var avatar_giatoc = $('#avatar-giatoc');
            var f = avatar_giatoc.prop('files')[0];
            var icon_giatoc = $('#icon-giatoc');
            var f1 = icon_giatoc.prop('files')[0];
            if (f && f1) {
                var base64Photo = $scope.UserGuildInfo.Avatar.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                var Nameicon = f1.name;
                var base64Photo1 = $scope.UserGuildInfo.photolink.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                webService.call({
                    type: "POST",
                    name: "User_UploadFile",
                    data: {
                        actionUserId: sessionService.userId(),
                        base64Photo: base64Photo,
                        name: Nameicon,
                        key: sessionService.key(),
                    },
                    displayError: true,
                    onSuccess: function (r) {
                        $scope.url_icon = r.Result;
                        webService.call({
                            type: "POST",
                            name: "User_UploadPhoto",
                            data: {
                                actionUserId: sessionService.userId(),
                                base64Photo: base64Photo1,
                                key: sessionService.key(),
                            },
                            displayError: true,
                            onSuccess: function (r) {
                                $scope.url_avatar = r.Result;
                                $scope.uploadguild($scope.url_avatar, $scope.url_icon);
                            },
                        });
                        $scope.$apply();
                    }
                });
            } else if (!f && !f1) {
                $scope.uploadguild($scope.UserGuildInfo.photolink, $scope.UserGuildInfo.Avatar);
            }
            else if (!f && f1) {
                var Nameicon = f1.name;
                var base64Photo = $scope.UserGuildInfo.Avatar.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                webService.call({
                    type: "POST",
                    name: "User_UploadFile",
                    data: {
                        actionUserId: sessionService.userId(),
                        base64Photo: base64Photo,
                        name: Nameicon,
                        key: sessionService.key(),
                    },
                    displayError: true,
                    onSuccess: function (r) {
                        $scope.url_icon = r.Result;
                        $scope.uploadguild($scope.UserGuildInfo.photolink, $scope.url_icon);
                        $scope.$apply();
                    }
                });
            }
            else if (f && !f1) {
                var base64Photo = $scope.UserGuildInfo.photolink.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
                webService.call({
                    type: "POST",
                    name: "User_UploadPhoto",
                    data: {
                        actionUserId: sessionService.userId(),
                        base64Photo: base64Photo,
                        key: sessionService.key(),
                    },
                    displayError: true,
                    onSuccess: function (r) {
                        $scope.url_avatar = r.Result;
                        $scope.uploadguild($scope.url_avatar, $scope.UserGuildInfo.Avatar);
                    },
                });
            }
        }

        $scope.uploadguild = function (avatar, icon) {
            $scope.UserGuildInfo.isBusy = true;
            webService.call({
                type: "POST",
                name: "User_UpdateGuild",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    name: $scope.UserGuildInfo.name,
                    description: $scope.UserGuildInfo.description,
                    photolink: avatar,
                    avatar: icon,
                    key: sessionService.key(),
                },
                onError: function (err, msg) {
                    Notification.error(err);
                    $scope.UserGuildInfo.isBusy = false;
                },
                onSuccess: function (a) {
                    $scope.UserGuildInfo.isBusy = false;
                    $rootScope.$broadcast("onEditGuild", { Items: a.Result });
                    Notification.success("Đổi thông tin gia tộc thành công !");
                    $uibModalInstance.dismiss();
                    $scope.$apply();
                }
            });
        }
        //#endregion
    }
])
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
giasinhvienApp.controller("modalGoldMineController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService","Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService,Notification) {
        $scope.UserGuildInfo = {
            Items: undefined,
    }
 

        $scope.showInfoTower = function () {
            webService.call({
                name: "Guild_GetTowers",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    modalService.showInfoTower({
                        data: rs.Result[1],
                    });
                },

            });
        }

        $scope.onReceiveBonusCoin=function() {
            webService.call({
                name: "User_ReceiveBonusCoin",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    Notification.success('Nhận thành công');
                    $uibModalInstance.dismiss();
                },

            });
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        sessionService.isReady(function () {
            webService.call({
                name: "User_GetUserGuildInfo",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId:sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    console.log(rs);
                    $scope.UserGuildInfo.Items = rs.Result;
                    if(!$scope.$$phase)$scope.$apply;
                },

            });
        });
    }
]);
giasinhvienApp.controller("modalGuildMasterController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification", "$rootScope",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification, $rootScope) {
        //#region [Field]
        $scope.sessionService = sessionService;
        $scope.ListUserInGuild = {
            Items: undefined,
            Items1: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: true,
        }
        $scope.ListUserJoinGuild = {
            Items: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: false,
        };
        $scope.listStar = {
            Items: undefined,
            status: "loading"
        }
        $scope.support = '<p align="left">- Sử dụng RUBY hoặc TIM trong show diễn của idol bất kì sẽ giúp tăng cống hiến cho gia tộc.</p>' +
            '<p align="left">- Cống hiến giúp tăng level gia tộc, gia tộc level càng cao giới hạn số thành viên sẽ càng tăng.</p>' +
            '<p align="left">- Top 3 user cống hiến nhiều nhất của gia tộc sẽ là trưởng lão của gia tộc (cập nhật lúc 11h59 chủ nhật hàng tuần).</p>';
        $scope.ListUserInGuild.remove = function (userId) {
            $($scope.ListUserInGuild.Items).each(function (i, x) {
                if (x.User.Id === userId) {
                    $scope.ListUserInGuild.Items.splice(i, 1);
                    return false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };
        $scope.ListUserJoinGuild.remove = function (userId) {
            $($scope.ListUserJoinGuild.Items).each(function (i, x) {
                if (x.User.Id === userId) {
                    $scope.ListUserJoinGuild.Items.splice(i, 1);
                    return false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };
        //#endregion

        //#region [Event]


        if (data.data) {
            $scope.nexlevel = data.data;
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onUserKickOutUser = function (id) {
            if (sessionService.data().user.User.Id == id) {
                var massage = "Bạn chắc chắn muốn rời khỏi gia tộc này chứ?";
            } else {
                var massage = "Bạn chắc chắn muốn kick người này chứ?";
            }

            modalService.showAlert({
                title: "Xác nhận",
                message: massage,
                buttons: [
                    { text: "Không", style: "btn-default", closeModal: true },
                    {
                        text: "Có",
                        style: "btn-primary",
                        closeModal: true,
                        onClick: function () {
                            webService.call({
                                name: "User_KickOutUser",
                                type: "POST",
                                data: {
                                    actionUserId: sessionService.userId(),
                                    guildId: sessionService.data().user.Guild.Id,
                                    userId: id,
                                    key: sessionService.key()
                                },
                                onError: function (err, msg) {
                                    Notification.error(msg);
                                },
                                onSuccess: function (r) {
                                    if (sessionService.data().user.User.Id == id) {
                                        Notification.success('Rút khỏi gia tộc thành công');
                                        window.location = "/guild";
                                    } else {
                                        Notification.success('Kích ra khỏi gia tộc thành công');
                                    }
                                    $(".get-reward").tooltip("hide");
                                    $scope.ListUserInGuild.remove(id);
                                    if (!$scope.$$phase) $scope.$apply();
                                }
                            });
                        }
                    }
                ]
            });
        }

        $scope.onGetListUserInGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserInGuild.pageIndex = $scope.ListUserJoinGuild.pageIndex + 1;
            }
            if (!sessionService.isSigned()) {
                $scope.ListUserInGuild.status = "error";
                $scope.ListUserInGuild.message = "Bạn cần đăng nhập để xem thông tin gia tộc";
                return;
            };
            if (sessionService.data().user.Guild == null) {
                $scope.ListUserInGuild.status = "error";
                $scope.ListUserInGuild.message = "Hiện bạn chưa gia nhập gia tộc nào";
                return;
            };
            webService.call({
                name: "User_GetListUserInGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserInGuild.pageIndex,
                    pageSize: $scope.ListUserInGuild.pageSize,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserInGuild.message = msg;
                    $scope.ListUserInGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserInGuild.Items) {
                        $scope.ListUserInGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserInGuild.Items = r.Items;
                    }

                    $scope.ListUserInGuild.status = "loaded";
                    $scope.ListUserInGuild.nextList = (r.PageIndex + 1) === r.PageCount;
                    $scope.Total = r.Total;
                    $scope.Totalmax = r.Total;
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
            webService.call({
                name: "User_GetGuildInfo",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                },
                onSuccess: function (r) {
                    $scope.ListUserInGuild.Items1 = r.Result;
                    if (r.Result.Guild.Ruby > 0) {
                        $scope.phantram = ((r.Result.Guild.Ruby - r.Result.GuildLevel.Point) / (r.Result.NextLevel.Point - r.Result.GuildLevel.Point)) * 100;
                    }
                    else {
                        $scope.phantram = 0;
                    }
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }

        $scope.showInfoTower = function () {
            webService.call({
                name: "Guild_GetTowers",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    modalService.showInfoTower({
                        data: rs.Result[0],
                    });
                },

            });
        }

        $scope.onGetListUserJoinGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserJoinGuild.pageIndex = $scope.ListUserJoinGuild.pageIndex + 1;
            }

            if (!sessionService.isSigned()) {
                $scope.ListUserJoinGuild.status = "error";
                $scope.ListUserJoinGuild.message = "Bạn cần đăng nhập để xem thông tin gia tộc";
                return;
            };
            webService.call({
                name: "User_GetListUserJoinGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserJoinGuild.pageIndex,
                    pageSize: $scope.ListUserJoinGuild.pageSize,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserJoinGuild.message = msg;
                    $scope.ListUserJoinGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserJoinGuild.Items) {
                        $scope.ListUserJoinGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserJoinGuild.Items = r.Items;
                    }

                    $scope.ListUserJoinGuild.nextList = r.PageIndex === r.PageCount;
                    $scope.ListUserJoinGuild.status = "loaded";
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }

        $scope.onAcceptUserJoinGuild = function (id) {
            webService.call({
                name: "User_AcceptUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (error, msg) {
                    if (error == 5 || error == 6) {
                        Notification.error(msg);
                    } else {
                        Notification.error(msg);
                        $scope.ListUserJoinGuild.remove(id);
                    }
                },
                onSuccess: function (r) {
                    Notification.success("Chấp nhận user vào gia tộc thành công");
                    $scope.onGetListUserInGuild();
                    $scope.ListUserJoinGuild.remove(id);
                }
            });
        }

        $scope.onDeclineUserJoinGuild = function (id) {
            webService.call({
                name: "User_DeclineUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                    Notification.error("Có lỗi xin thử lại");
                },
                onSuccess: function (r) {
                    Notification.success("Không chấp nhận thành công");
                    $scope.ListUserJoinGuild.remove(id);

                }
            });
        }
        $scope.onGetListIdolInGuild = function () {
            webService.call({
                name: "User_GetListIdolInGuild",
                type:"POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 4,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser:null,
                    key: sessionService.key()
                },
                onSuccess: function (r) {
                    $scope.listStar.Items = r.Items;
                    $scope.$apply();
                }
            });
        }
        $scope.$on("editavatarguild", function (event, args) {
            $scope.ListUserInGuild.Items1.Guild.PhotoLink = args.Items.PhotoLink;
            if (!$scope.$$phase) $scope.$apply;
        });

        $scope.openEditAvatar = function () {
            modalService.showEditAvatarGuild({});
        };
        //#endregion
    }
]);
giasinhvienApp.controller("modalIdolDoneMissionController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification) {
        $scope.sessionService = sessionService;
        $scope.RewardIdol= {
            Items: undefined,
            status:"loading",
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onUserDoneIdolQuest = function () {
            webService.call({
                name: "User_DoneIdolQuest",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    scheduleId: data.scheduleId,
                    key: sessionService.key(),
                },
                onError: function (error, msg) {
                    Notification.error(error);
                },
                onSuccess: function (rs) {
                    Notification.success('Nhận thưởng thành công');
                    $scope.onClose();
                },
            });
        };

        sessionService.isReady(function () {
            webService.call({
                name: "User_GetRewardInfo",
                type: "GET",
                data: {
                    actionUserId: sessionService.userId(),
                    starId: data.starId,
                    key: sessionService.key(),
                },
                onError: function (error, msg) {
                    Notification.error(error);
                },
                onSuccess: function (rs) {
                    $scope.RewardIdol.Items = rs.Result;
                },
            });
        });
    }
]);
giasinhvienApp.controller("modalIdolMissionController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService","Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService,Notification) {
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.level = {
            Items: undefined,
            level: 1,
            numberlevel: undefined,
            checked: 0,
        }
        $scope.showMission= {
            Items: undefined,
            status:"loading",
        }
        console.log(data);
        if (data) {
            $scope.showMission.Items = data;
            $scope.level.numberlevel = data.questInfo.Level - 1;
        }
        webService.call({
            name: "Config_GetConfig",
            type: "GET",
            data: {
                actionUserId: sessionService.userId(),
                value: "IdolQuestMaxLevel",
                key: sessionService.key(),
            },
            onError: function () {

            },
            onSuccess: function (rs) {
                var number = rs.Result.Value * 1;
                var res = [];
                for (var i = 0; i < number; i++) {
                    res.push(i);
                }
                $scope.level.Items = res;
                if (!$scope.$$phase) $scope.$apply();
            },
        });
        sessionService.isReady(function () {

        });
    }
]);
giasinhvienApp.controller("modalIframeRechargeCoinController", ["$scope", "$uibModalInstance","sessionService",
    function ($scope, $uibModalInstance, sessionService) {
        //#region [Field]
        $scope.openingShow = {
            status: "loading",
            error: undefined
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        sessionService.isReady(function() {           
            //$(function () { $('.modal-show-iframe-recharge-coin').draggable({ handle: ".modal-header" }).resizable(); });
        });
        //#endregion
    }
])
giasinhvienApp.controller("modalInfoTowerController", [
    "$scope", "sessionService", "webService", "helperService", "Notification", "modalService", "$uibModalInstance", "data",
    function ($scope, sessionService, webService, helperService, Notification, modalService, $uibModalInstance, data) {
        $scope.isShowButton = {
            status: "loading",
            isBusy: false,
        };
        $scope.amount = {
                Items:undefined,
            },

        $scope.listMoney = [
            {
                value: 10,
            },
            {
                value: 50,
            },
            {
                value: 100,
            },
            {
                value: 150,
            },
            {
                value: 200,
            },
            {
                value: 300,
            },
            {
                value: 500,
            },
            {
                value: 1000,
            },
        ];

        $scope.isShow = function () {
            $scope.isShowButton.isBusy = true;
        };

        if (data.data) {
            $scope.infoTower = data.data;
            if ($scope.infoTower.BankAccount.Balance > 0 && $scope.infoTower.NextLevel) {
                $scope.phantram = ($scope.infoTower.BankAccount.Balance / $scope.infoTower.NextLevel.Coin) * 100;
            } else {
                $scope.phantram = 0;
            }
        }

        $scope.onDonateTower = function () {
            if (!$scope.amount.Items) {
                Notification.error('Bạn chưa chọn tiền cống hiến !');
                return;
            }
            webService.call({
                name: "User_DonateTower",
                type:"POST",
                data: {
                    actionUserId: sessionService.userId(),
                    towerId: $scope.infoTower.Tower.Id,
                    guildId: sessionService.data().user.Guild.Id,
                    amount: $scope.amount.Items,
                    key:sessionService.key()
                },
                onError: function (error,msg) {
                    Notification.error(msg);
                },
                onSuccess: function (r) {
                    $scope.infoTower = r.Result;
                    Notification.success('Cống hiến thành công');
                    $uibModalInstance.dismiss();
                }
            });
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

    }
]);
giasinhvienApp.controller("modalListUserJoinController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification", "$rootScope",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification, $rootScope) {
        //#region [Field]
        $scope.sessionService = sessionService;
        $scope.ListUserJoinGuild = {
            Items: undefined,
            status: "loading",
            message: undefined,
            pageIndex: 0,
            pageSize: 20,
            nextList: false,
        };
        $scope.ListUserJoinGuild.remove = function (userId) {
            $($scope.ListUserJoinGuild.Items).each(function (i, x) {
                if (x.User.Id === userId) {
                    $scope.ListUserJoinGuild.Items.splice(i, 1);
                    return false;
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };

        //#endregion

        //#region [Event]

        $scope.onGetListUserJoinGuild = function (page) {
            if (page >= 0) {
                $scope.ListUserJoinGuild.pageIndex = $scope.ListUserJoinGuild.pageIndex + 1;
            }
            webService.call({
                name: "User_GetListUserJoinGuild",
                type: "POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: $scope.ListUserJoinGuild.pageIndex,
                    pageSize: $scope.ListUserJoinGuild.pageSize,
                    guildId: sessionService.data().user.Guild.Id,
                    nameUser: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListUserJoinGuild.message = msg;
                    $scope.ListUserJoinGuild.status = "error";
                },
                onSuccess: function (r) {
                    if ($scope.ListUserJoinGuild.Items) {
                        $scope.ListUserJoinGuild.Items.concat(r.Items);
                    } else {
                        $scope.ListUserJoinGuild.Items = r.Items;
                    }

                    $scope.ListUserJoinGuild.nextList = r.PageIndex === r.PageCount;
                    $scope.ListUserJoinGuild.status = "loaded";
                    if (!$scope.$$phase) $scope.$apply();
                }
            });
        }

        $scope.onAcceptUserJoinGuild = function (id) {
            webService.call({
                name: "User_AcceptUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (error, msg) {
                    if (error == 5 || error == 6) {
                        Notification.error(msg);
                    } else {
                        Notification.error(msg);
                        $scope.ListUserJoinGuild.remove(id);
                    }
                },
                onSuccess: function (r) {
                    Notification.success("Chấp nhận user vào gia tộc thành công");
                    $scope.ListUserJoinGuild.remove(id);
                }
            });
        }

        $scope.onDeclineUserJoinGuild = function (id) {
            webService.call({
                name: "User_DeclineUserJoinGuild",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                    Notification.error("Có lỗi xin thử lại");
                },
                onSuccess: function (r) {
                    Notification.success("Không chấp nhận thành công");
                    $scope.ListUserJoinGuild.remove(id);

                }
            });
        }
        sessionService.isReady(function () {
            $scope.onGetListUserJoinGuild();
        });
        //#endregion
    }
]);
giasinhvienApp.controller("modalPopupEventController", ["$scope", "$uibModalInstance", "$timeout", "data", "sessionService", "webService",
    function ($scope, $uibModalInstance, $timeout, data, sessionService, webService) {
        //#region [Field]
        $scope.PopupEvent = {
            titleUp: undefined,
            titleItem: undefined,
            PhotoLink: undefined,
            PromotionName: undefined,
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        if (data) {
            $scope.PopupEvent = {
                titleUp: data.titleUp,
                titleItem: data.titleItem,
                PhotoLink: data.PhotoLink,
                PromotionName: data.PromotionName,
            };
            $scope.countGift = data.PhotoLink.length;
            $timeout(function () {
                $uibModalInstance.dismiss();
                $("#PromotionValueDescription").remove();
            }, 20000);
            $timeout(function () {
                $("#bannerCarousel").carousel({
                    interval: 3000
                });
            }, 1500);
        }

        $scope.$on("$viewContentLoaded", function () {
        });

        //#endregion
    }
])
giasinhvienApp.controller("modalRankGuildController", [
    "$scope", "$routeParams", "$log", "sessionService", "webService", "helperService", "Notification", "modalService","$uibModalInstance",
    function ($scope, $routeParams, $log, sessionService, webService, helperService, Notification, modalService, $uibModalInstance) {
        $scope.ListguildRank = {
            status: "loading",
            Items1: undefined,
            Items2: undefined,
            Items3: undefined,
            Items4: undefined,
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onUserKickOutUser = function (id) {
            webService.call({
                name: "User_KickOutUser",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    userId: id,
                    key: sessionService.key()
                },
                onError: function (msg) {
                    notificationService.screenNotification.error("Có lỗi xin thử lại");
                },
                onSuccess: function (r) {
                    notificationService.screenNotification.success("Bạn đã rời khỏi gia tộc");
                    $scope.ListUserInGuild.remove(id);

                }
            });
        }
        sessionService.isReady(function () {
            webService.call({
                name: "User_GetListGuild",
                type:"POST",
                data: {
                    creatorId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 200,
                    nameGuild: "",
                    key: sessionService.key()
                },
                onError: function (msg) {
                    $scope.ListguildRank.message = msg;
                    $scope.ListguildRank.status = "error";
                },
                onSuccess: function (r) {
                    $scope.Total = r.Total;
                    $scope.ListguildRank.status = "loaded";
                    $scope.ListguildRank.Items1 = r.Items[0];
                    $scope.ListguildRank.Items2 = r.Items[1];
                    $scope.ListguildRank.Items3 = r.Items[2];
                    $scope.ListguildRank.Items4 = r.Items.slice(3, 100);
                    if (!$scope.$$phase) $scope.$apply();

                }
            });
        });
    }])
giasinhvienApp.controller("modalRechargeCoinController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification", "helperService", "formService", "$window", "modalService", "$timeout",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification, helperService, formService, $window, modalService, $timeout) {
        //#region [Field]
        $scope.rechargeCoin = {
            card: {
                status: "loading",
                message: undefined,
                isBusy: false,
            },
            bank: {
                status: "loading",
                message: undefined,
                isBusy: false,
            },
            visa: {
                money: undefined,
                isBusy: false,
            },
            teenidol: {
                status: "loading",
                message: undefined,
                isBusy: false,
            }
        };
        $scope.IsSelected = false;
        //#endregion

        $scope.sessionService = sessionService;
        $scope.helper = helperService;
        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onRechargeCoinCardLoad = function () {
            $scope.rechargeCoin.card.status = "loading";
            webService.call({
                name: "GetListSmsTypes",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.card.status = "error";
                    $scope.rechargeCoin.card.message = message;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.card.list = [];
                    $(r.Result).each(function (i, x) {
                        $scope.rechargeCoin.card.list.push({
                            id: x.Value,
                            name: x.Name,
                            photo: "/Content/Image/Card/" + x.Name + ".png"
                        });
                    });
                    $scope.rechargeCoin.card.type = $scope.rechargeCoin.card.list[0].id;
                    $scope.rechargeCoin.card.status = "loaded";
                }
            });
        };

        $scope.onRechargeCoinBankLoad = function () {
            $scope.rechargeCoin.bank.status = "loading";
            webService.call({
                name: "GetBankInfo",
                data: {
                    actionUserId: sessionService.userId(),
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.bank.status = "error";
                    $scope.rechargeCoin.bank.message = message;
                },
                onSuccess: function (r) {
                    $(r.ListMethod).each(function (i, x) {
                        if (i === 0) {
                            r.ListMethod[i].Name = "Thẻ ATM nội địa";
                        } else if (i === 1) {
                            r.ListMethod[i].Name = "Thẻ tín dụng quốc tế";
                        }
                    });

                    $scope.rechargeCoin.bank.minimumMoney = r.MinimumMoney;
                    $scope.rechargeCoin.bank.bonusCoinPercent = r.BonusCoinPercent;
                    $scope.rechargeCoin.bank.listMethod = r.ListMethod;
                    $scope.rechargeCoin.bank.currentMethodId = $scope.rechargeCoin.bank.listMethod[0].Method;
                    $scope.rechargeCoin.bank.currentBankId = $scope.rechargeCoin.bank.listMethod[0].ListBank[0].Id;
                    $scope.rechargeCoin.bank.status = "loaded";
                    $scope.$apply();
                }
            });
        };

        $scope.onRechargeCoinCardSubmit = function ($event) {
            //            var $target = $($event.target);
            //            var $buttonElement = $target.find("[type=submit]");
            //
            //            if (formService.isLoading($buttonElement))
            //                return;
            //            $buttonElement.button("loading");

            //            if (!formService.validate({
            //                target: $buttonElement,
            //                rule: [
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.card.pin && !isNoUoW($scope.rechargeCoin.card.pin);
            //            },
            //                message: "Bạn chưa nhập số PIN."
            //            },
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.card.serial && !isNoUoW($scope.rechargeCoin.card.serial);
            //            },
            //                message: "Bạn chưa nhập số Serial."
            //            }
            //            ]
            //            })) {
            //                $buttonElement.button("reset");
            //                return;
            //            };
            $scope.rechargeCoin.card.isBusy = true;
            var isUseVoucher = false;
            if ($scope.rechargeCoin.card.makhyenmai) {
                var isUseVoucher = true;
            }
            webService.call({
                type: "POST",
                name: "User_DoPayment",
                data: {
                    actionUserId: sessionService.userId(),
                    type: $scope.rechargeCoin.card.type,
                    cardSerial: $scope.rechargeCoin.card.serial,
                    cardPin: $scope.rechargeCoin.card.pin,
                    code: $scope.rechargeCoin.card.makhyenmai,
                    isUseVoucher: isUseVoucher,
                    key: sessionService.key()
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.card.isBusy = false;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.card.isBusy = false;
                    if (r.Result.Amount > 99000) {
                        modalService.showIframeRechargeCoin({
                        });
                    }
                    sessionService.reload();
                    $scope.rechargeCoin.card.type = $scope.rechargeCoin.card.list[0].id;
                    $scope.rechargeCoin.card.pin = undefined;
                    $scope.rechargeCoin.card.serial = undefined;

                    Notification.success("Nạp tiền thành công");

                    $scope.rechargeCoin.card.serial = "";
                    $scope.rechargeCoin.card.pin = "";
                    $scope.rechargeCoin.card.makhyenmai = "";
                    $scope.$apply();
                }
            });
        };

        $scope.onRechargeCoinBankSubmit = function ($event) {
            //            var $target = $($event.target);
            //            var $buttonElement = $target.find("[type=submit]");
            //
            //            if (formService.isLoading($buttonElement))
            //                return;
            //            $buttonElement.button("loading");
            //
            //            if (!formService.validate({
            //                target: $buttonElement,
            //                rule: [
            //                    {
            //                check: function () {
            //                            return true;
            //                            return $scope.rechargeCoin.bank.money && $scope.rechargeCoin.bank.money >= $scope.rechargeCoin.bank.minimumMoney;
            //            },
            //                message: "Số tiền phải >= " + formatNumber($scope.rechargeCoin.bank.minimumMoney) + "."
            //            },
            //                    {
            //                check: function () {
            //                            return typeof $scope.rechargeCoin.bank.currentBankId === "number";
            //            },
            //                message: "Bạn chưa chọn phương thức thanh toán."
            //            }
            //            ]
            //            })) {
            //                $buttonElement.button("reset");
            //                return;
            //            };
            $scope.rechargeCoin.bank.isBusy = true;
            if ($scope.rechargeCoin.bank.currentBankId === "number") {
                Notification.error('Bạn chưa chọn phương thức thanh toán.');
                $scope.rechargeCoin.bank.isBusy = false;
                return;
            }
            if ($scope.rechargeCoin.bank.money < $scope.rechargeCoin.bank.minimumMoney) {
                Notification.error("Số tiền phải >= " + formatNumber($scope.rechargeCoin.bank.minimumMoney) + ".");
                $scope.rechargeCoin.bank.isBusy = false;
                return;
            }
            var isUseVoucher = false;
            if ($scope.rechargeCoin.bank.makhyenmai) {
                var isUseVoucher = true;
            }
            webService.call({
                type: "POST",
                name: "ChargeBank",
                data: {
                    actionUserId: sessionService.userId(),
                    totalAmount: $scope.rechargeCoin.bank.money,
                    paymentMethodId: $scope.rechargeCoin.bank.currentBankId,
                    isUseVoucher: isUseVoucher,
                    code: $scope.rechargeCoin.bank.khuyenmai,
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.bank.isBusy = false;
                    Notification.error(messsage);
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.bank.isBusy = false;
                    $scope.rechargeCoin.bank.money = "";
                    $scope.rechargeCoin.bank.khuyenmai = "";

                    modalService.showAlert({
                        title: "Nạp tiền",
                        message: "Chúng tôi đã chuyển thao tác cho BaoKim, xin hãy tiếp tục quá trình nạp tiền tại đó." +
                              "<br/><br/>Nếu bạn không thấy trang web BaoKim được mở, rất có thể là do hệ thống chặn pop-up tại trình duyệt ở mấy bạn. Xin hãy cho phép TeenIdol được sử dụng popup hoặc <a href='" + r.Result + "' target='_blank'>Click đây để mở web BaoKim</a>",
                        buttons: [
                            { text: "OK", style: "btn-primary" }
                        ]
                    });
                    $window.open(r.Result, "_blank");
                }
            });
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.onVisa = function ($event) {
            var btn = $($event.target).find(".btn");

            if (!$scope.rechargeCoin.visa.money) {
                Notification.error("Xin nhập số tiền");
                return;
            }

            $scope.rechargeCoin.visa.isBusy = true;
            webService.call({
                type: "POST",
                name: "ChargeVisa",
                data: {
                    actionUserId: sessionService.userId(),
                    money: $scope.rechargeCoin.visa.money,
                    promoCode: null,
                    platform: 1,
                    key: sessionService.key()
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.visa.isBusy = false;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.visa.isBusy = false;

                    modalService.showAlert({
                        title: "Nạp tiền",
                        message: "Chúng tôi đã chuyển thao tác cho 1Pay Global Bank, xin hãy tiếp tục quá trình nạp tiền tại đó." +
                              "<br/><br/>Nếu bạn không thấy trang web của 1Pay Global Bank được mở, <a href='" + r.Result.PayUrl + "' target='_blank'>Xin click vào đây</a>",
                        buttons: [
                            { text: "OK", style: "btn-primary", closeModal: true }
                        ]
                    });
                    $window.open(r.Result.PayUrl, "_blank");
                    console.log(r.Result.PayUrl);
                }
            });
        };

        $scope.onRechargeCoinTeenidol = function ($event) {
            //            var $target = $($event.target);
            //            var $buttonElement = $target.find("[type=submit]");
            //
            //            if (formService.isLoading($buttonElement))
            //                return;
            //            $buttonElement.button("loading");
            //            if (!formService.validate({
            //                target: $buttonElement,
            //                rule: [
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.teenidol.pin;
            //            },
            //                message: "Bạn chưa nhập số PIN."
            //            },
            //                    {
            //                check: function () {
            //                            return $scope.rechargeCoin.teenidol.serial;
            //            },
            //                message: "Bạn chưa nhập số Serial."
            //            }
            //            ]
            //            })) {
            //                $buttonElement.button("reset");
            //                return;
            //            };
            $scope.rechargeCoin.teenidol.isBusy = true;
            webService.call({
                type: "POST",
                name: "User_UseVoucher",
                data: {
                    actionUserId: sessionService.userId(),
                    code: $scope.rechargeCoin.teenidol.pin,
                    serial: $scope.rechargeCoin.teenidol.serial,
                    key: sessionService.key()
                },
                displayError: true,
                onError: function (errorCode, message) {
                    $scope.rechargeCoin.teenidol.isBusy = false;
                },
                onSuccess: function (r) {
                    $scope.rechargeCoin.teenidol.isBusy = false;
                    $scope.testEvent = r.Extra;
                    if (r.Extra != null) {
                        $("#modal-up-event").modal("show");
                    }
                    sessionService.reload();
                    $scope.rechargeCoin.card.type = $scope.rechargeCoin.card.list[0].id;
                    $scope.rechargeCoin.card.pin = undefined;
                    $scope.rechargeCoin.card.serial = undefined;

                    Notification.success("Nạp tiền thành công");
                    $scope.rechargeCoin.teenidol.serial = "";
                    $scope.rechargeCoin.teenidol.pin = "";
                    $scope.$apply();
                }
            });
        };
        $scope.onIsSelected = function () {
            $scope.IsSelected = true;
            if (!$scope.$$phase) $scope.$apply();
        }
//        $scope.onDeselect = function () {
//            $scope.IsSelected = false;
//            if (!$scope.$$phase) $scope.$apply();
//        }
        //#endregion
    }
])
giasinhvienApp.controller("modalRegisterstarController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification) {
        //#region [Field]
        $scope.register = {
            email: undefined,
            name: undefined,
            phone: undefined,
            youtube: undefined,
            facebook: undefined,
            talent: undefined,
            isBusy: false
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onRegisterStar = function ($event) {
            $scope.register.isBusy = true;
            if (!$scope.register.name || !$scope.register.phone || !$scope.register.email) {
                if (!$scope.register.email) {
                    Notification.error("Bạn chưa nhập email");
                }
                if (!$scope.register.name) {
                    Notification.error("Bạn chưa nhập tên");
                }
                if (!$scope.register.phone) {
                    Notification.error("Bạn chưa nhập số điện thoại");
                }
                return;
            }
            webService.call({
                type: "POST",
                name: "Star_RegisterStar",
                data: {
                    actionUserId: sessionService.userId(),
                    name: $scope.register.name,
                    phone: $scope.register.phone,
                    email: $scope.register.email,
                    facebookLink: $scope.register.facebook,
                    youtubeLink: $scope.register.youtube,
                    talenDescription: $scope.register.talent,
                    key: sessionService.key(),
                },
                displayError: true,
                onError: function (msg) {
                    $scope.register.isBusy = false;
                    return;
                },
                onSuccess: function (r) {
                    Notification.success('Cảm ơn ban đã đăng ký làm idol . Teenidol sẽ liên lạc với bạn sớm nhất !');
                    $uibModalInstance.dismiss();
                    $scope.register.isBusy = false;
                }
            });
        };
        //#endregion
    }
])
giasinhvienApp.controller("modalReportController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification", "data", "authenticationService",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification, data, authenticationService) {
        //#region [Field]

        $scope.Content = {
            Photo: undefined,
            Description: undefined,
            isBusy: false,
        }

        html2canvas(document.body, {
            onrendered: function (canvas) {
                $scope.Content.Photo = canvas.toDataURL();
            },
        });
        //#endregion

        //#region [Event]
        $scope.onUserReportIdol = function () {
            if (!sessionService.isSigned()) {
                authenticationService.showModal({
                    mode: "sign-in",
                    message: "Bạn cần đăng nhập để sử dụng tính năng này"
                });
                return;
            }
            if (!$scope.Content.Photo) {
                Notification.error('Bạn chưa chọn hình upload');
                return;
            }
            if (!$scope.Content.Description) {
                Notification.error('Bạn chưa mô tả thông tin báo xấu');
                return;
            }
            var base64Photo = $scope.Content.Photo.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

            webService.call({
                type: "POST",
                name: "User_ReportIdol",
                data: {
                    actionUserId: sessionService.userId(),
                    base64Photo: base64Photo,
                    starId: data.data.starId,
                    note: $scope.Content.Description,
                    platform: 1,
                    key: sessionService.key(),
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success(r.Message);
                    $scope.onClose();
                    $scope.Content = {
                        Photo: undefined,
                        Description: undefined,
                        isBusy: false,
                    }
                },
            });

        };
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        //#endregion
    }
])
giasinhvienApp.controller("modalShopGuildController", ["$scope", "$uibModalInstance", "data", "sessionService","webService","modalService",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService) {
        var pageindex = 0;
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        }
        
        if (data.data) {
            $scope.nexlevel = data.data;
            if ($scope.nexlevel.BankAccount.Balance > 0) {
                if ($scope.nexlevel.NextLevel) {
                    $scope.phantram = ($scope.nexlevel.BankAccount.Balance / $scope.nexlevel.NextLevel.Coin) * 100;
                } else {
                    $scope.phantram = 0;
                }

            } else {
                $scope.phantram = 0;
            }
        }

        $scope.showInfoTower = function () {
            webService.call({
                name: "Guild_GetTowers",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    guildId: sessionService.data().user.Guild.Id,
                    key: sessionService.key()
                },
                onError: function () {

                },
                onSuccess: function (rs) {
                    modalService.showInfoTower({
                        data: rs.Result[2],
                    });
                },

            });
        }

        $scope.onLoadListItemCategories = function () {
            webService.call({
                name: "List_ItemCategories",
                data: {
                    pageIndex: pageindex,
                    pageSize: 15,
                    key:sessionService.key(),
                },
                onSuccess: function (r) {
                    $scope.ListItemCatelogy = r.Items;
                    array = [];
//                    angular.forEach($scope.ListItemCatelogy, function (attr) {
//                        $scope.listId = attr.ItemCategory.Id;
                        var data = {
                            pageIndex: 0,
                            pageSize: 15,
                            key: sessionService.key(),
                            categoryId: 10,
                            isNewVersion: true,
                            guildId:sessionService.data().user.Guild.Id,
                        }
                        webService.call({
                            name: "List_ItemsAnimationInStoreForGuild",
                           // type:"POST",
                            data: data,
                            onSuccess: function (r) {
                                $scope.list = r.Items;
                                angular.forEach($scope.list, function(attr) {
                                    array.push(attr);
                                });
//                                $scope.ListShopCatelogy = array;
                                $scope.ListShopCatelogy = r.Items;
                                $scope.$apply();
                            }
                        });
//                    });
                    $scope.$apply();
                }
            });
        }

        $scope.onLoadShopItem = function () {
            var currentTab = $(".star-panel .tab-pane.active").attr("id");
            switch (currentTab) {
                default:
                case "shop-catelogy":
                    if ($scope.ListShopCatelogy)
                        return;
                    $scope.ListShopCatelogy = {};
                    $scope.onLoadListItemCategories();
                    break;

                case "shop-vip":
                    if ($scope.ListShopVip)
                        return;
                    $scope.ListShopVip = {};
                    var nameService = 'List_ItemsVipInStore';
                    var data = {
                        pageIndex: pageindex,
                        pageSize: 15,
                        key: sessionService.key()
                    }
                    webService.call({
                        name: nameService,
                        data: data,
                        onSuccess: function (r) {
                            console.log(r);
                            $scope.ListShopVip = r.Items;
                            $scope.$apply();
                        }
                    });
                    break;
            }
        }

        sessionService.isReady(function() {
            $(".star-panel a[data-toggle='tab']").on("shown.bs.tab", function(e) {
                $scope.onLoadShopItem();
            });
            $(".star-panel .active a[data-toggle='tab']").trigger("shown.bs.tab");
        });

    }
]);
giasinhvienApp.controller("modalShowOpeningController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification){
        //#region [Field]
        $scope.openingShow = {
            status: "loading",
            error: undefined
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        $scope.onLoadShowOpening = function () {
            var now = new Date();
            var start = now.setHours(0, 0, 0, 0);
            var end = now.setHours(23, 59, 59, 999);

            webService.call({
                name: "ShowSchedule_GetListShowByStatus",
                data: {
                    actionUserId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 999999,
                    scheduleStatus: 2,
                    startTime: start,
                    endTime: end,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.openingShow.status = "error";
                    $scope.openingShow.error = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.openingShow.listItem = [];
                    $(r.Items).each(function (i, x) {
                        if (x.ListShow[0].StarUser.Id === sessionService.userId()) {
                            return;
                        }
                        $scope.openingShow.listItem.push(x);
                    });
                    $scope.openingShow.status = "loaded";
                    $scope.$apply();
                }
            });
        };
        sessionService.isReady(function () {
            $scope.onLoadShowOpening();
        })
        //#endregion
    }
])
giasinhvienApp.controller("modalShowRankController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService",
    function ($scope, $uibModalInstance, data, sessionService, webService) {
        //#region [Field]

        $scope.showRank = {
            currentStatus: "loading",
            currentError: undefined,
            listCurrent: undefined,

            allStatus: "loading",
            allError: undefined,
            listAll: undefined
        };
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };
        if (data) {
            webService.call({
                name: "User_GetListTopUserUseCoinInShow",
                data: {
                    actionUserId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 10,
                    scheduleId: data.data.scheduleId,
                    showId: data.data.showId,
                    starId: data.data.starId,
                    startDate: -1,
                    endDate: -1,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showRank.currentStatus = "error";
                    $scope.showRank.currentError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.showRank.listCurrent = r.Items;
                    $scope.showRank.currentStatus = "loaded";
                    $scope.$apply();
                }
            });

            webService.call({
                name: "User_GetListTopUserUseCoinInShow",
                data: {
                    actionUserId: sessionService.userId(),
                    pageIndex: 0,
                    pageSize: 10,
                    scheduleId: -1,
                    showId: data.data.showId,
                    starId: data.data.starId,
                    startDate: -1,
                    endDate: -1,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showRank.allStatus = "error";
                    $scope.showRank.allError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    console.log(r);
                    $scope.showRank.listAll = r.Items;
                    $scope.showRank.allStatus = "loaded";
                    $scope.$apply();
                }
            });
        }

        //#endregion
    }
])
giasinhvienApp.controller("modalShowScheduleController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "helperService",
    function ($scope, $uibModalInstance, data, sessionService, webService, helperService) {
        //#region [Field]
        $scope.data = data.data;
        $scope.showSchedule = {
            currentStatus: "loading",
            currentError: undefined,
            listCurrent: undefined,

            otherStatus: "loading",
            otherError: undefined,
            listOther: undefined
        };
        $scope.helper = helperService;
        //#endregion

        //#region [Event]
        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        $scope.onShowSchedule = function () {
            var now = new Date();
            var startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
            var d = now.getDate();
            webService.call({
                name: "Star_GetListShowTime",
                data: {
                    actionUserId: sessionService.userId(),
                    starId: $scope.data.starId,
                    pageIndex: 0,
                    pageSize: 999999,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showSchedule.currentStatus = "error";
                    $scope.showSchedule.currentError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.showSchedule.listCurrent = [[], []];

                    $(r.Items).each(function (i, x) {
                        var startTime = new Date(x.StarSchedule.StartTime);
                        var l = (startTime.getUTCDate() === d) ? $scope.showSchedule.listCurrent[0] : $scope.showSchedule.listCurrent[1];

                        if (!l[startTime.getUTCHours()]) {
                            l[startTime.getUTCHours()] = {
                                startTime: x.StarSchedule.StartTime,
                                endTime: x.StarSchedule.EndTime,
                            };
                        }
                    });
                    $scope.showSchedule.currentStatus = "loaded";
                    $scope.$apply();
                }
            });

            webService.call({
                name: "List_ShowSchedule",
                data: {
                    actionUserId: sessionService.userId(),
                    startTime: startTime.getTime(),
                    endTime: endTime.getTime(),
                    pageIndex: 0,
                    pageSize: 999999,
                    key: sessionService.key()
                },
                onError: function (errorCode, message) {
                    $scope.showSchedule.otherStatus = "error";
                    $scope.showSchedule.otherError = message;
                    $scope.$apply();
                },
                onSuccess: function (r) {
                    $scope.showSchedule.listOther = [[], []];

                    $(r.Items).each(function (i, x) {
                        var startTime = new Date(x.Schedule.StartTime);
                        var l = (startTime.getUTCDate() === d) ? $scope.showSchedule.listOther[0] : $scope.showSchedule.listOther[1];
                        l.push(x);
                    });

                    $scope.showSchedule.otherStatus = "loaded";
                    $scope.$apply();

                    $("#modal-show-schedule-other a[data-toggle='tab']").on("shown.bs.tab", function (e) {
                        $("#modal-show-schedule-other .photo img").imageScale();
                    });
                }
            });
        };
        sessionService.isReady(function () {
            $scope.onShowSchedule();
            $(".modal-show-schedule").on("shown.bs.modal", $scope.onShowSchedule);
        })
        //#endregion
    }
])
giasinhvienApp.controller("modalTakingMissionController", [
    "$scope", "$uibModalInstance", "data", "sessionService", "webService", "modalService", "Notification", "$rootScope",
    function ($scope, $uibModalInstance, data, sessionService, webService, modalService, Notification, $rootScope) {
        $scope.level = {
            Items: undefined,
            level: 0,
            numberlevel: undefined,
            checked: -1,
            countQuestInDay: undefined,
            maxQuestInDay: undefined,
        }

        $scope.getNumber = function (num) {
            return new Array(num);
        }

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        //event 
        webService.call({
            name: "User_CheckIdolQuest",
            type: "GET",
            data: {
                actionUserId: sessionService.userId(),
                starId: data.starId,
                key: sessionService.key(),
            },
            onError: function(error, msg) {
            },
            onSuccess: function(rs) {
                $scope.level.countQuestInDay = rs.Result.countQuestInDay;
                $scope.level.maxQuestInDay = rs.Result.maxQuestInDay;
            }
        });
        webService.call({
            name: "Config_GetConfig",
            type: "GET",
            data: {
                actionUserId: sessionService.userId(),
                value: "IdolQuestMaxLevel",
                key: sessionService.key(),
            },
            onError: function () {

            },
            onSuccess: function (rs) {
                var number = rs.Result.Value * 1;
                var res = [];
                for (var i = 0; i < number; i++) {
                    res.push(i);
                }
                $scope.level.numberlevel = number;
                $scope.level.Items = res;
                if (!$scope.$$phase) $scope.$apply();
            },
        });
        //end event

        $scope.onIdolGetQuest = function () {
            if ($scope.level.level == 0) {
                Notification.error('Bạn vui lòng chọn cấp độ nhiệm vụ');
                return;
            }
            webService.call({
                name: "User_IdolGetQuest",
                type: "POST",
                data: {
                    actionUserId: sessionService.userId(),
                    scheduleId: data.scheduleId,
                    level: $scope.level.level,
                    key: sessionService.key(),
                },
                onError: function (error, msg) {
                    Notification.error("Bạn đã hết số lần nhận nhiệm vụ");
                    $scope.onClose();
                },
                onSuccess: function (rs) {
                    var nhannhiemvu = rs.Result;
                    //$rootScope.$broadcast("onDoneMissionIdol", {
                    //    nhannhiemvu: nhannhiemvu,
                    //});
                    Notification.success("Nhận nhiệm vụ thành công");
                    $scope.onClose();
                    if (!$scope.$$phase) $scope.$apply();
                },
            });

        },
            $scope.editlevelmission = function (level) {
                $scope.level.level = level + 1;
                $scope.level.checked = level;

            };

        sessionService.isReady(function () {
           
        });
    }
]);
giasinhvienApp.controller("modalUserMissionController", ["$scope", "$uibModalInstance", "data", "sessionService", "webService", "Notification",
    function ($scope, $uibModalInstance, data, sessionService, webService, Notification) {
        //#region [Field]

        $scope.GetListMission = {
            status: "loading",
            Items: undefined,
        }
        $scope.GetListMissionother = {
            status: "loading",
            Items: undefined,
        }
        //#endregion

        //#region [Event]

        $scope.onClose = function () {
            $uibModalInstance.dismiss();
        };

        webService.call({
            name: "User_GetListPromotionGift",
            data: {
                creatorId: sessionService.userId(),
                pageIndex: 0,
                pageSize: 9999,
                list_PromotionGiftId: "",
                list_ActionId: "",
                userId: sessionService.userId(),
                key: sessionService.key(),
            },
            onSuccess: function (r) {
                $scope.listItems = r.Items;
                var array = [];
                var array1 = [];
                var array2 = [];
                for (i = 2; i <= 15; i++) {
                    $(r.Items).each(function (j, y) {
                        if (y.GroupLevelUser) {
                            if (y.GroupLevelUser.LevelIndex === i) {
                                array1.push(y);
                            }
                        }
                    });
                    array.push({ rs: array1, name: array1[0].GroupLevelUser.Name, photo: array1[0].GroupLevelUser.Photo, UserHad: array1[0].UserHad, id: array1[0].GroupLevelUser.LevelIndex });
                    array1 = [];
                }
                $(r.Items).each(function (j, y) {
                    if (!y.GroupLevelUser) {
                        array2.push(y);
                    }
                });
                $scope.GetListMission.Items = array;
                $scope.GetListMissionother.Items = array2;
            }
        });



        $scope.RewardMission = function (event) {
            var listPromotionGiftId = event;
            var listid = "";
            $($scope.listItems).each(function (j, y) {
                if (y.GroupLevelUser) {
                    if (y.GroupLevelUser.LevelIndex === listPromotionGiftId) {
                        listid += y.PromotionGift.Id + ',';
                    }
                }
            });
            var str = listid.substring(0, listid.length - 1);

            webService.call({
                type: "POST",
                name: "User_ReceivePromotionGift",
                data: {
                    actionUserId: sessionService.userId(),
                    listPromotionGiftId: str,
                    key: sessionService.key()
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success("Nhận Thưởng Thành Công!");
                    webService.call({
                        name: "User_GetListPromotionGift",
                        data: {
                            creatorId: sessionService.userId(),
                            pageIndex: 0,
                            pageSize: 9999,
                            list_PromotionGiftId: "",
                            list_ActionId: "",
                            userId: sessionService.userId(),
                            key: sessionService.key(),
                        },
                        onSuccess: function (r) {
                            $scope.listItems = r.Items;
                            var array = [];
                            var array1 = [];
                            var array2 = [];
                            for (i = 2; i <= 15; i++) {
                                $(r.Items).each(function (j, y) {
                                    if (y.GroupLevelUser) {
                                        if (y.GroupLevelUser.LevelIndex === i) {
                                            array1.push(y);
                                        }
                                    }
                                });
                                array.push({ rs: array1, name: array1[0].GroupLevelUser.Name, photo: array1[0].GroupLevelUser.Photo, UserHad: array1[0].UserHad, id: array1[0].GroupLevelUser.LevelIndex });
                                array1 = [];
                            }
                            $(r.Items).each(function (j, y) {
                                if (!y.GroupLevelUser) {
                                    array2.push(y);
                                }
                            });
                            $scope.GetListMission.Items = array;
                            $scope.GetListMissionother.Items = array2;
                            if (!$scope.$$phase) $scope.$apply();
                        }
                    });
                }
            });
        };

        $scope.RewardMissionother = function (event) {
            var listPromotionGiftId = event;
            webService.call({
                type: "POST",
                name: "User_ReceivePromotionGift",
                data: {
                    actionUserId: sessionService.userId(),
                    listPromotionGiftId: listPromotionGiftId,
                    key: sessionService.key()
                },
                displayError: true,
                onSuccess: function (r) {
                    Notification.success("Nhận Thưởng Thành Công!");

                }
            });
        };

        //#endregion
    }
])
giasinhvienApp.controller("popoverSeatMenuController", ["$scope", "sessionService", "webService", "popoverService",
    function ($scope, sessionService, webService, popoverService) {
        //#region [Field]
        $scope.status = "loading";
        $scope.message = undefined;
        $scope.data = popoverService.seatMenu;
        $scope.scheduleId = undefined;
        $scope.user = {
            id: undefined,
            name: undefined,
            avatar: undefined,
            vipName: undefined,
            vipPhoto: undefined,
            vipColor: undefined,
            levelName: undefined,
            levelPhoto: undefined,
            coin: undefined
        };
        $scope.seat = {
            index: undefined,
            listBasePrice: undefined,
            currentPrice: undefined,
            createDate : undefined,
            endDate : undefined
        };
        $scope.buy = {
            listPrice: [],
            selectedPrice: undefined,
            isBusy: false
        };
        
        //#endregion

        //#region [Event]

        $scope.$watch("data", function (value) {
            $scope.scheduleId = value.scheduleId;
            $scope.seat.index = value.index;
            $scope.seat.listBasePrice = value.listPrice;
            $scope.seat.currentPrice = value.price;
            $scope.seat.createDate = value.createDate;
            $scope.seat.endDate = value.endDate;

            if (value.userId) {
                $scope.status = "loading";
                webService.call({
                    name: "User_GetDetails",
                    data: {
                        actionUserId: sessionService.userId(),
                        userId: value.userId,
                        isStart: false,
                        key: sessionService.key()
                    },
                    onError: function(msg) {
                        $scope.status = "error";
                        $scope.message = msg;
                    },
                    onSuccess: function(r) {
                        $scope.user.id = r.Result.User.Id;
                        $scope.user.name = r.Result.User.Name;
                        $scope.user.avatar = r.Result.User.AvatarPhoto;
                        $scope.user.vipName = r.Result.VipItem ? r.Result.VipItem.Name : undefined;
                        $scope.user.vipPhoto = r.Result.VipItem ? r.Result.VipItem.PhotoLink : undefined;
                        $scope.user.vipColor = r.Result.VipItem ? r.Result.VipItem.HexColor : undefined;
                        $scope.user.levelName = r.Result.GroupLevel.Name;
                        $scope.user.levelPhoto = r.Result.GroupLevel.Photo;
                        $scope.user.coin = r.Result.User.TotalCoinUsed;
                        $scope.status = "loaded";
                    }
                });
            } else {
                $scope.user = undefined;
                $scope.status = "loaded";
            }
        });

        $scope.$watch("seat.currentPrice", function (value) {
            if (!$scope.seat.listBasePrice)
                return;
            
            $scope.buy.listPrice = [];
            $($scope.seat.listBasePrice).each(function (i, x) {
                if (!value || x > value)
                    $scope.buy.listPrice.push(x);
            });
            if ($scope.buy.listPrice.length > 0)
                $scope.buy.selectedPrice = $scope.buy.listPrice[0];
        });

        $scope.onSubmit = function ($event) {
            if ($scope.data.onSubmit)
                $scope.data.onSubmit({ $popoverScope: $scope });
        };

        //#endregion
    }
]);
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
                                return null;
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
giasinhvienApp.factory("formService", [
    function () {
        var service = new function () {
            this.validate = function (o) {
                //#region [Validation]

                if (!o || typeof o !== "object")
                    return true;
                if (!o.target)
                    throw "target must be declared";
                if (o.rule && o.rule.constructor !== Array)
                    throw "rule must be array";
                o.position = getOrDefault(o.position, "top");

                //#endregion

                //#region [Init tooltip]

                var tooltip = o.target.data("kendoTooltip");
                if (!tooltip) {
                    tooltip = o.target.kendoTooltip({
                        autoHide: false,
                        position: o.position,
                        showOn: "",

                        show: function () {
                            tooltip.popup.element.find(".k-tooltip-button").remove();
                            tooltip.popup.element.addClass("form-error-container");
                        }
                    }).data("kendoTooltip");
                }

                //#endregion

                //#region [Clear]

                tooltip.hide();
                tooltip.options.content = "";
                tooltip.refresh();

                //#endregion

                if (!o.rule)
                    return true;

                //#region [Generate message]

                $(o.rule).each(function (i, x) {
                    if (x.constructor === Array) {
                        $(x).each(function (j, y) {
                            if (!y.check()) {
                                tooltip.options.content += "<li>" + y.message + "</li>";
                                return false;
                            }
                        });
                    } else {
                        if (!x.check())
                            tooltip.options.content += "<li>" + x.message + "</li>";
                    }
                });

                if (tooltip.options.content !== "") {
                    tooltip.options.content = "<ul>" + tooltip.options.content + "</ul>";
                    tooltip.refresh();
                    tooltip.show();
                }

                //#endregion

                return tooltip.options.content === "";
            };

            this.isLoading = function (target) {
                if (target.data("bs.button"))
                    return target.data("bs.button").isLoading;

                return false;
            };

            this.isDisabled = function (target) {
                return target.hasClass("disabled");
            };
        };
        return service;
    }
]);
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
giasinhvienApp.factory("menulinkService", [
    function () {
        var service = new function () {
            this.listMenuHead = function () {
                return [
                        {
                            Name: "Giới Thiệu",
                            Link: '/',
                        },
                        {
                            Name: "Chính Sách",
                            Link: '/',
                        },
                        {
                            Name: "Liên Hệ",
                            Link: '/',
                        }
                                ];
            };

            this.listCategory = function () {
                return [
                        {
                            Id: 1,
                            Name: "Đồ Điện Tử",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        //{
                        //    Id: 2,
                        //    Name: "Xe Cộ",
                        //    Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                        //    Link: '/',
                        //    Status: 1
                        //},
                        {
                            Id: 7,
                            Name: "Nội Ngoại Thất",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        {
                            Id: 4,
                            Name: "Gia Dụng",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        //{
                        //    Id: 8,
                        //    Name: "Giải Trí Thể Thao",
                        //    Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                        //    Link: '/',
                        //    Status: 1
                        //},
                        {
                            Id: 10,
                            Name: "Sách Báo",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        {
                            Id: 13,
                            Name: "Bất Động Sản",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        {
                            Id: 15,
                            Name: "Các Loại Khác",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        }
                                ];
            };
        };
        return service;
    }
]);
giasinhvienApp.factory("modalService", ["$uibModal", "sessionService",
    function ($uibModal, sessionService) {
        var service = new function () {
            this.showAlert = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-alert",
                    animation: true,
                    templateUrl: "/Layouts/Modal/Alert.html",
                    controller: "modalAlertController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            };
            this.showAlertKickAdmin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-alert",
                    animation: true,
                    templateUrl: "/Layouts/Modal/AlertKickAdmin.html",
                    controller: "modalAlertController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            };

            this.showFacebookLive = function (o) {
                if (o === undefined || o === null)
                    o = {};

                var modal = $uibModal.open({
                    windowClass: "modal-facebook-live",
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    templateUrl: "/Layouts/Modal/FacebookLive.html",
                    controller: "modalFacebookLiveController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });

                modal.result.then(function (r) {
                    o.onSuccess(r);
                });
            };

            //            this.showLogin = function (o) {
            //                if (o === undefined || o === null)
            //                    o = {};
            //                if (!o.onSuccess && typeof o.onSuccess !== "function")
            //                    throw "onSuccess must be function";
            //
            //                var modal = $uibModal.open({
            //                    windowClass: "modal-login",
            //                    animation: true,
            //                    size: "lg",
            //                    templateUrl: "/Layouts/Modal/Login.html",
            //                    controller: "modalLoginController",
            //                    resolve: {
            //                        data: function () {
            //                            return o;
            //                        }
            //                    }
            //                });
            //
            //                modal.result.then(function (r) {
            //                    if (o.onSuccess)
            //                        o.onSuccess(r);
            //                });
            //            };
            //
            //            this.showLogout = function (o) {
            //                if (o === undefined || o === null)
            //                    o = {};
            //                if (!o.onSuccess && typeof o.onSuccess !== "function")
            //                    throw "onSuccess must be function";
            //
            //                var modal = $uibModal.open({
            //                    windowClass: "modal-logout",
            //                    animation: true,
            //                    templateUrl: "/Layouts/Modal/Alert.html",
            //                    controller: "modalAlertController",
            //                    resolve: {
            //                        data: function () {
            //                            return {
            //                                title: "Đăng xuất",
            //                                message: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản '" + sessionService.user().name + "' ? Các idol sẽ nhớ bạn lắm đấy",
            //                                buttons: [
            //                                {
            //                                    text: "Không",
            //                                    style: "btn-default",
            //                                    closeModal: true
            //                                },
            //                                {
            //                                    text: "Có",
            //                                    style: "btn-primary",
            //                                    closeModal: true,
            //                                    onClick: function () {
            //                                        var userId = sessionService.userId();
            //                                        sessionService.clearLoginInfo();
            //                                        if (o.onSuccess && typeof o.onSuccess === "function")
            //                                            o.onSuccess(userId);
            //                                    }
            //                                }]
            //                            }
            //                        }
            //                    }
            //                });
            //            };

            //            this.AdminKick = function (o) {
            //                if (o === undefined || o === null)
            //                    o = {};
            //                if (o.title === undefined)
            //                    o.title = "";
            //                if (o.buttons !== undefined && o.buttons.constructor !== Array)
            //                    throw "buttons must be array type";
            //
            //                var modal = $uibModal.open({
            //                    windowClass: "modal-adminkick",
            //                    animation: true,
            //                    size: "lg",
            //                    templateUrl: "/Layouts/Modal/AdminKick.html",
            //                    controller: "modalAdminKickController",
            //                    resolve: {
            //                        data: function () {
            //                            return o;
            //                        }
            //                    }
            //                });
            //            };

            this.showUserDayCheck = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-daycheck",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/DayCheck.html",
                    controller: "modalDayCheckController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showRegisterstar = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-registerstar",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/Registerstar.html",
                    controller: "modalRegisterstarController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showUserMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-usermission",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/UserMission.html",
                    controller: "modalUserMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showUserRechargeCoin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-recharge-coin",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/RechargeCoin.html",
                    controller: "modalRechargeCoinController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showShowRank = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-rank",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowRank.html",
                    controller: "modalShowRankController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showShowOpening = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-opening",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowOpening.html",
                    controller: "modalShowOpeningController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showShowSchedule = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-schedule",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowSchedule.html",
                    controller: "modalShowScheduleController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showPopupEvent = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-popup-event",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ShowPopupEvent.html",
                    controller: "modalPopupEventController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showBannerEvent = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-banner-event",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/BannerEvent.html",
                    controller: "modalBannerEventController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showIframeRechargeCoin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-iframe-recharge-coin",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/IframeRechargeCoin.html",
                    controller: "modalIframeRechargeCoinController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showDetailGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-detail-guild",
                    animation: true,
                    backdrop: "static",
                    size: "lg",
                    keyboard: false,
                    templateUrl: "/Layouts/Modal/DetailGuild.html",
                    controller: "modalDetailGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showChangePassword = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-show-change-password",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/ChangePassword.html",
                    controller: "modalChangePasswordController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showGuildMaster = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-guild-master",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/GuildMaster.html",
                    controller: "modalGuildMasterController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showListUserJoin = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-list-user-join",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/ListUserJoin.html",
                    controller: "modalListUserJoinController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showShopGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-shop-guild",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/ShopGuild.html",
                    controller: "modalShopGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showGoldMine = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-gold-mine",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/GoldMine.html",
                    controller: "modalGoldMineController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showRankGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-rank-guild",
                    animation: true,
                    size: "lg",
                    templateUrl: "/Layouts/Modal/RankGuild.html",
                    controller: "modalRankGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showInfoTower = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-info-tower",
                    animation: true,
                    size: "",
                    templateUrl: "/Layouts/Modal/InfoTower.html",
                    controller: "modalInfoTowerController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showEditAvatarGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-edit-avatar-guild",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/EditAvatarGuild.html",
                    controller: "modalEditAvatarGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showEditGuild = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-edit-guild",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/EditGuild.html",
                    controller: "modalEditGuildController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
            this.showTakingMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-taking-mission",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/TakingMission.html",
                    controller: "modalTakingMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showIdolMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-idol-mission",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/IdolMission.html",
                    controller: "modalIdolMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showIdolDoneMission = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-idol-done-mission",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/IdolDoneMission.html",
                    controller: "modalIdolDoneMissionController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }

            this.showReport = function (o) {
                if (o === undefined || o === null)
                    o = {};
                if (o.title === undefined)
                    o.title = "";
                if (o.buttons !== undefined && o.buttons.constructor !== Array)
                    throw "buttons must be array type";

                var modal = $uibModal.open({
                    windowClass: "modal-report",
                    animation: true,
                    size: "sm",
                    templateUrl: "/Layouts/Modal/Report.html",
                    controller: "modalReportController",
                    resolve: {
                        data: function () {
                            return o;
                        }
                    }
                });
            }
        };
        return service;
    }
]);
//giasinhvienApp.factory("notificationService", [
//    function() {
//        var _topNotificationTemplate = "<div id='top-notification' style='display: none;'></div>";
//        var _screenNotificationTemplate = "<div id='centered-notification' style='display: none;'></div>";
//
//        //#region [Init Top & Screen Notification]
//
//        $("body").append(_topNotificationTemplate);
//        var _topNotification = $("#top-notification").kendoNotification({
//            stacking: "down",
//            button: true,
//            autoHideAfter: 7000,
//            templates: [
//                {
//                    type: "info",
//                    template: $("#top-notification-template").html()
//                }
//            ],
//            show: function(e) {
//                if (!$("." + e.sender._guid)[1]) {
//                    var element = e.element.parent(),
//                        eWidth = element.width(),
//                        wWidth = $(window).width(),
//                        newLeft;
//
//                    newLeft = Math.floor(wWidth / 2 - eWidth / 2);
//
//                    e.element.parent().css({ top: 10, left: newLeft });
//                }
//            }
//        }).data("kendoNotification");
//
//        $("body").append(_screenNotificationTemplate);
//        var _screenNotification = $("#centered-notification").kendoNotification({
//            stacking: "down",
//            button: true,
//            show: function(e) {
//                if (!$("." + e.sender._guid)[1]) {
//                    var element = e.element.parent(),
//                        eWidth = element.width(),
//                        eHeight = element.height(),
//                        wWidth = $(window).width(),
//                        wHeight = $(window).height(),
//                        newTop,
//                        newLeft;
//
//                    newLeft = Math.floor(wWidth / 2 - eWidth / 2);
//                    newTop = Math.floor(wHeight / 2 - eHeight / 2);
//
//                    e.element.parent().css({ top: newTop, left: newLeft });
//                }
//            }
//        }).data("kendoNotification");
//
//        //#endregion
//
//        var service = new function () {
//            this.showTop = function(message) {
//                _topNotification.info({
//                    message: message
//                });
//            }
//            
//            this.screenNotification = _screenNotification;
//
//            this.showAlert = function(o) {
//                //#region [Validation]
//
//                o = getOrDefault(o, {});
//                o.title = getOrDefault(o.title, "Teen Idol");
//                o.body = getOrDefault(o.body, "");
//                o.buttons = getOrDefault(o.buttons, []);
//
//                //#endregion
//
//                // Xóa các event handler cũ
//                $("#modal-alert .modal-footer").off();
//
//                // Đặt title và body
//                $("#modal-alert .modal-title").html(o.title);
//                $("#modal-alert .modal-body").html(o.body);
//
//                // Đặt danh sách nút
//                if (o.buttons.length === 0)
//                    $("#modal-alert .modal-footer").addClass("hidden").html("");
//                else {
//                    // Chèn thẻ
//                    var html = "";
//                    $(o.buttons).each(function(i, x) {
//                        var className = getOrDefault(x.className, "btn-default");
//                        var type = getOrDefault(x.type, null);
//                        var text = getOrDefault(x.text, null);
//
//                        var buttonType = "";
//                        if (type === "close")
//                            buttonType = "data-dismiss='modal'";
//
//                        html += "<button class='alert-button-" + i + " btn " + className + "' " + buttonType + ">" + text + "</button>";
//                    });
//                    $("#modal-alert .modal-footer").html(html).removeClass("hidden");
//
//                    // Gán sự kiện
//                    $(o.buttons).each(function(i, x) {
//                        var onClick = getOrDefault(x.onClick, null);
//
//                        if (typeof onClick === "function")
//                            $("#modal-alert .modal-footer .alert-button-" + i).click(x.onClick);
//                    });
//                }
//
//                // Gọi modal
//                $("#modal-alert").modal("show");
//            };
//
//            this.showReload = function(text) {
//                text = getOrDefault(text, "Có lỗi, xin nhấn Ctrl+F5 hoặc nhận nút dưới để nạp lại trang");
//
//                service.showAlert({
//                    body: text,
//                    buttons: [
//                        {
//                            text: "Nạp lại",
//                            type: "close",
//                            onClick: function() {
//                                location.reload(true);
//                            },
//                        }
//                    ]
//                });
//            };
//        };
//        return service;
//    }
//]);
giasinhvienApp.factory("popoverService", [
    function () {
        var service = new function () {
            this.userMenu = {
                template: function() { return "/Layouts/Popover/UserMenu.html"; }
            };

            this.seatMenu = {
                template: function () { return "/Layouts/Popover/SeatMenu.html"; }
            };

            this.emoticon = {
                template: function () { return "/Layouts/Popover/Emoticon.html"; }
            };
        };
        return service;
    }
]);
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
giasinhvienApp.directive("guildInfo", [
      function () {
          return {
              replace: true,
              restrict: "E",
              templateUrl: "/Layouts/Template/GuildInfo.html",
              scope: {
                  showId: "@",
              },
              controllerAs: "$ctrl",
              controller: ["$scope", "modalService", "webService", "sessionService", "$rootScope", "Notification",
                  function ($scope, modalService, webService, sessionService, $rootScope, Notification) {
                      //#region [Field]

                      $scope.eventId = 1;

                      $scope.sessionService = sessionService;

                      if ($scope.eventId == 1) {
                          $scope.currNum = 0;
                          $scope.guildId = null;
                          $scope.currName = null;
                          $scope.listReward = null;
                          //Lấy thông tin gia tộc
                          webService.call({
                              name: "User_GetListGuildEvent",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize:1,
                                  getGuild: 1,
                                  startdate: 1490068800000,
                                  enddate: 1490760000000,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                              },

                              onSuccess: function (r) {
                                  if (r.Items[0].Guild.Id > 0) {
                                      $scope.guildId = r.Items[0].Guild.Id;
                                      $scope.currName = r.Items[0].Guild.Name;
                                      $scope.currNum = r.Items[0].Total;
                                      $scope.currphoto = r.Items[0].Guild.PhotoLink;
                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                                  if (r.Items[0].ListPoint) {
                                      $scope.listReward = r.Items[0].ListPoint;
                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                                  
                              },
                          });
                          $scope.$on("LoadThongTinGuild", function (event, data) {
                              webService.call({
                                  name: "User_GetListGuildEvent",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 1,
                                      getGuild: 1,
                                      startdate: 1490068800000,
                                      enddate: 1490760000000,
                                      key: sessionService.key()
                                  },

                                  onError: function (errorCode, message) {
                                  },

                                  onSuccess: function (r) {
                                      if (r.Items[0].Guild.Id > 0) {
                                          $scope.currNum = r.Items[0].Value;
                                          if (!$scope.$$phase) $scope.$apply();
                                      }
                                  },
                              });
                          });
                      }

                      $scope.RedirectRank = function () {
                          window.open(
                              'https://teenidol.vn/dang-cap-gia-toc',
                              '_blank'
                            );
                      }
                      //#endregion
                  }
              ]
          };
      }
]);
giasinhvienApp.directive("listGuildRank", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ListGuildRank.html",
            scope: {
                link: "@",
                linkNewTab: "@",
                avatar: "@",
                teamName:"@",
                name: "@",
                namePosition: "@",
                vipName: "@",
                vipPhoto: "@",
                vipColor: "@",
                levelName: "@",
                levelPhoto: "@",
                nextLevelPointNeed: "@",
                display: "@",
                coin: "=",
                indexValue:"=",
                onClick: "&"
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "helperService",
                function ($scope, helperService) {
                    //#region [Field]
                    $scope.helper = helperService;
                    
                    //#endregion

                    //#region [Event]

                    //#endregion
                }
            ]
        };
    }
]);
giasinhvienApp.directive("luckyWheel", [
      function () {
          return {
              replace: true,
              restrict: "E",
              templateUrl: "/Layouts/Template/LuckyWheel.html",
              scope: {
                  scheduleId: "@",
                  starId: "@",
              },
              controllerAs: "$ctrl",
              controller: ["$scope", "modalService", "webService", "sessionService", "$rootScope", "Notification", "$rootScope",
                  function ($scope, modalService, webService, sessionService, $rootScope, Notification, $rootScope) {
                      //#region [Field]

                      $scope.sessionService = sessionService;
                      $scope.resetButton = true;
                      //Lấy số lần quay
                      webService.call({
                          name: "User_GetNumberTurnRotation",
                          data: {
                              actionUserId: sessionService.userId(),
                              key: sessionService.key()
                          },

                          onError: function (errorCode, message) {
                          },

                          onSuccess: function (r) {
                              $scope.numberTurnRotation = r.Result;
                              $rootScope.$broadcast("User_GetNumberTurnRotation", {
                                  numberTurnRotation: $scope.numberTurnRotation,
                              });
                          },
                      });

                      $scope.theWheel = new Winwheel({
                          'drawMode': 'image',
                          'numSegments': 12,
                          'outerRadius': 170,
                          'pointerAngle': 0,
                          'textFontSize': 11,
                          'strokeStyle': 'white',
                          'textMargin': 10,
                          'lineWidth': 2,
                          'textLineWidth': 2,
                          'innerRadius': 40,
                          'textAlignment': 'inner',
                          'segments':
                          [
                              { 'fillStyle': '#14b9c5', 'text': 'Trang bị Thanh tước 7 ngày' },
                              { 'fillStyle': '#48b962', 'text': '500 Tim' },
                              { 'fillStyle': '#e0e439', 'text': 'Vip chí tôn 7 ngày' },
                              { 'fillStyle': '#f6ee2d', 'text': '50 nụ hôn' },
                              { 'fillStyle': '#faa52b', 'text': 'Tre non x5' },
                              { 'fillStyle': '#f36e39', 'text': 'Quà idol: răng long đầu bạc' },
                              { 'fillStyle': '#f05446', 'text': 'Vip tím 7 ngày' },
                              { 'fillStyle': '#ee3032', 'text': 'May mắn lần sau' },
                              { 'fillStyle': '#a24198', 'text': '10 nụ hôn' },
                              { 'fillStyle': '#7b489c', 'text': 'Quà idol: vợ người ta x1' },
                              { 'fillStyle': '#3e4a9f', 'text': 'Vip đỏ 7 ngày' },
                              { 'fillStyle': '#1988c7', 'text': 'bánh trung thu x1' },
                          ],
                          'animation':
                          {
                              'type': 'spinToStop',
                              'duration': 4,
                              'spins': 8,
                              'callbackFinished': 'alertPrize()',
                              'stopAngle': 245,

                          }
                      });
                      $scope.loadedImg = new Image();
                      $scope.loadedImg.onload = function () {
                          $scope.theWheel.wheelImage = $scope.loadedImg;
                          $scope.theWheel.draw();
                      }
                      $scope.loadedImg.src = "/Content/Image/Event-2017/Thang2/main.png";
                      $scope.wheelPower = 3;
                      $scope.wheelSpinning = false;
                      //#endregion

                      //#region [Event]             
                      $scope.powerSelected = function (powerLevel) {
                          if ($scope.wheelSpinning == false) {
                              $scope.wheelPower = powerLevel;
                          }
                      }
                      $scope.startSpin = function () {
                          if (!$scope.resetButton) {
                              Notification.error('Bạn cần hoàn thành vòng quay để tiếp tục');
                              return;
                          };
                          if ($scope.resetvongtron == true) {
                              $scope.theWheel.stopAnimation(false);
                              $scope.theWheel.rotationAngle = 0;
                              $scope.theWheel.draw();
                              $scope.wheelSpinning = false;

                          }
                          $scope.resetButton = false;
                          webService.call({
                              name: "User_StartTurnRotation",
                              type: "POST",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  starId: $scope.starId,
                                  scheduleId: $scope.scheduleId,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                                  if (!sessionService.isSigned()) {
                                      Notification.error('Bạn cần đăng nhập để thực hiện chức năng này.');
                                  } else {
                                      Notification.error(message);
                                  }
                                  //modalService.showUserRechargeCoin({});
                                  $scope.resetButton = true;
                              },
                              onSuccess: function (r) {
                                  $scope.idgift = r.Result.EventGiftRotation.Id;
                                  $scope.giftid = r.Result.EventLogTurnRotation.Id;
                                  console.log($scope.idgift);
                                  if ($scope.idgift == 15) {
                                      var a = 1;
                                  } else if ($scope.idgift == 16) {
                                      var a = 2;
                                  } else if ($scope.idgift == 17) {
                                      var a = 3;
                                  } else if ($scope.idgift == 18) {
                                      var a = 4;
                                  } else if ($scope.idgift == 19) {
                                      var a = 5;
                                  } else if ($scope.idgift == 20) {
                                      var a = 6;
                                  } else if ($scope.idgift == 21) {
                                      var a = 7;
                                  } else if ($scope.idgift == 22) {
                                      var a = 3;
                                  } else if ($scope.idgift == 23) {
                                      var a = 9;
                                  } else if ($scope.idgift == 24) {
                                      var a = 10;
                                  } else if ($scope.idgift == 25) {
                                      var a = 11;
                                  } else if ($scope.idgift == 26) {
                                      var a = 12;
                                  }
                                  else
                                      var a = 22;

                                  var b = 30 * a - 5;
                                  var c = b - 20;
                                  if (a == 1) {
                                      c = 5;
                                  }
                                  var d = b - c + 1;

                                  $scope.theWheel.animation.stopAngle = Math.floor((Math.random() * d) + c) + 180;

                                  if ($scope.wheelSpinning == false) {

                                      $scope.theWheel.startAnimation();

                                      $scope.wheelSpinning = true;
                                      webService.call({
                                          name: "User_GetNumberTurnRotation",
                                          data: {
                                              actionUserId: sessionService.userId(),
                                              key: sessionService.key()
                                          },

                                          onError: function (errorCode, message) {
                                              Notification.error(message);
                                          },

                                          onSuccess: function (r) {
                                              $scope.numberTurnRotation = r.Result;
                                              if (!$scope.$$phase) $scope.$apply();
                                              $rootScope.$broadcast("User_GetNumberTurnRotation", {
                                                  numberTurnRotation: $scope.numberTurnRotation,
                                              });
                                          },
                                      });
                                  }
                              },
                          });

                      }

                      $scope.resetWheel = function () {
                          if (!$scope.resetButton) {
                              Notification.error('Bạn cần hoàn thành vòng quay để tiếp tục');
                              return;
                          } else {
                              $scope.theWheel.stopAnimation(false);
                              $scope.theWheel.rotationAngle = 0;
                              $scope.theWheel.draw();

                              $scope.wheelSpinning = false;
                          }
                      }

                      $scope.alertPrize = function () {
                          $scope.resetButton = true;
                          $scope.resetvongtron = true;
                          webService.call({
                              name: "User_EndTurnRotation",
                              type: "POST",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  rotationLogId: $scope.giftid,
                                  starId: $scope.starId,
                                  scheduleId: $scope.scheduleId,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                                  Notification.error(message);
                                  Notification.error(errorCode);
                                  $scope.setNumberTurn = true;
                                  $scope.resetButton = true;
                              },
                              onSuccess: function (r) {
                                  if (r.Result.MessageGiftUser != null) {
                                      Notification({ message: r.Result.MessageGiftUser, title: 'Vòng quay may mắn', delay: 10000, positionX: "right", positionY: "bottom" });
                                  }
                              }
                          });

                          if ($scope.theWheel) {
                              //$scope.winningSegment = $scope.theWheel.getIndicatedSegment();
                              //Notification.success($scope.winningSegment.text);
                          }
                      }

                      $scope.custum = function () {
                          var ctx = $scope.theWheel.ctx;

                          ctx.strokeStyle = 'navy';
                          ctx.fillStyle = 'aqua';
                          ctx.lineWidth = 2;
                          ctx.beginPath();
                          ctx.moveTo(170, 5);
                          ctx.lineTo(230, 5);
                          ctx.lineTo(200, 40);
                          ctx.lineTo(171, 5);
                          ctx.stroke();
                          ctx.fill();
                      }

                      $scope.$watchCollection("missionIdol", function (missionIdol) {

                      });
                      //#endregion
                  }
              ]
          };
      }
]);
giasinhvienApp.directive("showGift", [
    function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                listGiftCategory: "=",
                scheduleId: "@",
                starId: "@",
            },
            templateUrl: "/Layouts/Template/ShowGift.html",
            controllerAs: "$ctrl",
            controller: [
                "$scope", "webService", "$rootScope", "sessionService", "helperService", "authenticationService", "Notification",
                function ($scope, webService, $rootScope, sessionService, helperService, authenticationService, Notification) {
                    //#region [Field]
                    $scope.helper = helperService;
                    $scope.freeCoinQuantity = undefined;
                    //#endregion

                    //#region [Callback]

                    $scope.onAfterSendGift = function (gift, coin) {
                        $scope.updateUserCoin(-coin);
                    };

                    $scope.onAfterSendFreeCoin = function (freeCoin) {
                        $scope.updateUserFreeCoin(-freeCoin);
                    };


                    $scope.updateUserCoin = function (amount) {
                        sessionService.data().user.User.Coin += amount;
                        if (!$scope.$$phase) $scope.$apply();
                    };

                    $scope.updateUserFreeCoin = function (amount) {
                        sessionService.data().user.User.TotalFreeCoin += amount;
                        $scope.$apply();
                    };
                    //#endregion

                    //#region [Event]

                    $scope.onSelectGiftItem = function ($event) {
                        var $target = $($event.target).closest(".gift-item");

                        if ($scope.selectedGift && $scope.selectedGift.id === $target.data("id"))
                            return;

                        $scope.selectedGift = $scope.listGiftCategory[$target.closest(".gift-category").data("index")].listGift[$target.data("index")];
                        $scope.selectedGift.selectedQuantity = $scope.selectedGift.listQuantity[0];
                    };

                    $scope.onSendGift = function ($event) {
                        var $target = $(($event.target).closest("button"));
                        if ($scope.helper.isLoading($target))
                            return;

                        if (!sessionService.isSigned()) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: "Bạn cần đăng nhập để sử dụng tính năng này"
                            });
                            return;
                        }

                        $target.button("loading");
                        (function (sendGift) {
                            webService.call({
                                type: "POST",
                                name: "User_GiveAwayGift",
                                data: {
                                    actionUserId: sessionService.userId(),
                                    giftId: sendGift.id,
                                    quantity: sendGift.selectedQuantity.quantity,
                                    scheduleId: $scope.scheduleId,
                                    starId: $scope.starId,
                                    isInEvent: false,
                                    key: sessionService.key()
                                },
                                displayError: true,
                                onError: function (errorCode, message) {
                                    $target.button("reset");
                                },
                                onSuccess: function (r) {
                                    $target.button("reset");
                                    $scope.onAfterSendGift({
                                        id: sendGift.id,
                                        name: sendGift.name,
                                        quantity: sendGift.selectedQuantity.quantity,
                                        photo: sendGift.selectedQuantity.photo,
                                        animation: sendGift.selectedQuantity.animation,
                                        type: sendGift.selectedQuantity.type,
                                        animationTime: sendGift.selectedQuantity.animationTime,
                                        animationWidth: sendGift.selectedQuantity.animationWidth,
                                        animationHeight: sendGift.selectedQuantity.animationHeight,
                                        photoGif: sendGift.selectedQuantity.photoGif,
                                        animationGifTime: sendGift.selectedQuantity.animationGifTime
                                    }, sendGift.price * sendGift.selectedQuantity.quantity);
                                }
                            });
                        })($scope.selectedGift);
                    };

                    $scope.onSendFreeCoin = function ($event) {
                        var $target = $(($event.target).closest("button"));
                        if ($scope.helper.isLoading($target) || $scope.helper.isDisabled($target))
                            return;

                        if (!sessionService.isSigned()) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: "Bạn cần đăng nhập để sử dụng tính năng này"
                            });
                            return;
                        }
                        if (!$scope.freeCoinQuantity) {
                            var freeCoinQuantity = 10;
                        } else {
                            var freeCoinQuantity = $scope.freeCoinQuantity;
                        }
                        //$target.button("loading");
                        webService.call({
                            type: "POST",
                            name: "User_GiveFreeCoin",
                            data: {
                                actionUserId: sessionService.userId(),
                                scheduleId: $scope.scheduleId,
                                starId: $scope.starId,
                                freeCoin: freeCoinQuantity,
                                key: sessionService.key()
                            },
                            displayError: true,
                            onError: function (errorCode, message) {
                                //$target.button("reset");
                            },
                            onSuccess: function (r) {
                                //$target.button("reset");
                                $scope.onAfterSendFreeCoin(freeCoinQuantity);
                            }
                        });
                    };

                    $scope.onUserRechargeCoin = function () {
                        $rootScope.$broadcast("onUserRechargeCoin");
                    }

                    $scope.setfreeCoinQuantity = function (number) {
                        $scope.freeCoinQuantity = number;
                        $(".give-free-coin").html('Tặng '+ number + ' <i class="free-coin-icon"></i>');
                    }
                    //#endregion

                }
            ]
        };
    }
]);
giasinhvienApp.directive("showItem", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ShowItem.html",
            scope: {
                link: "@",
                photo: "@",
                phone: "=",
                name: "@",
                levelName: "@",
                levelPhoto: "@",
                startTime: "=",
                isLive: "=",
                view: "=",
                issample: "=",
                persamper: "="
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "helperService",
                function ($scope, helperService) {
                    //#region [Field]

                    $scope.helper = helperService;
                   // $scope.moment = moment;
                    //#endregion

                    //#region [Event]
                    if ($scope.startTime) {
                        var now = new Date();
                        $scope.s = $scope.startTime - 7 * 60 * 60 * 1000;
                        $scope.startTime = new Date($scope.s);
                        if (now.getFullYear() === $scope.startTime.getFullYear() && now.getMonth() === $scope.startTime.getMonth() && now.getDate() === $scope.startTime.getDate()) {
                            $scope.startTimeType = "time";
                        } else {
                            $scope.startTimeType = "date";
                        }
                    }
                    //#endregion
                }
            ]
        };
    }
]);
giasinhvienApp.directive("showListUser", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ShowListUser.html",
            scope: {
                nextView: "=",
                scheduleId: "=",
                listUser: "=",
                listUserKick: "=",
                listUserAntiChat: "=",
                listUserSetMod: "=",
                decentralizationUser: "=",
                userCount: "=",
                facebookLiveViews: "=",
                onLoadKick: "&",
                onLoadAntiChat: "&",
                onLoadSetMod: "&",
                onNextListUserInShow: "&",
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "signalRService",
                function ($scope, signalrService) {

                    //#region [Helper]
                    var updateCount = function () {
                        if ($scope.scheduleId && $scope.listUser) {
                            signalrService.getShowCount([$scope.scheduleId], function (r) {
                                if (r && r[0].TotalUser) {
                                    $scope.userCount = r[0].TotalUser;
                                }
                                else if ($scope.listUser) {
                                    $scope.userCount = $scope.listUser.length;
                                }
                            }, function () {
                                if ($scope.listUser) {
                                    $scope.userCount = $scope.listUser.length;
                                }
                            });
                        } else if ($scope.listUser) {
                            $scope.userCount = $scope.listUser.length;
                        }
                    };
                    //#endregion

                    //#region [Field]

                    //$scope.popover = popoverService;

                    //#endregion

                    //#region [Event]

                    $scope.$watchCollection("listUser", function (value) {
                        $scope.vipCount = 0;
                        $(value).each(function (i, x) {
                            if (!x.VipItem) return;
                            $scope.vipCount += 1;
                        });
                        updateCount();
                    });

                    $scope.$watch("scheduleId", function (value) {
                        updateCount();
                    });

                    //                    $scope.onItemClick = function ($index) {
                    //                        popoverService.userMenu.scheduleId = $scope.scheduleId;
                    //                        popoverService.userMenu.userId = $scope.listUser[$index].User.Id;
                    //                    };
                    //
                    //                    $scope.onItemKickClick = function ($index) {
                    //                        popoverService.userMenu.scheduleId = $scope.scheduleId;
                    //                        popoverService.userMenu.userId = $scope.listUserKick[$index].User.Id;
                    //                    };
                    //
                    //                    $scope.onItemAntiChatClick = function ($index) {
                    //                        popoverService.userMenu.scheduleId = $scope.scheduleId;
                    //                        popoverService.userMenu.userId = $scope.listUserAntiChat[$index].User.Id;
                    //                    };

                    $scope.$watchCollection("listUserKick", function (value) {
                        $scope.userKickCount = 0;
                        if (value) {
                            $scope.userKickCount = value.length;
                        }
                    });

                    $scope.$watchCollection("listUserAntiChat", function (value) {
                        $scope.userAntiChatCount = 0;
                        if (value) {
                            $scope.userAntiChatCount = value.length;
                        }
                    });

                    $scope.$watchCollection("listUserSetMod", function (value) {
                        $scope.userSetModCount = 0;
                        if (value) {
                            $scope.userSetModCount = value.length;
                        }
                    });

                    $scope.$watchCollection("decentralizationUser", function (value) {
                        if (value) {
                            $scope.decentralizationUser = value;
                        }
                    });

                    //#endregion
                }
            ]
        };
    }
]);
giasinhvienApp.directive("showMessage", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ShowMessage.html",
            scope: {
                listSentGift: "=",
                scheduleId: "@",
                starId: "@",
                showId: "@",
                message: "=",
            },
            controllerAs: "$ctrl",
            controller: ["$rootScope","$scope", "helperService", "sessionService", "webService",
                function ($rootScope,$scope, helperService, sessionService, webService) {

                    //#region [Field]
                    $scope.sessionService = sessionService;
                    //event
                    $scope.$on("User_GetNumberTurnRotation", function (event, data) {
                        $scope.numberTurnRotation = data.numberTurnRotation;
                    });

                    $rootScope.$on("User_GetUserGranary", function (event, data) {
                        $scope.numberUnit = data.numberUnit;
                    });

                    var SetUcControl = null;

                    SetUcControl = setInterval(function () {
                        if (
                            $(".uc-private-message").data("$ucPrivateMessageController") == undefined) {
                            return;
                        } else {
                            $scope.privateMessageCtrl = $(".uc-private-message").data("$ucPrivateMessageController");
                            clearInterval(SetUcControl);
                        }
                    }, 100);

                    $scope.helper = helperService;
                    $scope.privateMessagePanelIsSelected = false;
                    $scope.privateMessagePanel = false;
                    //#endregion


                    $scope.onPrivateMessagePanelDeselect = function () {
                        $scope.privateMessagePanelIsSelected = false;
                    };

                    $scope.onPrivateMessagePanelSelect = function () {
                        $scope.privateMessagePanelIsSelected = true;
                        //#region [Load Private Message]
                        if ($scope.privateMessageCtrl && $scope.privateMessagePanel === false) {
                            //#region [Load Private Message]
                            $scope.privateMessageCtrl.load([$scope.starId]);
                            $scope.privateMessagePanel = true;
                            //#endregion
                        }
                        //#endregion
                    };

                    $scope.$on("dropdownUser_onSendPrivateMessage", function (event, data) {
                        $scope.privateMessagePanelIsSelected = true;
                        $scope.onPrivateMessagePanelSelect();
                        $scope.privateMessageCtrl.addTarget(data.userData.User.Id, data.userData.User.Name, data.userData.User.AvatarPhoto);
                        var $list = $(".list-target");
                        //                        $list.scrollLeft($list[''].scrollWidth);
                        $("#dropdown-user-info").jqDropdown("hide");
                    });

                    //#region [Event]

                    //#endregion
                }
            ]
        };
    }
]);
giasinhvienApp.directive("showSeat", [
    "helperService", function (helperService) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            templateUrl: "/Layouts/Template/ShowSeat.html",
            scope: {
                scheduleId: "=",
                listSeat: "=",
                onSeatSubmit: "&"
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "helperService", "popoverService",
                 function ($scope, helperService, popoverService) {
                     //#region [Field]
                     $scope.helper = helperService;
                     $scope.popover = popoverService;

                     //#endregion

                     //#region [Event]
                     $scope.onItemClick = function ($index) {
                         popoverService.seatMenu.scheduleId = $scope.scheduleId;
                         popoverService.seatMenu.index = $scope.listSeat.items[$index].index;
                         popoverService.seatMenu.userId = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.id : undefined;
                         popoverService.seatMenu.price = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.price : undefined;
                         popoverService.seatMenu.listPrice = $scope.listSeat.prices;
                         popoverService.seatMenu.onSubmit = $scope.onSeatSubmit;
                         popoverService.seatMenu.createDate = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.createDate : undefined;
                         popoverService.seatMenu.endDate = $scope.listSeat.items[$index].buyer ? $scope.listSeat.items[$index].buyer.endDate : undefined;
                     };

                     //#endregion
                 }
            ]
        };
    }
]);
giasinhvienApp.directive("showSentGift", [
       function () {
           return {
               replace: true,
               restrict: "E",
               templateUrl: "/Layouts/Template/ShowSentGift.html",
               scope: {
                   scheduleId: "=",
                   listGift: "="
               },
               controllerAs: "$ctrl",
               controller: ["$scope",
                   function ($scope) {
                       //#region [Field]

                       //#endregion

                       //#region [Event]

                       $scope.$watchCollection("listGift.items", function (value) {
                           if ($scope.listGift.items && $scope.listGift.maximunItem && $scope.listGift.items.length > $scope.listGift.maximunItem) {
                               $scope.listGift.items.splice($scope.listGift.maximunItem - 1, $scope.listGift.items.length - $scope.listGift.maximunItem);
                           }
                       });

                       //#endregion
                   }
               ]
           };
       }
]);
giasinhvienApp.directive("showStatus", [
      function () {
          return {
              replace: true,
              restrict: "E",
              templateUrl: "/Layouts/Template/ShowStatus.html",
              scope: {
                  showInfo: "=",
                  missionIdol: "=",
                  missionNoel: "=",
                  eventMissionIdol: "=",
                  statusCode: "@",
                  message: "=",
                  showId: "@",
                  starId: "@",
                  scheduleId: "@",
              },
              controllerAs: "$ctrl",
              controller: ["$scope", "modalService", "webService", "sessionService", "$rootScope", "Notification",
                  function ($scope, modalService, webService, sessionService, $rootScope, Notification) {
                      //#region [Field]
                      $scope.sessionService = sessionService;
                      $scope.Percent = 0;
                      $scope.CurrentHp = 0;
                      $scope.CurrentMiss = 0;

                      $scope.check = false;
                      if (sessionService.userId() == 5 || sessionService.userId() == 28) {
                          $scope.check = true;
                      }
                      //#endregion
                      //if (sessionService.userId() == 5 || sessionService.userId() == 28)
                      //    $scope.abcdef = true;
                      if ($scope.statusCode == 1) {
                          $scope.TypeMission = 0;
                          $scope.NumStarPoint = 0;
                          $scope.ListGiftInfo = [];
                          $scope.NameMission = "";
                          $scope.UserMission = undefined;
                          $scope.NameTypeMission = "";
                          $scope.TextSmsMission = "";
                          $scope.PopupSmsMissionOne = "";

                          $scope.PopupUserImage = undefined;
                          $scope.PopupIdolImage = undefined;
                          $scope.PopupIdolName = "";
                          //kiểm tra nhiệm vụ hiện tại của idol

                          webService.call({
                              name: "Star_GetInfoMission",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  starId: $scope.starId,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {
                                  if (rs.Result != null) {
                                      if (rs.Result.StateMission == 0) //chưa có nhiệm vụ
                                      {
                                          $scope.TypeMission = 0;
                                          $scope.NameTypeMission = "[CẦU HÔN]";
                                          if ($scope.starId == sessionService.userId()) { //là idol
                                              //load ds nhiệm vụ theo cấp thách cưới
                                              webService.call({
                                                  name: "Star_GetListIdolQuestMission",
                                                  data: {
                                                      actionUserId: sessionService.userId(),
                                                      pageIndex: 0,
                                                      pageSize: 5,
                                                      num_Type: 1,
                                                      key: sessionService.key(),
                                                  },
                                                  onSuccess: function (rrs) {
                                                      $scope.ListFirstMission = rrs.Items.slice(0, 3);
                                                      $scope.ListSecondMission = rrs.Items.slice(3, 5);
                                                      $("#modal-info-thang-4-1").show();
                                                  }
                                              });
                                          }
                                      }
                                      if (rs.Result.StateMission == 1) //có nhiệm vụ cấp 1
                                      {
                                          $scope.TypeMission = 1;
                                          $scope.NameTypeMission = "[THÁCH CƯỚI]";
                                          $scope.ListGiftInfo = rs.Result.GiftInfo;
                                          $scope.NameMission = rs.Result.questInfo.Name;
                                          $scope.UserMission = rs.Result.userInfo;
                                          $scope.NumStarPoint = rs.Result.IdolPoint;
                                      }
                                      if (rs.Result.StateMission == 2) //có nhiệm vụ cấp 2
                                      {
                                          $scope.TypeMission = 2;
                                          $scope.NameTypeMission = "[CẦU HÔN]";
                                          $scope.ListGiftInfo = rs.Result.GiftInfo;
                                          $scope.NameMission = rs.Result.questInfo.Name;
                                          $scope.TextSmsMission = rs.Result.InfoSms;
                                          $scope.UserMission = rs.Result.userInfo;
                                          $scope.NumStarPoint = rs.Result.IdolPoint;
                                      }
                                      if (rs.Result.StateMission == 3) {
                                          if ($scope.starId == sessionService.userId()) { //là idol
                                              $scope.PopupSmsMissionOne = rs.Result.Sms;
                                              $scope.UserMission = rs.Result.User;
                                              $scope.NumStarPoint = rs.Result.IdolPoint;
                                              $("#modal-info-thang-4-2").show();
                                          }
                                      }
                                  }
                                  if (!$scope.$$phase) $scope.$apply();
                              }
                          });

                          $scope.IdolAddNewQuest = (missionId) => {
                              webService.call({
                                  name: "User_StarAddIdolQuest",
                                  type: "POST",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      scheduleId: $scope.scheduleId,
                                      missionId: missionId,
                                      key: sessionService.key(),
                                  },
                                  onError: function (errorCode, message) {
                                      Notification.error(message);
                                  },
                                  onSuccess: function (rs) {
                                      $("#modal-info-thang-4-1").hide();
                                  }
                              });
                          };

                          $scope.onDeleteQuest = () => {
                              if (sessionService.isSigned()) {
                                  if (sessionService.data().user.GroupUser.Id == 2) {
                                      modalService.showAlert({
                                          title: "Xác nhận",
                                          message: "Bạn chắc chắn muốn hủy nhiệm vụ này chứ ?",
                                          buttons: [
                                              { text: "Không", style: "btn-default", closeModal: true },
                                              {
                                                  text: "Có",
                                                  style: "btn-primary",
                                                  closeModal: true,
                                                  onClick: function () {
                                                      $scope.onCallDeleteQuest();
                                                  }
                                              }
                                          ]
                                      });
                                  }
                                  else {
                                      Notification.error('Idol mới hủy được nhiệm vụ.');
                                  }
                              } else {
                                  Notification.error('Bạn cần đăng nhập để nhận nhiệm vụ.');
                              }
                          };

                          $scope.onCallDeleteQuest = () => {
                              var userId = 0;
                              if ($scope.UserMission != null && $scope.UserMission != undefined)
                                  userId = $scope.UserMission.Id;
                              webService.call({
                                  name: "User_CancelIdolQuest",
                                  type: "POST",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      scheduleId: $scope.scheduleId,
                                      userId: userId,
                                      key: sessionService.key(),
                                  },
                                  onError: function (errorCode, message) {
                                      Notification.error(message);
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.ErrorCode == null) {//hủy nhiệm vụ thành công
                                          $scope.TypeMission = 0;
                                          $scope.NameTypeMission = "[CẦU HÔN]";
                                          //load ds nhiệm vụ theo cấp thách cưới
                                          webService.call({
                                              name: "Star_GetListIdolQuestMission",
                                              data: {
                                                  actionUserId: sessionService.userId(),
                                                  pageIndex: 0,
                                                  pageSize: 5,
                                                  num_Type: 1,
                                                  key: sessionService.key(),
                                              },
                                              onSuccess: function (rrs) {
                                                  $scope.ListFirstMission = rrs.Items.slice(0, 3);
                                                  $scope.ListSecondMission = rrs.Items.slice(3, 5);
                                                  $("#modal-info-thang-4-1").show();
                                                  if (!$scope.$$phase) $scope.$apply();
                                              }
                                          });
                                      }
                                  }
                              });
                          }

                          $scope.onRefuseQuest = () => {
                              $("#modal-info-thang-4-2").hide();
                              $scope.onCallDeleteQuest();
                          };

                          $scope.onAcceptQuest = () => {
                              $("#modal-info-thang-4-2").hide();

                              webService.call({
                                  name: "User_StarCompleteQuest",
                                  type: "POST",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      scheduleId: $scope.scheduleId,
                                      key: sessionService.key(),
                                  },
                                  onError: function (errorCode, message) {
                                      Notification.error(message);
                                  },
                                  onSuccess: function (rs) {
                                      var userId = 0;
                                      if ($scope.UserMission != null && $scope.UserMission != undefined)
                                          userId = $scope.UserMission.Id;

                                      if ($scope.starId == sessionService.userId()) {//là idol
                                          //load ds nhiệm vụ theo cấp thách cưới
                                          //webService.call({
                                          //    name: "Star_GetListIdolQuestMission",
                                          //    data: {
                                          //        actionUserId: sessionService.userId(),
                                          //        pageIndex: 0,
                                          //        pageSize: 5,
                                          //        num_Type: 2,
                                          //        key: sessionService.key(),
                                          //    },
                                          //    onSuccess: function (rrs) {
                                          //        $scope.ListFirstMission = rrs.Items.slice(0, 3);
                                          //        $scope.ListSecondMission = rrs.Items.slice(3, 5);
                                          //        $("#modal-info-thang-4-1").show();
                                          //    }
                                          //});
                                      }
                                  }
                              });


                          };

                          $scope.onClosePopupKetHon = () => {
                              $("#modal-info-thang-4-3").hide();
                              if ($scope.starId == sessionService.userId()) {//là idol
                                  //load ds nhiệm vụ theo cấp thách cưới
                                  webService.call({
                                      name: "Star_GetListIdolQuestMission",
                                      data: {
                                          actionUserId: sessionService.userId(),
                                          pageIndex: 0,
                                          pageSize: 5,
                                          num_Type: 1,
                                          key: sessionService.key(),
                                      },
                                      onSuccess: function (rrs) {
                                          $scope.ListFirstMission = rrs.Items.slice(0, 3);
                                          $scope.ListSecondMission = rrs.Items.slice(3, 5);
                                          $("#modal-info-thang-4-1").show();
                                      }
                                  });
                              }
                          }

                          $scope.showGetMission = function () {
                              if (sessionService.isSigned()) {
                                  if (sessionService.data().user.GroupUser.Id == 2) {
                                      webService.call({
                                          name: "Star_GetListIdolQuestMission",
                                          data: {
                                              actionUserId: sessionService.userId(),
                                              pageIndex: 0,
                                              pageSize: 5,
                                              num_Type: 1,
                                              key: sessionService.key(),
                                          },
                                          onSuccess: function (rrs) {
                                              $scope.ListFirstMission = rrs.Items.slice(0, 3);
                                              $scope.ListSecondMission = rrs.Items.slice(3, 5);
                                              $("#modal-info-thang-4-1").show();
                                              if (!$scope.$$phase) $scope.$apply();
                                          }
                                      });
                                  }
                                  else {
                                      Notification.error('Idol mới được nhận nhiệm vụ.');
                                  }
                              } else {
                                  Notification.error('Bạn cần đăng nhập để nhận nhiệm vụ.');
                              }
                          }

                          $rootScope.$on("LoadIdolNhanNhiemVu", function (event, data) {
                              webService.call({
                                  name: "Star_GetInfoMission",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      starId: $scope.starId,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.Result != null) {
                                          if (rs.Result.StateMission == 1) //có nhiệm vụ cấp 1
                                          {
                                              $scope.TypeMission = 1;
                                              $scope.NameTypeMission = "[THÁCH CƯỚI]";
                                              $scope.ListGiftInfo = rs.Result.GiftInfo;
                                              $scope.NameMission = rs.Result.questInfo.Name;
                                              $scope.UserMission = rs.Result.userInfo;
                                              $scope.NumStarPoint = rs.Result.IdolPoint;
                                          }
                                          if (rs.Result.StateMission == 2) //có nhiệm vụ cấp 2
                                          {
                                              $scope.TypeMission = 2;
                                              $scope.NameTypeMission = "[CẦU HÔN]";
                                              $scope.ListGiftInfo = rs.Result.GiftInfo;
                                              $scope.NameMission = rs.Result.questInfo.Name;
                                              $scope.TextSmsMission = rs.Result.InfoSms;
                                              $scope.UserMission = rs.Result.userInfo;
                                              $scope.NumStarPoint = rs.Result.IdolPoint;
                                          }
                                      }
                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });

                          $rootScope.$on("LoadIdolCancelQuest", function (event, data) {
                              if ($scope.starId != sessionService.userId()) {//là user
                                  $scope.TypeMission = 0;
                                  $scope.NameTypeMission = "[CẦU HÔN]";
                              }
                          });

                          $rootScope.$on("LoadInfoQuestIdol", function (event, data) {
                              $scope.ListGiftInfo = data.data.GiftInfo;
                              if (!$scope.$$phase) $scope.$apply();
                          });

                          $rootScope.$on("LoadUserDoneMissionOne", function (event, data) {
                              if ($scope.starId == sessionService.userId()) { //là idol
                                  $scope.PopupSmsMissionOne = data.data.Sms;
                                  $scope.UserMission = data.data.User;
                                  $scope.NumStarPoint = data.data.IdolPoint;
                                  $("#modal-info-thang-4-2").show();
                              }
                          });

                          $rootScope.$on("LoadUserDoneMissionTwo", function (event, data) {
                              $scope.TypeMission = 0;
                              $scope.NameTypeMission = "[CẦU HÔN]";
                              $scope.UserMission = data.data.User;
                              $scope.PopupUserImage = data.data.User.AvatarPhoto;
                              $scope.PopupIdolImage = data.data.Idol.Photo;
                              $scope.NumStarPoint = data.data.IdolPoint;

                              //$("#modal-info-thang-4-3").show();
                          });

                          $rootScope.$on("LoadIdolAcceptQuest", function (event, data) {
                              webService.call({
                                  name: "Star_GetInfoMission",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      starId: $scope.starId,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.Result != null) {
                                          if (rs.Result.StateMission == 2) //có nhiệm vụ cấp 2
                                          {
                                              $scope.TypeMission = 2;
                                              $scope.NameTypeMission = "[CẦU HÔN]";
                                              $scope.ListGiftInfo = rs.Result.GiftInfo;
                                              $scope.NameMission = rs.Result.questInfo.Name;
                                              $scope.TextSmsMission = rs.Result.InfoSms;
                                              $scope.UserMission = rs.Result.userInfo;
                                              $scope.NumStarPoint = rs.Result.IdolPoint;
                                          }
                                      }
                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });
                      }

                      //#region [Event]
                      if ($scope.statusCode == 2) {
                          $rootScope.$on("User_GetTopUserGranary", function (event, data) {
                              $scope.IdolValue = data.IdolValue;
                          });

                          webService.call({
                              name: "User_GetTopUserGranary",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 1,
                                  userId: $scope.starId,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {
                                  if (rs.Items == null)
                                      $scope.IdolRank = 0;
                                  else {
                                      $scope.IdolRank = rs.Items[0].Rank;
                                      $scope.IdolValue = rs.Items[0].Total;
                                  }

                                  if (!$scope.$$phase) $scope.$apply();
                              }
                          });
                      }

                      if ($scope.statusCode == 3) {
                          $rootScope.$on("LoadDataIdol", function (event, data) {
                              webService.call({
                                  name: "User_GetTopUserGranary",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 1,
                                      type: 15,
                                      userId: $scope.starId,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.Items == null)
                                          $scope.ChocoValue = 0;
                                      else {
                                          $scope.ChocoValue = rs.Items[0].Total;
                                      }

                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });

                          webService.call({
                              name: "User_GetTopUserGranary",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 1,
                                  type: 15,
                                  userId: $scope.starId,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {
                                  if (rs.Items == null)
                                      $scope.ChocoValue = 0;
                                  else {
                                      $scope.ChocoValue = rs.Items[0].Total;
                                  }

                                  if (!$scope.$$phase) $scope.$apply();
                              }
                          });
                      }

                      if ($scope.statusCode == 4) {
                          $rootScope.$on("LoadHoaDo", function (event, data) {
                              webService.call({
                                  name: "Star_GetIdolInfoGiveAway",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 1,
                                      startdate: 1488772800000,
                                      enddate: 1488992399000,
                                      starId: $scope.starId,
                                      giftId: 1,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.Items == null)
                                          $scope.HoaDo = 0;
                                      else {
                                          $scope.HoaDo = rs.Items[0].Quanlity;
                                      }

                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });

                          webService.call({
                              name: "Star_GetIdolInfoGiveAway",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 1,
                                  startdate: 1488772800000,
                                  enddate: 1488992399000,
                                  starId: $scope.starId,
                                  giftId: 1,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {
                                  if (rs.Items == null)
                                      $scope.HoaDo = 0;
                                  else {
                                      $scope.HoaDo = rs.Items[0].Quanlity;
                                  }

                                  if (!$scope.$$phase) $scope.$apply();
                              }
                          });

                          $rootScope.$on("LoadHoaXanh", function (event, data) {
                              webService.call({
                                  name: "Star_GetIdolInfoGiveAway",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 1,
                                      startdate: 1488772800000,
                                      enddate: 1488992399000,
                                      starId: $scope.starId,
                                      giftId: 112,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.Items == null)
                                          $scope.HoaXanh = 0;
                                      else {
                                          $scope.HoaXanh = rs.Items[0].Quanlity;
                                      }

                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });

                          webService.call({
                              name: "Star_GetIdolInfoGiveAway",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 1,
                                  startdate: 1488772800000,
                                  enddate: 1488992399000,
                                  starId: $scope.starId,
                                  giftId: 112,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {
                                  if (rs.Items == null)
                                      $scope.HoaXanh = 0;
                                  else {
                                      $scope.HoaXanh = rs.Items[0].Quanlity;
                                  }

                                  if (!$scope.$$phase) $scope.$apply();
                              }
                          });

                          $rootScope.$on("LoadHoaHong", function (event, data) {
                              webService.call({
                                  name: "Star_GetIdolInfoGiveAway",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 1,
                                      startdate: 1488772800000,
                                      enddate: 1488992399000,
                                      starId: $scope.starId,
                                      giftId: 117,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.Items == null)
                                          $scope.HoaHong = 0;
                                      else {
                                          $scope.HoaHong = rs.Items[0].Quanlity;
                                      }

                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });

                          webService.call({
                              name: "Star_GetIdolInfoGiveAway",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 1,
                                  startdate: 1488772800000,
                                  enddate: 1488992399000,
                                  starId: $scope.starId,
                                  giftId: 117,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {
                                  if (rs.Items == null)
                                      $scope.HoaHong = 0;
                                  else {
                                      $scope.HoaHong = rs.Items[0].Quanlity;
                                  }

                                  if (!$scope.$$phase) $scope.$apply();
                              }
                          });
                      }

                      //Event 2017 tháng 3(mua ghe)
                      if ($scope.statusCode == 5) {
                          $rootScope.$on("LoadDataIdol", function (event, data) {
                              webService.call({
                                  name: "User_GetTopUserGranary",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 1,
                                      type: 16,
                                      userId: $scope.starId,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      if (rs.Items == null)
                                          $scope.ThinhUnitType = 0;
                                      else {
                                          $scope.ThinhUnitType = rs.Items[0].Total;
                                      }

                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });

                          webService.call({
                              name: "User_GetTopUserGranary",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 1,
                                  type: 16,
                                  userId: $scope.starId,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {
                                  if (rs.Items == null)
                                      $scope.ThinhUnitType = 0;
                                  else {
                                      $scope.ThinhUnitType = rs.Items[0].Total;
                                  }

                                  if (!$scope.$$phase) $scope.$apply();
                              }
                          });

                          $rootScope.$on("LoadCurrentDataIdol", function (event, data) {
                              webService.call({
                                  name: "User_GetCurrentGranaryValue",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      starId: $scope.starId,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      $scope.currentThinh = rs.Result;
                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          });

                          $scope.openListUserGiveCoin = () => {
                              $('#modal-event-thang-3').show();
                              webService.call({
                                  name: "User_GetListTopUserUseCoinInShow",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 10,
                                      scheduleId: $scope.scheduleId,
                                      showId: $scope.showId,
                                      starId: $scope.starId,
                                      startDate: -1,
                                      endDate: -1,
                                      key: sessionService.key()
                                  },
                                  onError: function (errorCode, message) {
                                      $scope.currentStatus = "error";
                                      $scope.currentError = message;
                                      $scope.$apply();
                                  },
                                  onSuccess: function (r) {
                                      $scope.listCurrent = r.Items;
                                      $scope.currentStatus = "loaded";
                                      $scope.$apply();
                                  }
                              });
                              webService.call({
                                  name: "User_GetCurrentGranaryValue",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      starId: $scope.starId,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {
                                      $scope.currentThinh = rs.Result;
                                      if (!$scope.$$phase) $scope.$apply();
                                  }
                              });
                          }

                          $scope.closeListUserGiveCoin = () => {
                              $('#modal-event-thang-3').hide();
                          }

                          $scope.onStarGiveGranary = (userId) => {
                              if (sessionService.userId() != $scope.starId) {
                                  Notification.error('Chức năng này chỉ dành riêng cho Idol.');
                              } else {
                                  webService.call({
                                      name: "User_IdolGiveGranaryUser",
                                      type: "POST",
                                      data: {
                                          actionUserId: sessionService.userId(),
                                          userId: userId,
                                          scheduleId: $scope.scheduleId,
                                          key: sessionService.key()
                                      },

                                      onError: function (errorCode, message) {
                                          if (!sessionService.isSigned()) {
                                              Notification.error('Bạn cần đăng nhập để thực hiện chức năng này.');
                                          } else {
                                              Notification.error(message);
                                          }
                                          $scope.resetButton = true;
                                      },

                                      onSuccess: function (r) {
                                          if (r.Result) {
                                              webService.call({
                                                  name: "User_GetCurrentGranaryValue",
                                                  data: {
                                                      actionUserId: sessionService.userId(),
                                                      starId: $scope.starId,
                                                      key: sessionService.key(),
                                                  },
                                                  onSuccess: function (rs) {
                                                      $scope.currentThinh = rs.Result;
                                                      if (!$scope.$$phase) $scope.$apply();
                                                  }
                                              });
                                          }
                                      },
                                  });
                              }

                          }
                      }

                      //Event 30/4
                      if ($scope.statusCode == 6) {
                          $scope.TypeMission = 0;
                          $scope.Mission = undefined;
                          $scope.IdolMission = undefined;

                          $scope.ReloadPopover = () => {
                              setTimeout(function () {
                                  $('.percent-level-process').popover({
                                      trigger: "hover",
                                      html: true,
                                      content: function () {
                                          return $(".popover-data").html();
                                      }
                                  });
                              }, 3000);

                          };

                          //$scope.SetColorBackGround = () => {
                          //    setTimeout(function () {
                          //        $('.had').css("background-color", "#ea0000");
                          //    }, 200);

                          //};

                          $scope.SetBackGround = (type) => {
                              setTimeout(function () {
                                  if (type == 1) {
                                      $(".mission30_4").css("background", "url('/Content/Image/Event-2017/Thang4/event2_sttbr1.png')");
                                  }
                                  if (type == 2) {
                                      $(".mission30_4").css("background", "url('/Content/Image/Event-2017/Thang4/event2_sttbr2.png')");
                                  }
                                  if (type == 3) {
                                      $(".mission30_4").css("background", "url('/Content/Image/Event-2017/Thang4/event2_sttbr3.png')");
                                  }
                              }, 1500);
                          };

                          webService.call({
                              name: "Star_GetInfoIdolMission",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  starId: $scope.starId,
                                  key: sessionService.key(),
                              },
                              onSuccess: function (rs) {

                                  $scope.TypeMission = rs.Result.MissionState;
                                  $scope.Mission = rs.Result.IdolMission;
                                  $scope.IdolMission = rs.Result.IdolMissionIdol;
                                  $scope.Percent = rs.Result.Percent;
                                  $scope.CurrentHp = rs.Result.IdolMissionIdol.CurrentHp;
                                  $scope.CurrentMiss = rs.Result.IdolMission.PercentMiss;

                                  $scope.SetBackGround(rs.Result.IdolMission.TypeMission);
                                  $scope.ReloadPopover();

                                  if (!$scope.$$phase) $scope.$apply();
                              }


                          });

                          $scope.ReloadMission = () => {
                              webService.call({
                                  name: "Star_GetInfoIdolMission",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      starId: $scope.starId,
                                      key: sessionService.key(),
                                  },
                                  onSuccess: function (rs) {

                                      $scope.TypeMission = rs.Result.MissionState;
                                      $scope.Mission = rs.Result.IdolMission;
                                      $scope.IdolMission = rs.Result.IdolMissionIdol;
                                      $scope.Percent = rs.Result.Percent;
                                      $scope.CurrentHp = rs.Result.IdolMissionIdol.CurrentHp;
                                      $scope.CurrentMiss = rs.Result.IdolMission.PercentMiss;

                                      
                                      $scope.SetBackGround(rs.Result.IdolMission.TypeMission);
                                      $scope.ReloadPopover();

                                      if (!$scope.$$phase) $scope.$apply();
                                  }

                              });
                          };

                          $scope.IdolGetMission = (type) => {
                              webService.call({
                                  name: "Star_AddIdolMission",
                                  type: "POST",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      scheduleId: $scope.scheduleId,
                                      type: type,
                                      key: sessionService.key(),
                                  },
                                  onError: function (errorCode, message) {
                                      Notification.error(message);
                                  },
                                  onSuccess: function (rs) {
                                      //$scope.ReloadMission();
                                  }
                              });
                          };

                          $scope.IdolDeleteMission = () => {
                              if (sessionService.isSigned()) {
                                  if (sessionService.data().user.GroupUser.Id == 2) {
                                      modalService.showAlert({
                                          title: "Xác nhận",
                                          message: "Rút lui! Mỗi ngày chỉ có thể rút lui được 1 lần Bạn có chắc chắn không??",
                                          buttons: [
                                              { text: "Không", style: "btn-default", closeModal: true },
                                              {
                                                  text: "Có",
                                                  style: "btn-primary",
                                                  closeModal: true,
                                                  onClick: function () {
                                                      webService.call({
                                                          name: "Star_DeleteIdolMission",
                                                          type: "POST",
                                                          data: {
                                                              actionUserId: sessionService.userId(),
                                                              scheduleId: $scope.scheduleId,
                                                              key: sessionService.key(),
                                                          },
                                                          onError: function (errorCode, message) {
                                                              Notification.error(message);
                                                          },
                                                          onSuccess: function (rs) {
                                                              $scope.ReloadMission();
                                                          }
                                                      });
                                                  }
                                              }
                                          ]
                                      });
                                  }
                                  else {
                                      Notification.error('Idol mới hủy được nhiệm vụ.');
                                  }
                              } else {
                                  Notification.error('Bạn cần đăng nhập để nhận nhiệm vụ.');
                              }
                          };

                          $rootScope.$on("LoadIdolLoadMission", function (event, data) {
                              console.log(data);
                              $scope.Percent = data.data.Percent;
                              if (data.data.isCrit == 1)
                                  $scope.ShowDamge(data.data.NumberMinus);
                              else
                                  $scope.ShowCrit(data.data.NumberMinus);
                              $scope.ReloadMission();
                          });

                          $rootScope.$on("LoadIdolDeleteMission", function (event, data) {
                              console.log(data);
                              $scope.Percent = data.data.Percent;
                              if (data.data.isCrit == 1)
                                  $scope.ShowCrit(data.data.NumberMinus);
                              else
                                  $scope.ShowDamge(data.data.NumberMinus);
                              $scope.ReloadMission();
                          });

                          $rootScope.$on("LoadIdolUpdateMission", function (event, data) {
                              $scope.Percent = data.data.Percent;
                              $scope.CurrentHp = data.data.IdolMissionIdol.CurrentHp;
                              //if ($scope.Percent < 30) {
                              //    $scope.SetColorBackGround();
                              //}
                              if (data.data.isCrit == 1)
                                  $scope.ShowCrit(data.data.NumberMinus);
                              else
                                  $scope.ShowDamge(data.data.NumberMinus);
                          });

                          $rootScope.$on("LoadIdolMissMission", function (event, data) {
                              $scope.ShowMiss();
                          });

                          $rootScope.$on("LoadIdolCritMission", function (event, data) {
                              $scope.Percent = data.data.Percent;
                              $scope.ShowCrit(data.data.NumberMinus);
                          });

                          $scope.ShowDamge = (damge) => {
                              var number = 1 + Math.floor(Math.random() * 1000000000000000);
                              var it;
                              it = "<div class='point' id='point-" + number + "'>"
                                  + "-" + damge
                                  + "</div>";
                              $(".point-list").append(it);
                              $("#point-" + number).hide();
                              $("#point-" + number).show();
                              setTimeout(function () {
                                  $("#point-" + number).remove();
                              }, 2000);
                          };

                          $scope.ShowCrit = (damge) => {
                              var number = 1 + Math.floor(Math.random() * 1000000000000000);
                              //var fx = 4;
                              var it;
                              it = "<div class='point' id='point-" + number + "'>"
                              + "<div class='div-item' >-" + damge + "</div>"
                              + "</div>";
                              $(".point-list").append(it);
                              $("#point-" + number).hide();
                              $("#point-" + number).show();
                              //$("." + number).css('font-size', fx + 'vw');
                              setTimeout(function () {
                                  $("#point-" + number).remove();
                              }, 2000);
                              //setInterval(function () {
                              //    $("." + number).css('font-size', fx + 'vw');
                              //    if (fx > 2) {
                              //        fx = fx - 0.05;
                              //    }
                              //    }
                              //    ,25);
                          };

                          $scope.ShowMiss = () => {
                              var number = 1 + Math.floor(Math.random() * 1000000000000000);
                              var it;
                              it = "<div class='point' id='point-" + number + "'>"
                                  + "<img style='width:50px' src='\Content/Image/Event-2017/Thang4/event2_sttmiss.png'>"
                                  + "</div>";
                              $(".point-list").append(it);
                              $("#point-" + number).hide();
                              $("#point-" + number).show();
                              setTimeout(function () {
                                  $("#point-" + number).remove();
                              }, 2000);
                          };

                      }

                      //Event tháng 7(nhiệm vụ Idol)
                      $scope.showIdolDoneMission = function () {
                          if (sessionService.isSigned()) {
                              modalService.showIdolDoneMission({
                                  starId: $scope.starId,
                                  scheduleId: $scope.scheduleId,
                              });

                          } else {
                              Notification.error('Bạn cần đăng nhập để nhận quà.');
                          }
                      }
                      $scope.showTakingMission = function () {
                          if (sessionService.isSigned()) {
                              if (sessionService.data().user.GroupUser.Id == 2) {
                                  modalService.showTakingMission({
                                      starId: $scope.starId,
                                      scheduleId: $scope.scheduleId,
                                  });
                              }
                              else {
                                  Notification.error('Idol mới được nhận nhiệm vụ.');
                              }
                          } else {
                              Notification.error('Bạn cần đăng nhập để nhận nhiệm vụ.');
                          }
                      }
                      $scope.onCancelIdolQuest = function () {
                          if (sessionService.isSigned()) {
                              if (sessionService.data().user.GroupUser.Id == 2) {
                                  modalService.showAlert({
                                      title: "Xác nhận",
                                      message: "Bạn chắc chắn muốn hủy nhiệm vụ này chứ ?",
                                      buttons: [
                                          { text: "Không", style: "btn-default", closeModal: true },
                                          {
                                              text: "Có",
                                              style: "btn-primary",
                                              closeModal: true,
                                              onClick: function () {
                                                  webService.call({
                                                      name: "User_CancelIdolQuest",
                                                      type: "POST",
                                                      data: {
                                                          actionUserId: sessionService.userId(),
                                                          scheduleId: $scope.scheduleId,
                                                          key: sessionService.key(),
                                                      },
                                                      onError: function (error, msg) {
                                                          Notification.error(error);
                                                      },
                                                      onSuccess: function (rs) {
                                                          // Notification.success('Hủy nhiệm vụ thành công');
                                                          //$rootScope.$broadcast("onDoneMissionIdol");
                                                      },
                                                  });
                                              }
                                          }
                                      ]
                                  });
                              }
                              else {
                                  Notification.error('Idol mới hủy được nhiệm vụ.');
                              }
                          } else {
                              Notification.error('Bạn cần đăng nhập để nhận nhiệm vụ.');
                          }
                      }

                      $scope.RedirectRank = function () {
                          window.open(
                              'https://teenidol.vn/dau-truong-giang-sinh',
                              '_blank'
                            );
                      }

                      //check event ghế tháng 10 - 4
                      //webService.call({
                      //    name: "Guild_GetTopIdolPointShowItem",
                      //    type: "get",
                      //    data: {
                      //        actionUserId: sessionService.userId(),
                      //        pageIndex: 0,
                      //        pageSize: 1,
                      //        starId: $scope.starId,
                      //        key: sessionService.key(),
                      //    },
                      //    onError: function (error, msg) {
                      //        Notification.error(error);
                      //    },
                      //    onSuccess: function (rs) {
                      //        $scope.eventMissionIdol = true;
                      //        $scope.InfoShowItem = rs.Items[0];
                      //        //$rootScope.$broadcast("onDoneMissionIdol");
                      //    },
                      //});

                      //Event tháng 8
                      $scope.$watchCollection("missionIdol", function (missionIdol) {
                          if (missionIdol && missionIdol.NextLimit) {
                              if (0 <= missionIdol.NextLimit.RewardDolar && missionIdol.NextLimit.RewardDolar < 100) {
                                  $scope.class = 'class';
                              } else if (100 <= missionIdol.NextLimit.RewardDolar && missionIdol.NextLimit.RewardDolar < 999) {
                                  $scope.class = 'class1';
                              } else if (999 <= missionIdol.NextLimit.RewardDolar && missionIdol.NextLimit.RewardDolar < 9999) {
                                  $scope.class = 'class2';
                              } else if (missionIdol.NextLimit.RewardDolar >= 9999) {
                                  $scope.class = 'class3';
                              }
                          }
                      });
                      //#endregion
                  }
              ]
          };
      }
]);
giasinhvienApp.directive("ucShowToolbar", [
    "helperService", function (helperService) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            templateUrl: "/Layouts/Template/ucShowToolbar.html",
            scope: {
                scheduleId: "@",
                showId: "@",
                starId: "@",
                hideDirection: "@",
                isMobile: "=",
                onHide: "&",
                onShowTabUser: "&",
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "sessionService", "modalService", "$rootScope", "helperService",
                function ($scope, sessionService, modalService, $rootScope, helperService) {
                    $scope.onShowRank = function() {
                        modalService.showShowRank({
                            data: {
                                scheduleId: $scope.scheduleId,
                                showId: $scope.showId,
                                starId: $scope.starId,
                            },
                        });
                    };
                    $scope.onShowOpening = function () {
                        modalService.showShowOpening({
                            data: {
                                scheduleId: '',
                                showId: '',
                                starId: '',
                            },
                        });
                    }
                    $scope.onShowSchedule = function() {
                        modalService.showShowSchedule({
                            data: {
                                starId: $scope.starId,
                            },
                        });
                    };
                }],
        };
    }
]);
giasinhvienApp.directive("ucShowUserInfo", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/ucShowUserInfo.html",
            scope: {
                isFullscreen: "=",
                onShowChanged: "&",
                starId:"@"
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "sessionService", "modalService", "$rootScope", "helperService",
                function ($scope, sessionService, modalService, $rootScope, helperService) {
                    //#region [Field]

                    $scope.sessionService = sessionService;
                    $scope.helper = helperService;
                    //#endregion

                    //#region [Event]

                    $scope.onLogin = function ($event) {
                        $rootScope.$broadcast("onLogin");
                    };

                    $scope.onLogout = function (event) {
                        $rootScope.$broadcast("onLogout");
                    }

                    $scope.onShowReport = function (starId) {
                        $('head').append('<script src="App_Lib/html2canvas-0.5.0-alpha1/html2canvas.min.js"></script>');
                        modalService.showReport({
                            data: {
                                starId: starId,
                            }
                        });
                    }

                    $scope.onUserMission = function () {
                        $rootScope.$broadcast("onUserMission");
                    }
                    $scope.onUserMission = function () {
                        $rootScope.$broadcast("onUserMission");
                    }
                    $scope.onUserDayCheck = function () {
                        $rootScope.$broadcast("onUserDayCheck");
                    }
                    //#endregion
                }
            ]
        };
    }
]);
giasinhvienApp.directive("unitChanged", [
      function () {
          return {
              replace: true,
              restrict: "E",
              templateUrl: "/Layouts/Template/UnitChanged.html",
              scope: {
                  scheduleId: "@",
                  starId: "@",
                  showId: "@",
                  message: "=",
              },
              controllerAs: "$ctrl",
              controller: ["$scope", "modalService", "webService", "sessionService", "$rootScope", "Notification",
                  function ($scope, modalService, webService, sessionService, $rootScope, Notification) {
                      //#region [Field]

                      $scope.eventId = 6;

                      $scope.sessionService = sessionService;

                      if ($scope.eventId == 3) {
                          $scope.resetButton = true;
                          $scope.nameMission = "";
                          $scope.failSms = "";
                          $scope.currNum = 0;
                          $scope.currId = null;
                          $scope.currName = null;
                          $scope.listReward = null;
                          //Lấy số lần quay
                          webService.call({
                              name: "User_GetUserGranary",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  typeId: 12,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                              },

                              onSuccess: function (r) {
                                  if (r.Result) {
                                      $scope.numberSuaTuoi = r.Result.Value;
                                  } else {
                                      $scope.numberSuaTuoi = 0;
                                  }
                              },
                          });
                          $scope.$on("LoadSoSuaTuoi", function (event, data) {
                              $scope.numberSuaTuoi = data.number;
                          });

                          webService.call({
                              name: "User_GetUserGranary",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  typeId: 13,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                              },

                              onSuccess: function (r) {
                                  if (r.Result) {
                                      $scope.numberCaCao = r.Result.Value;
                                  } else {
                                      $scope.numberCaCao = 0;
                                  }
                              },
                          });
                          $scope.$on("LoadSoCaCao", function (event, data) {
                              $scope.numberCaCao = data.number;
                          });

                          webService.call({
                              name: "User_GetUserGranary",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  typeId: 14,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                              },

                              onSuccess: function (r) {
                                  if (r.Result) {
                                      $scope.numberCo = r.Result.Value;
                                  } else {
                                      $scope.numberCo = 0;
                                  }
                              },
                          });
                          $scope.$on("LoadSoCo", function (event, data) {
                              $scope.numberCo = data.number;
                          });

                          $scope.$on("LoadThongTinUser", function (event, data) {
                              webService.call({
                                  name: "User_GetUserGranary",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      typeId: 12,
                                      key: sessionService.key()
                                  },

                                  onError: function (errorCode, message) {
                                  },

                                  onSuccess: function (r) {
                                      if (r.Result) {
                                          $scope.numberSuaTuoi = r.Result.Value;
                                      } else {
                                          $scope.numberSuaTuoi = 0;
                                      }
                                  },
                              });
                              webService.call({
                                  name: "User_GetUserGranary",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      typeId: 13,
                                      key: sessionService.key()
                                  },

                                  onError: function (errorCode, message) {
                                  },

                                  onSuccess: function (r) {
                                      if (r.Result) {
                                          $scope.numberCaCao = r.Result.Value;
                                      } else {
                                          $scope.numberCaCao = 0;
                                      }
                                  },
                              });
                              webService.call({
                                  name: "User_GetUserGranary",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      typeId: 14,
                                      key: sessionService.key()
                                  },

                                  onError: function (errorCode, message) {
                                  },

                                  onSuccess: function (r) {
                                      if (r.Result) {
                                          $scope.numberCo = r.Result.Value;
                                      } else {
                                          $scope.numberCo = 0;
                                      }
                                  },
                              });
                          });

                          //lấy danh sách mốc đổi quà
                          webService.call({
                              name: "User_GetGranaryInfo",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 7,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                              },

                              onSuccess: function (rs) {
                                  if (rs.Items) {
                                      $scope.ListFirstItems = rs.Items.slice(0, 4);
                                      $scope.ListSecondItems = rs.Items.slice(4, 7);
                                  } else {
                                      Notification.error("Không tìm thấy thông tin đổi quà!");
                                  }
                              },
                          });

                          //#region [Event]      

                          $scope.ViewGift = function (requireId, name) {
                              webService.call({
                                  name: "User_GetGranaryRewardInfo",
                                  type: "GET",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      requireId: requireId,
                                      key: sessionService.key()
                                  },

                                  onError: function (errorCode, message) {
                                  },
                                  onSuccess: function (r) {
                                      $('#modal-info-thang-1').show();
                                      $scope.nameMissionInfo = name;
                                      $scope.listRewardInfo = r.Result.reward;
                                  }
                              });
                          }

                          $scope.ChangeGift = function (requireId, name) {
                              if (!sessionService.isSigned()) {
                                  Notification.error('Bạn cần đăng nhập để thực hiện chức năng này.');
                              }
                              modalService.showAlert({
                                  title: "Xác nhận",
                                  message: "Bạn chắc chắn muốn đổi lấy gói quà " + name + " này không ?",
                                  buttons: [
                                      { text: "Không", style: "btn-primary", closeModal: true },
                                      {
                                          text: "Có",
                                          style: "btn-primary",
                                          closeModal: true,
                                          onClick: function () {
                                              webService.call({
                                                  name: "User_GetGranaryReward",
                                                  type: "POST",
                                                  data: {
                                                      actionUserId: sessionService.userId(),
                                                      requireId: requireId,
                                                      starId: $scope.starId,
                                                      scheduleId: $scope.scheduleId,
                                                      key: sessionService.key()
                                                  },

                                                  onError: function (errorCode, message) {
                                                      if (!sessionService.isSigned()) {
                                                          Notification.error('Bạn cần đăng nhập để thực hiện chức năng này.');
                                                      } else {
                                                          Notification.error(message);
                                                      }
                                                      $scope.resetButton = true;
                                                  },
                                                  onSuccess: function (r) {
                                                      $('#modal-event-thang-fail').hide();
                                                      if (r.Result) {
                                                          //hiển thị popup nhận quà
                                                          $scope.nameMission = name;
                                                          $scope.listReward = r.Result.reward;
                                                          $('#modal-event-thang-1').show();
                                                          //load lại thông tin User
                                                          webService.call({
                                                              name: "User_GetUserGranary",
                                                              data: {
                                                                  actionUserId: sessionService.userId(),
                                                                  typeId: 3,
                                                                  key: sessionService.key()
                                                              },

                                                              onError: function (errorCode, message) {
                                                              },

                                                              onSuccess: function (r) {
                                                                  if (r.Result) {
                                                                      $scope.numberGauNep = r.Result.Value;
                                                                  } else {
                                                                      $scope.numberGauNep = 0;
                                                                  }
                                                              },
                                                          });
                                                          webService.call({
                                                              name: "User_GetUserGranary",
                                                              data: {
                                                                  actionUserId: sessionService.userId(),
                                                                  typeId: 4,
                                                                  key: sessionService.key()
                                                              },

                                                              onError: function (errorCode, message) {
                                                              },

                                                              onSuccess: function (r) {
                                                                  if (r.Result) {
                                                                      $scope.numberDauXanh = r.Result.Value;
                                                                  } else {
                                                                      $scope.numberDauXanh = 0;
                                                                  }
                                                              },
                                                          });
                                                          webService.call({
                                                              name: "User_GetUserGranary",
                                                              data: {
                                                                  actionUserId: sessionService.userId(),
                                                                  typeId: 5,
                                                                  key: sessionService.key()
                                                              },

                                                              onError: function (errorCode, message) {
                                                              },

                                                              onSuccess: function (r) {
                                                                  if (r.Result) {
                                                                      $scope.numberThitMo = r.Result.Value;
                                                                  } else {
                                                                      $scope.numberThitMo = 0;
                                                                  }
                                                              },
                                                          });
                                                          webService.call({
                                                              name: "User_GetUserGranary",
                                                              data: {
                                                                  actionUserId: sessionService.userId(),
                                                                  typeId: 6,
                                                                  key: sessionService.key()
                                                              },

                                                              onError: function (errorCode, message) {
                                                              },

                                                              onSuccess: function (r) {
                                                                  if (r.Result) {
                                                                      $scope.numberLaDong = r.Result.Value;
                                                                  } else {
                                                                      $scope.numberLaDong = 0;
                                                                  }
                                                              },
                                                          });
                                                          webService.call({
                                                              name: "User_GetUserGranary",
                                                              data: {
                                                                  actionUserId: sessionService.userId(),
                                                                  typeId: 7,
                                                                  key: sessionService.key()
                                                              },

                                                              onError: function (errorCode, message) {
                                                              },

                                                              onSuccess: function (r) {
                                                                  if (r.Result) {
                                                                      $scope.numberLaChuoi = r.Result.Value;
                                                                  } else {
                                                                      $scope.numberLaChuoi = 0;
                                                                  }
                                                              },
                                                          });
                                                          //load info idol
                                                          webService.call({
                                                              name: "User_GetTopUserGranary",
                                                              data: {
                                                                  actionUserId: sessionService.userId(),
                                                                  pageIndex: 0,
                                                                  pageSize: 1,
                                                                  userId: $scope.starId,
                                                                  key: sessionService.key(),
                                                              },
                                                              onSuccess: function (rs) {
                                                                  if (rs.Items == null)
                                                                      $scope.IdolRank = 0;
                                                                  else {
                                                                      $scope.IdolRank = rs.Items[0].Rank;
                                                                      $scope.IdolValue = rs.Items[0].Total;
                                                                  }
                                                                  $rootScope.$broadcast("User_GetTopUserGranary", {
                                                                      IdolValue: $scope.IdolValue,
                                                                  });
                                                              }
                                                          });
                                                      } else {
                                                          Notification.error(r.Message);
                                                      }
                                                  },
                                              });
                                          }
                                      }
                                  ]
                              });


                          }

                          $scope.ChangeGift2 = function (requireId, name) {
                              $('#modal-event-thang-fail').hide();
                              if (!sessionService.isSigned()) {
                                  Notification.error('Bạn cần đăng nhập để thực hiện chức năng này.');
                              }
                              webService.call({
                                  name: "User_GetGranaryReward",
                                  type: "POST",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      requireId: requireId,
                                      starId: $scope.starId,
                                      scheduleId: $scope.scheduleId,
                                      key: sessionService.key()
                                  },

                                  onError: function (errorCode, message) {
                                      if (!sessionService.isSigned()) {
                                          Notification.error('Bạn cần đăng nhập để thực hiện chức năng này.');
                                      } else {
                                          Notification.error(message);
                                      }
                                      $scope.resetButton = true;
                                  },
                                  onSuccess: function (r) {

                                      if (r.Result) {
                                          //hiển thị popup nhận quà
                                          $scope.nameMission = name;
                                          $scope.listReward = r.Result.reward;
                                          $('#modal-event-thang-1').show();
                                          //load lại thông tin User
                                          webService.call({
                                              name: "User_GetUserGranary",
                                              data: {
                                                  actionUserId: sessionService.userId(),
                                                  typeId: 3,
                                                  key: sessionService.key()
                                              },

                                              onError: function (errorCode, message) {
                                              },

                                              onSuccess: function (r) {
                                                  if (r.Result) {
                                                      $scope.numberGauNep = r.Result.Value;
                                                  } else {
                                                      $scope.numberGauNep = 0;
                                                  }
                                              },
                                          });
                                          webService.call({
                                              name: "User_GetUserGranary",
                                              data: {
                                                  actionUserId: sessionService.userId(),
                                                  typeId: 4,
                                                  key: sessionService.key()
                                              },

                                              onError: function (errorCode, message) {
                                              },

                                              onSuccess: function (r) {
                                                  if (r.Result) {
                                                      $scope.numberDauXanh = r.Result.Value;
                                                  } else {
                                                      $scope.numberDauXanh = 0;
                                                  }
                                              },
                                          });
                                          webService.call({
                                              name: "User_GetUserGranary",
                                              data: {
                                                  actionUserId: sessionService.userId(),
                                                  typeId: 5,
                                                  key: sessionService.key()
                                              },

                                              onError: function (errorCode, message) {
                                              },

                                              onSuccess: function (r) {
                                                  if (r.Result) {
                                                      $scope.numberThitMo = r.Result.Value;
                                                  } else {
                                                      $scope.numberThitMo = 0;
                                                  }
                                              },
                                          });
                                          webService.call({
                                              name: "User_GetUserGranary",
                                              data: {
                                                  actionUserId: sessionService.userId(),
                                                  typeId: 6,
                                                  key: sessionService.key()
                                              },

                                              onError: function (errorCode, message) {
                                              },

                                              onSuccess: function (r) {
                                                  if (r.Result) {
                                                      $scope.numberLaDong = r.Result.Value;
                                                  } else {
                                                      $scope.numberLaDong = 0;
                                                  }
                                              },
                                          });
                                          webService.call({
                                              name: "User_GetUserGranary",
                                              data: {
                                                  actionUserId: sessionService.userId(),
                                                  typeId: 7,
                                                  key: sessionService.key()
                                              },

                                              onError: function (errorCode, message) {
                                              },

                                              onSuccess: function (r) {
                                                  if (r.Result) {
                                                      $scope.numberLaChuoi = r.Result.Value;
                                                  } else {
                                                      $scope.numberLaChuoi = 0;
                                                  }
                                              },
                                          });
                                          //load info idol
                                          webService.call({
                                              name: "User_GetTopUserGranary",
                                              data: {
                                                  actionUserId: sessionService.userId(),
                                                  pageIndex: 0,
                                                  pageSize: 1,
                                                  userId: $scope.starId,
                                                  key: sessionService.key(),
                                              },
                                              onSuccess: function (rs) {
                                                  if (rs.Items == null)
                                                      $scope.IdolRank = 0;
                                                  else {
                                                      $scope.IdolRank = rs.Items[0].Rank;
                                                      $scope.IdolValue = rs.Items[0].Total;
                                                  }
                                                  $rootScope.$broadcast("User_GetTopUserGranary", {
                                                      IdolValue: $scope.IdolValue,
                                                  });
                                              }
                                          });
                                      } else {
                                          Notification.error(r.Message);
                                      }
                                  },
                              });
                          }

                          $scope.closeModal = () => {
                              $('#modal-event-thang-1').hide();
                          }

                          $scope.closeModalInfo = () => {
                              $('#modal-info-thang-1').hide();
                          }

                          $scope.showModalFail = (id, name, listRequire) => {
                              for (var i = 0; i < listRequire.length; i++) {
                                  console.log(listRequire[i].UnitType.Id);
                                  if (listRequire[i].UnitType.Id == 14) {
                                      $scope.currNum = listRequire[i].RequireData.Value;
                                  }
                              }

                              $scope.currId = id;
                              $scope.currName = name;
                              $scope.failSms = "Bạn cần " + $scope.currNum + " Cỏ Bốn Lá để hoàn thành gói " + name;
                              $('#modal-event-thang-fail').show();
                          }

                          $scope.closeModalFail = () => {
                              $('#modal-event-thang-fail').hide();
                          }

                          //#endregion
                      }

                      if ($scope.eventId == 5) {
                          //load danh sach bo ghe
                          webService.call({
                              name: "User_GetListCollection",
                              data: {
                                  actionUserId: sessionService.userId(),
                                  pageIndex: 0,
                                  pageSize: 5,
                                  showId: $scope.showId,
                                  key: sessionService.key()
                              },

                              onError: function (errorCode, message) {
                              },

                              onSuccess: function (rs) {
                                  if (rs.Items) {
                                      $scope.ListCollection = rs.Items;
                                  } else {
                                      Notification.error("Không tìm thấy thông tin bộ ghế!");
                                  }
                              },
                          });

                          $scope.$on("LoadSoSuaTuoi", function (event, data) {
                              webService.call({
                                  name: "User_GetListCollection",
                                  data: {
                                      actionUserId: sessionService.userId(),
                                      pageIndex: 0,
                                      pageSize: 5,
                                      key: sessionService.key()
                                  },

                                  onError: function (errorCode, message) {
                                  },

                                  onSuccess: function (rs) {
                                      if (rs.Items) {
                                          $scope.ListCollection = rs.Items;
                                      } else {
                                          Notification.error("Không tìm thấy thông tin bộ ghế!");
                                      }
                                  },
                              });
                          });
                      }




                      $scope.showInfo = function (eee) {
                          $(".info-" + eee).show();
                          $(".icon-" + eee).hide();
                      };
                      $scope.hideInfo = function (eee) {
                          $(".info-" + eee).hide();
                          $(".icon-" + eee).show();
                      };


                  }
              ]
          };
      }
]);
giasinhvienApp.directive("userListItem", [
    function () {
        return {
            replace: true,
            restrict: "E",
            templateUrl: "/Layouts/Template/UserListItem.html",
            scope: {
                link: "@",
                linkNewTab: "=",
                userId:"@",
                avatar: "@",
                name: "@",
                vipName: "@",
                vipPhoto: "@",
                vipColor: "@",
                levelName: "@",
                levelPhoto: "@",
                nextLevelPointNeed:"@",
                display: "@",
                nameGuild: "@",
                iconGuild: "@",
                groupId: "@",
                isfollowIdol: "=",
                coin: "=",
                freeCoin: "=",
                onClick: "&"
            },
            controllerAs: "$ctrl",
            controller: ["$scope", "helperService",
                function ($scope, helperService) {
                    //#region [Field]
                    $scope.helper = helperService;
                    //#endregion

                    //#region [Event]

                    //#endregion
                }
            ]
        };
    }
]);
giasinhvienApp.directive("ucFollowButton", [
    function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                status: "@",
                targetUserId: "@"
            },
            templateUrl: "/Views/UserControl/ucFollowButton.html",
            controllerAs: "$ctrl",
            controller: ["$scope", "webService", "sessionService", "authenticationService", "Notification",
                function ($scope, webService, sessionService, authenticationService, Notification) {
                    $scope.showIt = function () {
                        $(event.target).closest('.uc-follow-button.followed .fa').addClass('fa-remove');
                        $(event.target).closest('.uc-follow-button.followed').removeClass('followed');
                    };
                    // mouseleave event
                    $scope.hideIt = function () {
                        $(event.target).closest('.uc-follow-button .fa-check').removeClass('fa-remove');
                        $(event.target).closest('.uc-follow-button').addClass('followed');
                    };
                    $scope.Follow = function (event) {
                        if ($(event).hasClass("loading"))
                            return;

                        if (!sessionService.isSigned()) {
                            authenticationService.showModal({
                                mode: "sign-in",
                                message: "Bạn cần đăng nhập để sử dụng tính năng này"
                            });
                            return;
                        }

                        $(event).addClass("loading");
                        webService.call({
                            type: "POST",
                            name: "User_FollowUser",
                            data: {
                                currentUserId: sessionService.userId(),
                                followUserId: $scope.targetUserId,
                                isFollow: $scope.status != 1,
                                key: sessionService.key()
                            },
                            displayError: true,
                            onError: function () {
                                $(event).removeClass("loading");
                            },
                            onSuccess: function (r) {
                                $(event).removeClass("loading");

                                if ($scope.status != 1) {
                                    Notification.success("Đã theo dõi");
                                    $scope.status = 1;

                                } else {
                                    Notification.success("Đã hủy theo dõi");
                                    $scope.status = 0;
                                }

                                showController.onUpdateEventNoel();
                                //webService.call({
                                //    name: "Star_GetInfoMissionNoel",
                                //    type: "get",
                                //    data: {
                                //        actionUserId: sessionService.userId(),
                                //        pageIndex: 0,
                                //        pageSize: 1,
                                //        startDate: 1482724800000,
                                //        endDate: 1483203600000,
                                //        starId: $scope.targetUserId,
                                //        key: sessionService.key(),
                                //    },
                                //    onError: function (error, msg) {
                                //        Notification.error(error);
                                //    },
                                //    onSuccess: function (rs) {
                                //        $scope.InfoEventNoel = {
                                //            eventNoel: rs.IsStarEvent,
                                //            InfoEventNoel: rs
                                //        }
                                //        //$rootScope.$broadcast("onDoneMissionIdol");
                                //    },
                                //});
                                if (!$scope.$$phase) $scope.$apply();
                            }
                        });
                    };
                }],
            link: function(scope, element, attrs) {}
        };
    }
]);
giasinhvienApp.directive("ucMenuUser", ["$routeParams", function ($routeParams) {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            id: "@",
            active: "@",
        },
        template:
              "<ul class='uc-menu-user left-panel'>" +
            "<li ng:class=\"{true: \'active\', false: \' \'}[active == 1]\">" +
                "<a href='/user/{{userId}}'>" +
                    "<i class='fa fa-user'></i>" +
                    "Thông tin cá nhân" +
                "</a>" +
            "</li>" +
            "<li ng-if='id == userId' ng:class=\"{true: \'active\', false: \' \'}[active == 2]\">" +
                "<a href='/user/{{userId}}/inbox'>" +
                    "<i class='fa fa-envelope'></i>" +
                    "Hộp thư" +
                "</a>" +
            "</li>" +
            "<li ng:class=\"{true: \'active\', false: \' \'}[active == 3]\">" +
                "<a href='/user/{{userId}}/follow'>" +
                    "<i class='fa fa-users'></i>" +
                    "Danh sách theo dõi" +
                "</a>" +
            "</li>" +
            "<li ng-if='id == userId' ng:class=\"{true: \'active\', false: \' \'}[active == 4]\">" +
                "<a href='/user/{{userId}}/modroom'>" +
                    "<i class='fa fa-tv'></i>" +
                    "Quản lý phòng" +
                "</a>" +
            "</li>" +
            "<li ng:class=\"{true: \'active\', false: \' \'}[active == 5]\">" +
                "<a href='/user/{{userId}}/inventory'>" +
                   "<i class='fa fa-money'></i>" +
                    "Trang bị" +
                "</a>" +
            "</li>" +
            "<li ng-if='id == userId' ng:class=\"{true: \'active\', false: \' \'}[active == 6]\">" +
                "<a href='/user/{{userId}}/coinLog'>" +
                    "<i class='fa fa-clock-o'></i>" +
                    "Lịch sử thu-chi" +
                "</a>" +
            "</li>" +
            "<li  ng:class=\"{true: \'active\', false: \' \'}[active == 7]\">" +
                "<a href='/user/{{userId}}/reward'>" +
                    "<i class='fa fa-gift'></i>" +
                    "Phần thưởng" +
                "</a>" +
            "</li>" +
        "</ul>",
        link: function (scope, element, attrs) {
            if (!scope.id) scope.id = scope.id;
            if (!scope.active) scope.active = scope.leftpanel;
            scope.userId = $routeParams.id;
        }
    }
}]);
giasinhvienApp.directive("ucPrivateMessage", [
    "webService", "sessionService", "helperService", "Notification", "authenticationService", "signalRService", function (webService, sessionService, helperService, Notification, authenticationService, signalRService) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;
            $scope.hub = signalRService.hub();

            $scope.status = "loading";
            $scope.error = undefined;
            $scope.listStatus = "loading";
            $scope.listError = undefined;
            $scope.listTopTargetId = undefined;
            $scope.listTopTarget = [];
            $scope.listTarget = [];
            $scope.listMessage = [];
            $scope.autoScroll = true;
            $scope.targetUserId = undefined;
            $scope.messageGroupId = undefined;
            $scope.messagePageIndex = undefined;
            $scope.messagePageCount = undefined;

            //#endregion

            //#region [Method]

            this.load = function (listTopTargetId) {
                $scope.numberOfConversation = getOrDefault($scope.numberOfConversation, 4);
                $scope.listTopTargetId = listTopTargetId;
                $scope._ctrl.refresh();

                $scope.$watch("targetUserId", $scope.onTargetSelected);
            };

            this.refresh = function () {

                if (!sessionService.isSigned()) {
                    $scope.status = "warning";
                    $scope.error = "Bạn cần đăng nhập";
                } else {
                    $scope.hub.invoke("ConnectMessenger", $scope.hub.connection.id, sessionService.userId()).done(function (hubResult) {
                        webService.call({
                            name: "User_GetListUserByListID",
                            data: {
                                actionUserId: sessionService.userId(),
                                listID: $scope.listTopTargetId.join(),
                                pageIndex: 0,
                                pageSize: 999999,
                                key: sessionService.key()
                            },

                            onError: function (errorCode, message) {
                                $scope.status = "error";
                                $scope.error = message;
                                $scope.$apply();
                            },

                            onSuccess: function (r) {
                                $scope.listTopTarget = [];
                                $(r.Items).each(function (i, x) {
                                    if (x.User.Id === sessionService.data().user.User.Id) {
                                        return;
                                    }

                                    $scope.listTopTarget.push({
                                        id: x.User.Id,
                                        name: x.User.Name,
                                        avatar: x.User.AvatarPhoto,
                                        unreadMessage: 0
                                    });
                                });

                                if (!$scope.targetUserId && $scope.listTopTarget[0]) {
                                    $scope.targetUserId = $scope.listTopTarget[0].id;
                                }

                                $scope.status = "loaded";
                                $scope.$apply();
                            }
                        });

                        webService.call({
                            name: "User_GetListUserMessageGroup",
                            data: {
                                actionUserId: sessionService.userId(),
                                userId: sessionService.userId(),
                                pageIndex: 0,
                                pageSize: $scope.numberOfConversation,
                                rejectUserId: $scope.starId,
                                scheduleId: -1,
                                key: sessionService.key()
                            },

                            onError: function (errorCode, message) {
                                $scope.status = "error";
                                $scope.error = message;
                                $scope.$apply();
                            },

                            onSuccess: function (r) {

                                $scope.listTarget = [];
                                $(r.Items).each(function (i, x) {
                                    var target;
                                    if (x.FromUser.Id !== sessionService.userId()) {
                                        target = x.FromUser;
                                    } else {
                                        target = x.ToUser;
                                    }

                                    if (target.Id === sessionService.data().user.User.Id) {
                                        return;
                                    }

                                    $scope.listTarget.push({
                                        id: target.Id,
                                        name: target.Name,
                                        avatar: target.AvatarPhoto,
                                        unreadMessage: 0
                                    });
                                });

                                if (!$scope.targetUserId && $scope.listTarget[0]) {
                                    $scope.targetUserId = $scope.listTarget[0].id;
                                }

                                $scope.status = "loaded";
                                $scope.$apply();
                            }
                        });
                    });
                }
            };

            this.scrollToBottom = function () {
                var $list = $element.find(".list-message");
                $list.scrollTop($list[0].scrollHeight);
            };

            this.addTarget = function (userId, name, avatar) {
                var index = -1;

                $($scope.listTopTarget).each(function (i, x) {
                    if (x.id === userId) {
                        index = i;
                        return false;
                    }
                });

                if (index === -1) {
                    $($scope.listTarget).each(function (i, x) {
                        if (x.id === userId) {
                            index = i;
                            return false;
                        }
                    });
                }

                if (index === -1) {
                    $scope.listTarget.splice(0, 0, {
                        id: userId,
                        name: name,
                        avatar: avatar,
                        unreadMessage: 0
                    });
                }

                $scope.targetUserId = userId;
            };

            this.addMessage = function (message, date, user) {
                message = helperService.formatMessage(message);

                $scope.listMessage.push({
                    message: message,
                    date: date,
                    user: user
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            //#endregion

            //#region [Event]

            $scope.$on("signalrOnPrivateMessage", function (event, user, message) {
                if (user.id !== $scope.targetUserId) {
                    var done = false;

                    $($scope.listTopTarget).each(function (i, x) {
                        if (x.id === user.id) {
                            x.unreadMessage += 1;
                            done = true;
                            return false;
                        }
                    });

                    if (!done) {
                        $($scope.listTarget).each(function (i, x) {
                            if (x.id === user.id) {
                                x.unreadMessage += 1;
                                return false;
                            }
                        });
                    }

                    return;
                }

                $scope._ctrl.addMessage(
                    message.content,
                    message.date,
                    {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    });
                if (typeof $scope._ctrl.onNewMessage === "function")
                    $scope._ctrl.onNewMessage(user.id);
            });

            $scope.onTextKeyPress = function ($event) {
                if ($event.keyCode === 13 && $event.shiftKey === false) {
                    $event.preventDefault();
                    $scope.onSendMessage({
                        target: $($event.target).closest("form")
                    });
                }
            };

            $scope.onTargetSelect = function (id) {
                $scope.targetUserId = id;

                var done = false;

                $($scope.listTopTarget).each(function (i, x) {
                    if (x.id === id) {
                        x.unreadMessage = 0;
                        done = true;
                        return false;
                    }
                });

                if (!done) {
                    $($scope.listTarget).each(function (i, x) {
                        if (x.id === id) {
                            x.unreadMessage = 0;
                            return false;
                        }
                    });
                }
            };

            $scope.onTargetSelected = function (newValue, oldValue) {
                if (!newValue) {
                    $scope.listStatus = "warning";
                    $scope.listError = "Bạn chưa chọn đối tượng để trò chuyện";
                } else {
                    $scope.listStatus = "loading";
                    webService.call({
                        name: "User_GetUserMessageGroupByUserId",
                        data: {
                            actionUserId: sessionService.userId(),
                            userId: $scope.targetUserId,
                            key: sessionService.key()
                        },

                        onError: function (errorCode, message) {
                            $scope.listStatus = "error";
                            $scope.listError = message;
                            $scope.$apply();
                        },

                        onSuccess: function (gr) {
                            $scope.messagePageIndex = 0;
                            $scope.messagePageCount = 0;
                            $scope.messageGroupId = gr.Result ? gr.Result.Id : undefined;
                            $scope.listMessage = [];

                            if ($scope.messageGroupId) {
                                webService.call({
                                    name: "User_GetListMessage",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        userGroupMessageId: $scope.messageGroupId,
                                        pageIndex: $scope.messagePageIndex,
                                        pageSize: 10,
                                        key: sessionService.key()
                                    },

                                    onError: function (errorCode, message) {
                                        $scope.listStatus = "error";
                                        $scope.listError = message;
                                        $scope.$apply();
                                    },

                                    onSuccess: function (r) {
                                        $scope.messagePageCount = r.PageCount;
                                        $scope.listMessage = [];
                                        if (r.Items.length >= 0) {
                                            for (var i = r.Items.length - 1; i >= 0; i--) {
                                                var x = r.Items[i];

                                                $scope._ctrl.addMessage(
                                                    x.Message.Content,
                                                    x.Message.CreateDate,
                                                    {
                                                        id: x.User.Id,
                                                        name: x.User.Name,
                                                        avatar: x.User.AvatarPhoto
                                                    });
                                            }
                                        }

                                        $scope.listStatus = "loaded";
                                        $scope.$apply();

                                        $scope._ctrl.scrollToBottom();
                                    }
                                });
                            } else {
                                $scope.listStatus = "loaded";
                                $scope.$apply();
                            }
                        }
                    });
                }
            };

            $scope.onSendMessage = function ($event) {
                var $target = $($event.target);
                var $button = $target.find("[type=submit]");

                if ($scope.helper.isLoading($button))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                if (!$scope.targetUserId) {
                    Notification.warning({ message: 'Bạn chưa chọn đối tượng để trò chuyện !', delay: 3000, positionY: 'bottom', positionX: 'right' });
                    return;
                }
                if (!$target.find("textarea.message-text").val()) {
                    Notification.warning({ message: 'Bạn chưa nhập tin nhắn !', delay: 3000, positionY: 'bottom', positionX: 'right' });
                    return;
                }
                webService.call({
                    type: "POST",
                    name: "User_SentMessage",
                    data: {
                        actionUserId: sessionService.userId(),
                        toUserId: $scope.targetUserId,
                        content: $element.find("textarea.message-text").val(),
                        key: sessionService.key()
                    },

                    displayError: true,

                    onSuccess: function (r) {
                        $element.find("textarea.message-text").val("");
                        $scope._ctrl.addMessage(
                            r.Result.Content,
                            r.Result.CreateDate,
                            {
                                id: sessionService.data().user.User.Id,
                                name: sessionService.data().user.User.Name,
                                avatar: sessionService.data().user.User.AvatarPhoto
                            });
                    }
                });
            };

            $scope.onLoadMore = function ($event) {
                $scope.messagePageIndex += 1;

                webService.call({
                    name: "User_GetListMessage",
                    data: {
                        actionUserId: sessionService.userId(),
                        userGroupMessageId: $scope.messageGroupId,
                        pageIndex: $scope.messagePageIndex,
                        pageSize: 10,
                        key: sessionService.key()
                    },

                    onError: function (errorCode, message) {
                        $scope.listStatus = "error";
                        $scope.listError = message;
                        $scope.$apply();
                    },

                    onSuccess: function (r) {
                        for (var i = r.Items.length - 1; i >= 0; i--) {
                            var x = r.Items[i];

                            $scope.listMessage.unshift({
                                message: helperService.formatMessage(x.Message.Content),
                                date: x.Message.CreateDate,
                                user: {
                                    id: x.User.Id,
                                    name: x.User.Name,
                                    avatar: x.User.AvatarPhoto
                                }
                            });
                        }
                        $scope.$apply();
                    }
                });
            };

            //#endregion

            // #region [Callback]

            // onNewMessage(userId)

            // #endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: {
                numberOfConversation: "@"
            },
            templateUrl: "/Views/UserControl/ucPrivateMessage.html",
            controller: controller
        };
    }
]);
giasinhvienApp.directive("ucShopCatelogyItem", [
    "helperService", "sessionService", "webService", "authenticationService", "Notification","modalService",
    function (helperService, sessionService, webService, authenticationService, Notification,modalService) {
        var controller = function ($scope, $element) {
            $scope._ctrl = this;

            $scope.BuyItems = function (event) {

                var itemId = $(event.target).closest("button").data("id");

                var purchaseId = $('select[name=listPrice-' + itemId + ']').val();

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }
                modalService.showAlert({
                    title: "Xác nhận",
                    message: "Bạn chắc chắn muốn mua vật phẩm này chứ?",
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
                                webService.call({
                                    type: "POST",
                                    name: "User_BuyItems",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        itemId: itemId,
                                        purchaseId: purchaseId,
                                        isVipItem: false,
                                        key: sessionService.key()
                                    },
                                    //displayError: true,
                                    onError: function (errorCode, message) {
                                        Notification.error(message);
                                    },
                                    onSuccess: function (r) {
                                        Notification.success("Mua Vật Phẩm " + r.Result.Name + "  Thành Công !");
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            }
            $scope.BuyItemsGuild = function (event) {
                var itemId = $(event.target).closest("button").data("id");

                var purchaseId = $('select[name=listPrice-' + itemId + ']').val();

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }
                modalService.showAlert({
                    title: "Xác nhận",
                    message: "Bạn chắc chắn muốn mua vật phẩm này chứ?",
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
                                webService.call({
                                    type: "POST",
                                    name: "User_BuyItemsForGuild",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        itemId: itemId,
                                        purchaseId: purchaseId,
                                        isVipItem: false,
                                        guildId: sessionService.data().user.Guild.Id,
                                        key: sessionService.key()
                                    },
                                    //displayError: true,
                                    onError: function (errorCode, message) {
                                        Notification.error(message);
                                    },
                                    onSuccess: function (r) {
                                        Notification.success("Mua Vật Phẩm " + r.Result.Name + "  Thành Công !");
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            }
        }
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            controller: controller,
            scope: {
                id: "@",
                buy: "@",
                isbuy: "@",
                avatar: "@",
                name: "@",
                listPrice: "@",
                catelogyModel: "="
            },
            templateUrl: "/Views/UserControl/ucShopCatelogyItem.html",
            link: function (scope, element, attrs) {
                console.log(scope);
                if (scope.catelogyModel) {
                    if (!scope.id) scope.id = scope.catelogyModel.AnimationItem.Id;
                    if (!scope.avatar) scope.avatar = scope.catelogyModel.AnimationItem.PhotoLink;
                    if (!scope.name) scope.name = scope.catelogyModel.AnimationItem.Name;
                    if (!scope.listPrice) scope.listPrice = scope.catelogyModel.ListItemPurchase;
                }
            }
        };
    }
]);
giasinhvienApp.directive("ucShopVipItem", [
    "helperService", "sessionService", "webService", "authenticationService", "Notification", "modalService",
    function (helperService, sessionService, webService, authenticationService, Notification, modalService) {
        var controller = function ($scope, $element) {
            $scope._ctrl = this;

            $scope.BuyItems = function (event) {
                var itemId = $(event.target).closest("button").data("id");
                var purchaseId = $('select[name=listPricevip-' + itemId + ']').val();
                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }
                modalService.showAlert({
                    title: "Xác nhận",
                    message: "Bạn chắc chắn muốn mua vật phẩm này chứ?",
                    buttons: [
                    {
                        text: "Không", style: "btn-default", closeModal: true
                    },
                        {
                            text: "Có",
                            style: "btn-default",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "User_BuyItems",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        itemId: itemId,
                                        purchaseId: purchaseId,
                                        isVipItem: true,
                                        key: sessionService.key()
                                    },
                                    //displayError: true,
                                    onError: function (errorCode, message) {
                                        Notification.error(message);
                                    },
                                    onSuccess: function (r) {
                                        Notification.success("Mua Vật Phẩm " + r.Result.Name + " Thành Công !");
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            }
            $scope.hoverIn = function () {
                $(event.target).closest(".vip-item .info.pull-right").trigger("click");
            };

            $scope.hoverOut = function () {
                $scope.hoverEdit = false;
            };
        }
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            controller: controller,
            scope: {
                id: "@",
                avatar: "@",
                name: "@",
                listPrice: "@",
                ListFeatures: "@",
                vipModel: "="
            },
            templateUrl: "/Views/UserControl/ucShopVipItem.html",
            link: function (scope, element, attrs) {
                if (scope.vipModel) {
                    if (!scope.id) scope.id = scope.vipModel.VipItem.Id;
                    if (!scope.avatar) scope.avatar = scope.vipModel.VipItem.StorePhoto;
                    if (!scope.name) scope.name = scope.vipModel.VipItem.Name;
                    if (!scope.listPrice) scope.listPrice = scope.vipModel.ListPurchases;
                    if (!scope.ListFeatures) scope.ListFeatures = scope.vipModel.ListFeatures;
                }
                scope.Description = "";
                $(scope.ListFeatures).each(function (j, x) {
                    scope.Description += x.Description + "<br />- ";
                });
            }
        };
    }
]);
giasinhvienApp.directive("ucShowAction", [
    "webService", "sessionService", "helperService", "formService", "authenticationService", "notificationService", function (webService, sessionService, helperService, formService, authenticationService, notificationService) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;

            $scope.starId = undefined;
            $scope.scheduleId = undefined;
            $scope.newActionName = undefined;
            $scope.newActionCoin = 100;

            $scope.starActionStatus = "loading";
            $scope.starActionError = undefined;
            $scope.listStarAction = [];

            $scope.userActionStatus = "loading";
            $scope.userActionError = undefined;
            $scope.listUserAction = [];

            //#endregion

            //#region [Method]

            this.loadStarAction = function (starId, scheduleId) {
                $scope.starId = starId;
                $scope.scheduleId = scheduleId;
                $scope._ctrl.refreshStarAction();
            };

            this.refreshStarAction = function () {
                webService.call({
                    name: "Show_GetListRepertoireOfStar",
                    data: {
                        actionUserId: sessionService.userId(),
                        starId: $scope.starId,
                        pageIndex: 0,
                        pageSize: 999999,
                        key: sessionService.key()
                    },

                    onError: function (errorCode, message) {
                        $scope.starActionStatus = "error";
                        $scope.starActionError = message;
                        $scope.$apply();
                    },

                    onSuccess: function (r) {
                        $scope.listStarAction = r.Items;
                        $scope.starActionStatus = "loaded";
                        $scope.$apply();
                    }
                });
            };

            this.addStarAction = function (id, name, coin, totalVote) {
                $scope.listUserAction.push({
                    Repertoire: {
                        Id: id,
                        Name: name,
                        Price: coin,
                        TotalVote: totalVote
                    }
                });
                $scope.$apply();
            };

            this.loadUserAction = function (starId, scheduleId) {
                $scope.scheduleId = scheduleId;
                $scope._ctrl.refreshUserAction();
            };

            this.refreshUserAction = function () {
                webService.call({
                    name: "Show_GetListWishList",
                    data: {
                        actionUserId: sessionService.userId(),
                        scheduleId: $scope.scheduleId,
                        pageIndex: 0,
                        pageSize: 999999,
                        minPrice: 0,
                        key: sessionService.key()
                    },

                    onError: function (errorCode, message) {
                        $scope.userActionStatus = "error";
                        $scope.userActionError = message;
                        $scope.$apply();
                    },

                    onSuccess: function (r) {
                        $scope.listUserAction = r.Items;
                        $scope.userActionStatus = "loaded";
                        $scope.$apply();
                    }
                });
            };

            this.addUserAction = function (id, name, coin, userId, userName) {
                $scope.listUserAction.push({
                    WishList: {
                        Id: id,
                        Content: name,
                        CurrentPrice: coin
                    },
                    FromUserId: {
                        Id: userId,
                        Name: userName
                    }
                });
                $scope.$apply();
            };

            //#endregion

            //#region [Callback]

            // onAfterVoteStarAction(starAction)

            // onAfterCheckStarAction(starAction)

            // onAfterDeleteStarAction(starAction)
            
            // onAfterCheckUserAction(userAction)

            // onAfterPostUserAction(userAction)

            //#endregion

            //#region [Event]

            $scope.onVoteStarAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".star-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItem = $scope.listStarAction[$actionItem.data("index")];

                $target.button("loading");
                webService.call({
                    type: "POST",
                    name: "Repertoire_Vote",
                    data: {
                        actionUserId: sessionService.userId(),
                        repertoiseId: actionItem.Repertoire.Id,
                        scheduleId: $scope.scheduleId,
                        key: sessionService.key()
                    },
                    displayError: true,
                    onError: function (errorCode, message) {
                        $target.button("reset");
                    },
                    onSuccess: function (r) {
                        $target.button("reset");
                        actionItem.Repertoire.TotalVote = r.Result.TotalVote;
                        $scope.$apply();

                        if (typeof $scope._ctrl.onAfterVoteStarAction === "function")
                            $scope._ctrl.onAfterVoteStarAction({
                                id: r.Result.Id,
                                name: r.Result.Name,
                                coin: r.Result.Price,
                                voteTotal: r.Result.TotalVote
                            });
                    }
                });
            };

            $scope.onCheckStarAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".star-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItem = $scope.listStarAction[$actionItem.data("index")];

                notificationService.showAlert({
                    title: "Hoàn thành tiết mục",
                    body: "Bạn đã hoàn tất tiết mục?",
                    buttons: [
                        { text: "Không", type: "close" },
                        {
                            text: "Có",
                            type: "close",
                            onClick: function () {
                                $target.button("loading");
                                webService.call({
                                    type: "POST",
                                    name: "Star_ResetVote",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        repertoiseId: actionItem.Repertoire.Id,
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onError: function (errorCode, message) {
                                        $target.button("reset");
                                    },
                                    onSuccess: function (r) {
                                        $target.button("reset");
                                        actionItem.Repertoire.TotalVote = r.Result.TotalVote;
                                        $scope.$apply();

                                        if (typeof $scope._ctrl.onAfterVoteStarAction === "function")
                                            $scope._ctrl.onAfterResetStarAction({
                                                id: r.Result.Id,
                                                name: r.Result.Name,
                                                coin: r.Result.Price,
                                                voteTotal: r.Result.TotalVote
                                            });
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onDeleteStarAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".star-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItemIndex = $actionItem.data("index");
                var actionItem = $scope.listStarAction[actionItemIndex];

                notificationService.showAlert({
                    title: "Xóa yêu cầu",
                    body: "Bạn muốn xóa tiết mục này",
                    buttons: [
                        { text: "Không", type: "close" },
                        {
                            text: "Có",
                            type: "close",
                            onClick: function () {
                                $target.button("loading");
                                webService.call({
                                    type: "POST",
                                    name: "Star_DeleteRepertorise",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        repertoiseId: actionItem.Repertoire.Id,
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onError: function (errorCode, message) {
                                        $target.button("reset");
                                    },
                                    onSuccess: function (r) {
                                        $target.button("reset");
                                        $scope.listStarAction.splice(actionItemIndex, 1);
                                        $scope.$apply();

                                        if (typeof $scope._ctrl.onAfterDeleteStarAction === "function")
                                            $scope._ctrl.onAfterDeleteStarAction({
                                                id: r.Result.Id,
                                                name: r.Result.Name,
                                                coin: r.Result.Price,
                                                voteTotal: r.Result.TotalVote
                                            });
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onCheckUserAction = function ($event) {
                var $target = $(($event.target).closest("button"));
                var $actionItem = $(($event.target).closest(".user-action-item"));

                if (formService.isLoading($target))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                var actionItemIndex = $actionItem.data("index");
                var actionItem = $scope.listUserAction[actionItemIndex];

                notificationService.showAlert({
                    title: "Hoàn thành yêu cầu",
                    body: "Bạn đã hoàn thành yêu cầu này?",
                    buttons: [
                        { text: "Không", type: "close" },
                        {
                            text: "Có",
                            type: "close",
                            onClick: function () {
                                $target.button("loading");
                                webService.call({
                                    type: "POST",
                                    name: "Star_DeleteRepertorise",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        repertoiseId: actionItem.Repertoire.Id,
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onError: function (errorCode, message) {
                                        $target.button("reset");
                                    },
                                    onSuccess: function (r) {
                                        $target.button("reset");
                                        $scope.listUserAction.splice(actionItemIndex, 1);
                                        $scope.$apply();

                                        if (typeof $scope._ctrl.onAfterCheckUserAction === "function")
                                            $scope._ctrl.onAfterCheckUserAction({
                                                id: r.Result.WishList.Id,
                                                name: r.Result.WishList.Content,
                                                coin: r.Result.WishList.CurrentPrice,
                                                userId: r.Result.FromUserId.Id,
                                                userName: r.Result.FromUserId.Name
                                            });
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onPostNewAction = function ($event) {
                var $target = $($event.target);
                var $button = $target.find("[type=submit]");

                if (formService.isLoading($button))
                    return;

                $scope.newActionCoin = $scope.newActionCoin * 1;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                if (!formService.validate(
                        {
                    target: $button,
                    rule: [
                                {
                    check: function () {
                                        return isNoUoW($scope.newActionName) === false;
                },
                    message: "Bạn chưa nhập tên tiết mục."
                }
                ]
                }
                    )
                ) {
                    return;
                };

                $button.button("loading");
                webService.call({
                    type: "POST",
                    name: "User_UserRequestWishList",
                    data: {
                        actionUserId: sessionService.userId(),
                        scheduleId: $scope.scheduleId,
                        starId: $scope.starId,
                        coin: $scope.newActionCoin,
                        content: $scope.newActionName,
                        isNewVersion: true,
                        key: sessionService.key()
                    },
                    displayError: true,
                    onError: function (errorCode, message) {
                        $button.button("reset");
                    },
                    onSuccess: function (r) {
                        $button.button("reset");
                        $scope.newActionName = undefined;
                        $scope.newActionCoin = 100;
                        $scope.$apply();

                        if (!sessionService.isSigned() || sessionService.userId() !== $scope.starId) {
                            $scope._ctrl.addUserAction(r.Result.WishList.Id, r.Result.WishList.Content, r.Result.WishList.CurrentPrice, r.Result.FromUserId.Id, r.Result.FromUserId.Name);
                            if (typeof $scope._ctrl.onAfterPostUserAction === "function")
                                $scope._ctrl.onAfterPostUserAction({
                                    id: r.Result.WishList.Id,
                                    name: r.Result.WishList.Content,
                                    coin: r.Result.WishList.CurrentPrice,
                                    userId: r.Result.FromUserId.Id,
                                    userName: r.Result.FromUserId.Name
                                });
                        } else {
                            $scope._ctrl.addStarAction(0,0,0,0);
                            if (typeof $scope._ctrl.onAfterPostStarAction === "function")
                                $scope._ctrl.onAfterPostStarAction({
                                    id: 0,
                                    name: 0,
                                    coin: 0,
                                    totalVote: 0
                                });
                        }
                    }
                });
            };

            //#endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "/Views/UserControl/ucShowAction.html",
            controller: controller
        };
    }
]);
giasinhvienApp.directive("ucShowControl", [
    "helperService", "sessionService", "webService", "modalService", "Notification",
    function (helperService, sessionService, webService, modalService, Notification) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;
            $scope.status = "loading";
            $scope.showId = undefined;
            $scope.showStatus = undefined;
            $scope.showName = undefined;
            $scope.showDescription = undefined;
            $scope.showPhoto = undefined;

            //#endregion

            //#region [Method]

            this.load = function (showId, showStatus, showName, showDescription, showPhoto) {
                $scope.showId = showId;
                $scope.showStatus = showStatus;
                $scope.showName = showName;
                $scope.showDescription = showDescription;
                $scope.showPhoto = showPhoto;
                $(".image-cropper").cropit({ imageBackground: true });
                $scope.status = "loaded";
                $scope.$apply();
            };

            //#endregion

            //#region [Event]

            $scope.onStartShow = function ($event) {
                modalService.showAlert({
                    title: "Bắt đầu diễn",
                    message: "Bạn đã sẵn sàng để diễn?",
                    buttons: [
                        { text: "Không", style: "btn-default", closeModal: true, },
                        {
                            text: "Có",
                            style: "primary",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "Show_StartShow",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onSuccess: function (r) {
                                        $scope.showStatus = 2;
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onStopShow = function ($event) {
                modalService.showAlert({
                    title: "Bắt đầu diễn",
                    message: "Bạn muốn kết thúc show diễn?",
                    buttons: [
                        { text: "Không", style: "btn-default", closeModal: true },
                        {
                            text: "Có",
                            style: "btn-primary",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "Show_EndShow",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onSuccess: function (r) {
                                        $scope.showStatus = 3;
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onPauseShow = function ($event) {
                modalService.showAlert({
                    title: "Bắt đầu diễn",
                    message: "Bạn muốn tạm ngưng diễn?",
                    buttons: [
                        { text: "Không", style: "default", closeModal: true },
                        {
                            text: "Có",
                            style: "primary",
                            closeModal: true,
                            onClick: function () {
                                webService.call({
                                    type: "POST",
                                    name: "Show_PauseShow",
                                    data: {
                                        actionUserId: sessionService.userId(),
                                        scheduleId: $scope.scheduleId,
                                        key: sessionService.key()
                                    },
                                    displayError: true,
                                    onSuccess: function (r) {
                                        $scope.showStatus = 1;
                                        $scope.$apply();
                                    }
                                });
                            }
                        }
                    ]
                });
            };

            $scope.onUploadImage = function ($event) {
                $element.find(".image-cropper .cropit-image-input.hidden").trigger("click");
            };

            $scope.onEditShow = function ($event) {

                var $target = $($event.target);
                var $button = $target.find("[type=submit]");

                //                if (formService.isLoading($button))
                //                    return;
                $button.button("loading");
                if (!$scope.showName || !$scope.showDescription) {
                    if ($scope.showName) {
                        Notification.error("Bạn chưa nhập tên show");
                    }
                    if ($scope.showDescription) {
                        Notification.error("Bạn chưa nhập mô tả show");
                    }
                    $button.button("reset");
                    return;
                }
                //                if (!formService.validate({
                //                    target: $button,
                //                    rule: [
                //                        {
                //                    check: function () {
                //                                return isNoUoW($scope.showName) === false;
                //                },
                //                    message: "Bạn chưa nhập tên show."
                //                },
                //                        {
                //                    check: function () {
                //                                return isNoUoW($scope.showDescription) === false;
                //                },
                //                    message: "Bạn chưa nhập mô tả show."
                //                }
                //                ]
                //                })) {
                //                    $button.button("reset");
                //                    return;
                //                };

                //#region [Edit status]

                webService.call({
                    type: "POST",
                    name: "Show_UpdateDescription",
                    data: {
                        showId: $scope.showId,
                        actionUserId: sessionService.userId(),
                        scheduleId: $scope.scheduleId,
                        name: $scope.showName,
                        content: $scope.showDescription,
                        key: sessionService.key()
                    },
                    displayError: true,
                    onError: function () {
                        $button.button("reset");
                    },
                    onSuccess: function (r) {
                        $button.button("reset");
                    }
                });

                //#endregion

                //#region [Edit show photo]

                var img = $element.find(".image-cropper").cropit("export", {
                    type: "image/jpeg",
                    quality: 1,
                    originalSize: true
                });

                if (img) {
                    webService.call({
                        type: "POST",
                        name: "User_UploadPhoto",
                        data: {
                            actionUserId: sessionService.userId(),
                            base64Photo: img.substring(23),
                            key: sessionService.key()
                        },
                        displayError: true,
                        onError: function() {
                            $button.button("reset");
                        },
                        onSuccess: function(imgLink) {
                            webService.call({
                                type: "POST",
                                name: "Show_UpdatePhoto",
                                data: {
                                    showId: $scope.showId,
                                    actionUserId: sessionService.userId(),
                                    scheduleId: $scope.scheduleId,
                                    photoLink: imgLink.Result,
                                    key: sessionService.key()
                                },
                                displayError: true,
                                onError: function() {
                                    $button.button("reset");
                                },
                                onSuccess: function(r) {
                                    $button.button("reset");
                                    $("#modal-edit-show").modal("hide");
                                }
                            });
                        }
                    });
                } else {
                    $("#modal-edit-show").modal("hide");
                }

                //#endregion
            };

            //#endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "/Views/UserControl/ucShowControl.html",
            controller: controller
        };
    }
]);
giasinhvienApp.directive("ucShowGlobalMessage", [
    "webService", "sessionService", "helperService", "authenticationService", "Notification",
    function (webService, sessionService, helperService, authenticationService, Notification) {
        var controller = function ($scope, $element) {
            //#region [Field]

            $scope._ctrl = this;
            $scope.helper = helperService;
            $scope.sessionService = sessionService;
            $scope.scheduleId = undefined;

            $scope.listMessage = [];
            $scope.messageTarget = undefined;
            $scope.autoScroll = true;
            $scope.targetUserId = undefined;

            //#endregion

            //#region [Method]

            this.load = function (scheduleId) {

                $scope.scheduleId = scheduleId;

                //#region [Lấy danh sách người chat]

                $scope.messageTarget = {
                    list: [
                        {
                            name: "Cả phòng"
                        }
                    ]
                };
                $scope.messageTarget.selected = $scope.messageTarget.list[0];

                //#endregion

                //#region [config Coin chat]
                webService.call({
                    name: "Config_GetConfig",
                    data: {
                        actionUserId: sessionService.userId(),
                        value: "CoinChatValue",
                        key: sessionService.key(),
                    },
                    onSuccess: function (r) {
                        $scope.CoinChatValue = r.Result.Value;
                    }
                });
                //#endregion

                $scope.status = "loaded";
                $scope.$apply();
            };

            this.scrollToBottom = function () {
                var $list = $element.find(".list");
                $list.scrollTop($list[0].scrollHeight);
            };

            this.addMessageTarget = function (userId, name, avatar) {
                var check = true;
                $scope.targetUserId = userId;
                $($scope.messageTarget.list).each(function (i, x) {
                    if (x.id === userId) {
                        check = false;
                        return false;
                    }
                });

                if (check) {
                    $scope.messageTarget.list.push({
                        id: userId,
                        name: name,
                        avatar: avatar
                    });
                }
            };

            this.setMessageTarget = function (userId) {
                var index = 0;

                $($scope.messageTarget.list).each(function (i, x) {
                    if (x.id === userId) {
                        index = i;
                        return false;
                    }
                });

                $scope.messageTarget.selected = $scope.messageTarget.list[index];
            };

            this.addMessage = function (fromUser, targerUser, message) {
               
                message = helperService.formatMessage(message);

                $scope.listMessage.push({
                    user: fromUser,
                    target: targerUser,
                    message: message,
                    type: "message"
                });

                while ($scope.listMessage.length > 100) {
                    $scope.listMessage.shift();
                }

                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            this.addAlert = function (message) {
                message = helperService.formatMessage(message);
                $scope.listMessage.push({
                    message: message,
                    type: "alert"
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            this.addAlertGlobal = function (header, message) {
                
                message = header + helperService.formatMessage(message);
                message = helperService.urlify(message);
                $scope.listMessage.push({
                    message: message,
                    type: "alert"
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            this.addAlertGlobal2 = function (header, message) {


                $scope.listMessage.push({
                    message: message,
                    type: "alert"
                });
                $scope.$apply();

                if ($scope.autoScroll)
                    $scope._ctrl.scrollToBottom();
            };

            //#endregion

            //#region [Callback]

            // onSendMessage(message, target, callback)

            //#endregion

            //#region [Event]

            $scope.onTextKeyPress = function ($event) {
                $("#dropdown-message-emoticon").jqDropdown("hide");

                if ($event.keyCode === 13 && $event.shiftKey === false) {
                    $event.preventDefault();
                    $scope.onSendMessage({
                        target: $($event.target).closest("form")
                    });
                }
            };

            $scope.onSendMessage = function ($event) {
                
                $("#dropdown-message-emoticon").jqDropdown("hide");

                var $target = $($event.target);
                var $button = $target.find("[type=submit]");
                var $checkbox = $target.find("[type=checkbox]");

                if ($scope.helper.isLoading($button))
                    return;

                if (!sessionService.isSigned()) {
                    authenticationService.showModal({
                        mode: "sign-in",
                        message: "Bạn cần đăng nhập để sử dụng tính năng này"
                    });
                    return;
                }

                if (!$target.find("textarea#message-text.message-text").val()) {
                    Notification.warning({ message: 'Bạn chưa nhập tin nhắn !', delay: 3000, positionY: 'bottom', positionX: 'right' });
                    return;
                }
                if ($checkbox.is(":checked")) {
                    webService.call({
                        name: "SendCoinChat",
                        type: "POST",
                        data: {
                            actionUserId: sessionService.userId(),
                            scheduleId: $scope.scheduleId,
                            message: $target.find("textarea#message-text.message-text").val(),
                            targetUserId: $scope.targetUserId ? $scope.targetUserId : -1,
                            key: sessionService.key()
                        },
                        displayError: true,
                        onSuccess: function (r) {
                            sessionService.data().user.User.Coin += -r.config;
                            $target.find("textarea#message-text.message-text").val("");
                            return;
                        }
                    });
                } else {
                    if (typeof $scope._ctrl.onSendMessage === "function") {
                        $button.button("loading");
                        $scope._ctrl.onSendMessage($target.find("textarea#message-text.message-text").val(), $scope.messageTarget.selected, function () {
                            $scope.$apply();
                        });
                        $button.button("reset");
                        $target.find("textarea#message-text.message-text").val("");
                    }
                }
            };

            //#endregion
        };

        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "/Views/UserControl/ucShowGlobalMessage.html",
            controller: controller
        };
    }
]);
giasinhvienApp.directive("ucShowItem", [
    "helperService", function (helperService) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                id: "@",
                name: "@",
                photo: "@",
                startTime: "@",
                live: "@",
                view: "@",
                followStatus: "@",
                starId: "@",
                starLevelName: "@",
                starLevelPhoto: "@",
                showModel: "="
            },
            templateUrl: "/Views/UserControl/ucShowItem.html",
            link: function (scope, element, attrs) {
                if (scope.showModel) {                   
                    var star = undefined;
                    if (scope.showModel.ListShow != undefined)
                        star = scope.showModel.ListShow[0];
                    if (!scope.id) scope.id = scope.showModel.Show.Id;
                    if (!scope.photo) scope.photo = scope.showModel.Show.Photo;
                    if (!scope.name && !star) {
                        scope.name = scope.showModel.User.Name;
                    } else {
                        scope.name = scope.showModel.ListShow[0].StarUser.Name;
                    };
                    if (!scope.startTime) scope.startTime = scope.showModel.Schedule.StartTime;
                    if (!scope.status) scope.status = scope.showModel.Schedule.Status;
                    if (!scope.view) scope.view = scope.showModel.Show.OnlineUser;
                    if (star != undefined) {
                        if (!scope.starId) scope.starId = star.StarUser.Id;
                        if (!scope.starLevelName) scope.starLevelName = star.StarLevel.Name;
                        if (!scope.starLevelPhoto) scope.starLevelPhoto = star.StarLevel.Photo;
                        if (star.FollowInfo) scope.followStatus = star.FollowInfo.Status;
                    }
                    else {
                        scope.id = scope.showModel.Show.Id;
                        if (!scope.starId) scope.starId = scope.showModel.User.Id;
                        if (!scope.starLevelName) scope.starLevelName = scope.showModel.StarLevel.Name;
                        if (!scope.starLevelPhoto) scope.starLevelPhoto = scope.showModel.StarLevel.Photo;
                        scope.followStatus = false;
                    }
                }
                if (scope.id) {
                    scope.link = helperService.linkAction("/show/" + scope.id);
                } else if (scope.starId) {
                    scope.link = helperService.linkAction("/user/" + scope.starId);
                }

                if (scope.photo) {
                    scope.photo = helperService.linkImage(scope.photo, 320);
                }
                
                if (scope.startTime) {
                    var now = new Date();
                    scope.s = scope.startTime - 7 * 60 * 60 * 1000;
                    scope.startTime = new Date(scope.s);

                    if (now.getFullYear() === scope.startTime.getFullYear() && now.getMonth() === scope.startTime.getMonth() && now.getDate() === scope.startTime.getDate()) {
                        scope.shortStartTime = scope.startTime;
                        scope.startTimeType = "time";
                    } else {
                        scope.shortStartTime = scope.startTime.getDate() + "/" + (scope.startTime.getMonth() + 1);
                        scope.startTimeType = "date";
                    }

                    scope.startTimeText = scope.startTime;
                }

                if (scope.view) {
                    scope.view = helperService.formatNumber(scope.view, ",", "k", "m", "b");
                }
            }
        };
    }
]);
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
giasinhvienApp.directive("ucUserListItem", [
    "helperService", function (helperService) {
        return {
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                id: "@",
                showId: "@",
                avatar: "@",
                name: "@",
                levelName: "@",
                levelPhoto: "@",
                nextLevelName: "@",
                nextLevelPhoto: "@",
                nextLevelPoint: "@",
                currentLevelPoint: "@",
                displayPoint: "@",
                displayPointType: "@",
                vipPhoto: "@",
                vipName: "@",
                badgePhoto: "@",
                badgeName: "@",
                vipColor: "@",
                showVipBadge: "@",
                link: "@",
                type: "@",
                indexValue: "@",
                model: "="
            },
            templateUrl: "/Views/UserControl/ucUserListItem.html",
            link: function (scope, element, attrs) {
                scope.displayPointType = getOrDefault(scope.displayPointType, "coin");
                scope.showVipBadge = getOrDefault(scope.showVipBadge, false);
                if (scope.type) {
                    scope.type = scope.type * 1;
                } else {
                    scope.type = 1;
                }

                if (scope.model) {
                    if (scope.model.GroupUser) scope.type = scope.model.GroupUser.Id;

                    if (scope.type === 2) {
                        if (!scope.id) scope.id = scope.model.User.Id;
                        if (!scope.showId && scope.model.Show) scope.showId = scope.model.Show.Id;
                        if (!scope.avatar) scope.avatar = scope.model.User.AvatarPhoto;
                        if (!scope.name) scope.name = scope.model.User.Name;
                        if (!scope.indexValue) scope.indexValue = scope.indexValue;
                        if (!scope.levelName) {
                            if (scope.model.StarLevel)
                                scope.levelName = scope.model.StarLevel.Name;
                            else
                                scope.levelName = scope.model.GroupLevel.Name;
                        }
                        if (!scope.levelPhoto) {
                            if (scope.model.StarLevel)
                                scope.levelPhoto = scope.model.StarLevel.Photo;
                            else
                                scope.levelPhoto = scope.model.GroupLevel.Photo;
                        }
                        if (!scope.nextLevelName && scope.model.NextGroupLevel) scope.nextLevelName = scope.model.NextGroupLevel.Name;
                        if (!scope.nextLevelPhoto && scope.model.NextGroupLevel) scope.nextLevelPhoto = scope.model.NextGroupLevel.Photo;
                        if (!scope.nextLevelPoint && scope.model.NextGroupLevel) scope.nextLevelPoint = scope.model.NextGroupLevel.Point;
                        if (!scope.currentLevelPoint && scope.model.UserStarData) scope.currentLevelPoint = scope.model.UserStarData.CoinGetFromGift;
                        if (!scope.displayPoint && scope.model.UserStarData) scope.displayPoint = scope.model.UserStarData.CoinGetFromGift;
                        if (!scope.vipPhoto && scope.model.VipItem) scope.vipPhoto = scope.model.VipItem.PhotoLink;
                        if (!scope.vipName && scope.model.VipItem) scope.vipName = scope.model.VipItem.Name;
                        if (!scope.vipColor && scope.model.VipItem) scope.vipColor = scope.model.VipItem.HexColor;
                        if (!scope.badgePhoto && scope.model.Badge) scope.badgePhoto = scope.model.Badge.Photo;
                        if (!scope.badgeName && scope.model.Badge) scope.badgeName = scope.model.Badge.Name;

                    } else {
                        if (!scope.id) scope.id = scope.model.User.Id;
                        if (!scope.avatar) scope.avatar = scope.model.User.AvatarPhoto;
                        if (!scope.name) scope.name = scope.model.User.Name;
                        if (!scope.indexValue) scope.indexValue = scope.indexValue;
                        if (!scope.levelName) scope.levelName = scope.model.GroupLevel.Name;
                        if (!scope.levelPhoto) scope.levelPhoto = scope.model.GroupLevel.Photo;
                        if (!scope.nextLevelName && scope.model.NextGroupLevel) scope.nextLevelName = scope.model.NextGroupLevel.Name;
                        if (!scope.nextLevelPhoto && scope.model.NextGroupLevel) scope.nextLevelPhoto = scope.model.NextGroupLevel.Photo;
                        if (!scope.nextLevelPoint && scope.model.NextGroupLevel) scope.nextLevelPoint = scope.model.NextGroupLevel.Point;
                        if (!scope.currentLevelPoint) scope.currentLevelPoint = scope.model.User.TotalCoinUsed;
                        if (!scope.displayPoint) scope.displayPoint = scope.model.User.TotalCoinUsed;
                        if (!scope.vipPhoto && scope.model.VipItem) scope.vipPhoto = scope.model.VipItem.PhotoLink;
                        if (!scope.vipName && scope.model.VipItem) scope.vipName = scope.model.VipItem.Name;
                        if (!scope.vipColor && scope.model.VipItem) scope.vipColor = scope.model.VipItem.HexColor;
                        if (!scope.badgePhoto && scope.model.Badge) scope.badgePhoto = scope.model.Badge.Photo;
                        if (!scope.badgeName && scope.model.Badge) scope.badgeName = scope.model.Badge.Name;
                    }
                }

                if (!scope.link) {
                    if (scope.showId) {
                        scope.link = helperService.linkAction("/show/" + scope.showId);
                    } else if (scope.id) {
                        scope.link = helperService.linkAction("/user/" + scope.id);
                    }
                }

                if (scope.avatar) {
                    scope.avatar = helperService.linkImage(scope.avatar, 160);
                }

                if (scope.currentLevelPoint && scope.nextLevelPoint) {
                    scope.nextLevelPointNeed = helperService.formatNumber(scope.nextLevelPoint - scope.currentLevelPoint);
                    scope.nextLevelPointProgress = Math.round((scope.currentLevelPoint / scope.nextLevelPoint) * 100);
                }

                if (scope.displayPoint) {
                    scope.shortDisplayPoint = helperService.formatNumber(scope.displayPoint, ",", "k");
                }
                scope.helper = helperService;
            }
        };
    }
]);