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