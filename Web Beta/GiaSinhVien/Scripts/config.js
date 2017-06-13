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