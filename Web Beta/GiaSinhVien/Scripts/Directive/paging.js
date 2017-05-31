teenidolApp.directive("paging", [
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