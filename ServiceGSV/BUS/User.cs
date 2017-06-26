using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Module;
using ServiceGSV.Module;
using ServiceGSV.Module.DAO;
using ServiceGSV.Module.Model;
using TFLLib.DAOCore;

namespace ServiceGSV.BUS
{
    public partial class BUS
    {
        public static DoResult<UserInfo> Bus_GetUserInfo(long id)
        {
            return BUSCore.Do<UserInfo>(
                userId: -1,
                action: (c) =>
                {
                    //lấy user có email là _email
                    var userTemp = UserInfoDAO.GetById(c.Db, id);
                    if (userTemp == null) //không ttồn tại user có email
                    {
                        c.SetError("Không tìm thấy thông tin User", 1);
                        return null;
                    }

                    return userTemp;

                });

        }

        public static DoResult<UserInfo> Bus_DangNhapBangEmail(string _email, string passwork)
        {
            //MaHoaMD5 mahoa = new MaHoaMD5();

            return BUSCore.Do<UserInfo>(
                userId: -1,
                action: (c) =>
                {
                    //lấy user có email là _email
                    var userTemp = UserInfoDAO.GetUserByEmail(c.Db, _email).Result;
                    if (userTemp == null) //không ttồn tại user có email
                    {
                        c.SetError("Không tìm thấy thông tin User", 1);
                        return null;
                    }
                    else // có user=> kiểm tra passwork
                    {
                        if (/*userTemp.Passwork != mahoa.md5(passwork)*/1 != 1)
                        {
                            c.SetError("Passwork nhập vào không đúng.Nhập lại", 1);
                            return null;
                        }
                        else//kiểm tra hợp lệ
                        {
                            return userTemp;
                        }
                    }
                });

        }

        public static DoResult<UserInfo> Bus_DangKyUserMoi(string email, string username, string passwork, string photo, string sodienthoai)
        {
            //MaHoaMD5 mahoa = new MaHoaMD5();
            return BUSCore.Do<UserInfo>(
                userId: -1,
                action: (c) =>
                {
                    //get user có email xxxxx => xxxxx có ng dung chua ? loi
                    var ysafas = UserInfoDAO.GetUserByEmail(c.Db, email).Result;
                    if (ysafas != null)
                    {
                        c.SetError("Email đã đc sử dụng", 1);
                        return null;
                    }
                    UserInfo data = new UserInfo();
                    data.Email = email;
                    data.UserName = username;
                    //data.Passwork = mahoa.md5(passwork);
                    data.AvatarPhoto = photo;
                    data.GroupId = 1;
                    data.Phone = sodienthoai;
                    // Cập nhật hệ thống
                    var r = UserInfoDAO.Insert(c.Db, data);

                    return r.Result;
                });

        }
        public static DoResult<UserInfo> Bus_ThayDoiThongTinUser(string username, string passwork, string photo, string sodienthoai)
        {
            //MaHoaMD5 mahoa = new MaHoaMD5();
            return BUSCore.Do<UserInfo>(
                userId: -1,
                action: (c) =>
                {

                    UserInfo data = new UserInfo();
                    data.UserName = username;
                    //data.Passwork = mahoa.md5(passwork);
                    data.AvatarPhoto = photo;
                    data.GroupId = 1;
                    data.Phone = sodienthoai;
                    // Cập nhật hệ thống
                    var r = UserInfoDAO.Update(c.Db, data);

                    return r.Result;
                });

        }

    }
}