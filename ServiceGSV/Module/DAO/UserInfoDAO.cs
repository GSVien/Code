using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TFLLib;

namespace ServiceGSV.Module.DAO
{
    public class UserInfoDAO
    {
        public UserInfo GetById(GiaSinhVienEntities db,long id)
        {
            return db.UserInfoes.FirstOrDefault(f => f.Id == id).CloneObject();
        }


    }
}