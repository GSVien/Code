teenidolApp.directive("guildInfo", [
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