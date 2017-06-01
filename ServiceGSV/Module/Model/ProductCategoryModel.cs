using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServiceGSV.Module.Model
{
    public class UserInfoModel
    {
        public UserInfo UserInfo { get; set; }

        public enum Select
        {
            UserInfo,
        }

        public enum Sort
        {
            UserInfo,
        }
    }
}