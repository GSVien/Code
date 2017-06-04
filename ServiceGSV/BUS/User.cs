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
        
        public static DoResult<UserInfo> DangKyUserMoi(UserInfo data)
        {
                return BUSCore.Do<UserInfo>(
                    userId: -1,
                    action: (c) =>
                    {
                    //get user có email xxxxx => xxxxx có ng dung chua ? loi
                    var ysafas = UserInfoDAO.GetUserByEmail(c.Db, data.Email).Result;
            if (ysafas != null)
            {
                var rs = new DoResult<UserInfo>();
                rs.ErrorCode = 1;
                rs.Message = "Email đã đc sử dụng";
                return null;
            }
                    // Cập nhật hệ thống
                    var r = UserInfoDAO.Insert(c.Db,data);

                    return r.Result;
                });

        }
    }
}