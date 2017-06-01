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