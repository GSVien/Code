teenidolApp.directive("ucShowItem", [
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