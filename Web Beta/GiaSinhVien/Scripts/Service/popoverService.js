teenidolApp.factory("popoverService", [
    function () {
        var service = new function () {
            this.userMenu = {
                template: function() { return "/Layouts/Popover/UserMenu.html"; }
            };

            this.seatMenu = {
                template: function () { return "/Layouts/Popover/SeatMenu.html"; }
            };

            this.emoticon = {
                template: function () { return "/Layouts/Popover/Emoticon.html"; }
            };
        };
        return service;
    }
]);