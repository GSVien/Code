giasinhvienApp.factory("formatText", [
    function () {
        var service = new function () {
            this.formatText = function (input) {
                var textreplace = input.replace(/á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|A|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, "a")
                 .replace(/đ|Đ|D/g, "d")
                 .replace(/ý|ỳ|ỷ|ỹ|ỵ|Y|Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, "y")
                 .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|U|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, "u")
                 .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|O|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, "o")
                 .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|E|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, "e")
                 .replace(/í|ì|ỉ|ĩ|ị|Í|Ì|Ỉ|Ĩ|Ị|I/g, "i");

                var output = textreplace.replace(/!|@|%|\^|\*|\”|\“|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-")
                .replace(/-+-/g, "-");//thay thế 2- thành 1-str= str.replace(/^\-+|\-+$/g,"");
                return output.toLowerCase();
            }
        };
        return service;
    }
]);