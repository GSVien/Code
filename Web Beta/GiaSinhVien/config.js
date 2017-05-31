// Declare application
var giasinhvienApp = angular.module("giasinhvienApp", [
    "ngCookies",
    "ngRoute",
    "ngSanitize",
    "ngAnimate",
    "ngResource",
    "ui.bootstrap",
  //"kendo.directives",
   "angular-carousel",
   "ui-notification",
    "ui.select",
    "dibari.angular-ellipsis",
    "mwl.calendar"
]).constant('mogolab_config', {
    baseUrlWebService: "http://localhost:54895/Service1.svc/",
});

