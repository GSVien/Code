teenidolApp.directive("showStatus", [
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