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