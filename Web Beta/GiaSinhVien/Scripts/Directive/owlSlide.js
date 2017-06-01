giasinhvienApp.directive('wrapOwlcarousel', function () {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope, element, attrs) {
		    
		    scope.initCarousel = function (element) {
				$(element).owlCarousel({
					loop: false,
					margin: 0,
				    items:4,
					nav: true,
					autoplay: true,
					autoplayTimeout: 40000,
					autoplayHoverPause: true,
					responsiveClass: true,
					dots: false,
					slideBy: 1,
					navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
					responsive: {
						0: {
							items: 4
						},
						600: {
							items: 4
						},
						1000: {
							items: 4
						}
					}
				});
			}
		}
	};
});
giasinhvienApp.directive('owlCarouselItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
            if (scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);
