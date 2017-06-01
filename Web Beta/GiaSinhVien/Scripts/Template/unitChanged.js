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