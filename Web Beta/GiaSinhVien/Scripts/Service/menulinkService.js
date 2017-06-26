giasinhvienApp.factory("menulinkService", [
    function () {
        var service = new function () {
            this.listMenuHead = function () {
                return [
                        {
                            Name: "Giới Thiệu",
                            Link: '/',
                        },
                        {
                            Name: "Chính Sách",
                            Link: '/',
                        },
                        {
                            Name: "Liên Hệ",
                            Link: '/',
                        }
                                ];
            };

            this.listCategory = function () {
                return [
                        {
                            Id: 1,
                            Name: "Đồ Điện Tử",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        //{
                        //    Id: 2,
                        //    Name: "Xe Cộ",
                        //    Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                        //    Link: '/',
                        //    Status: 1
                        //},
                        {
                            Id: 7,
                            Name: "Nội Ngoại Thất",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        {
                            Id: 4,
                            Name: "Gia Dụng",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        //{
                        //    Id: 8,
                        //    Name: "Giải Trí Thể Thao",
                        //    Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                        //    Link: '/',
                        //    Status: 1
                        //},
                        {
                            Id: 10,
                            Name: "Sách Báo",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        {
                            Id: 13,
                            Name: "Bất Động Sản",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        },
                        {
                            Id: 15,
                            Name: "Các Loại Khác",
                            Photo: 'http://i1150.photobucket.com/albums/o617/redsvn/slide/slide-ewaste.jpg',
                            Link: '/',
                            Status: 1
                        }
                                ];
            };
        };
        return service;
    }
]);