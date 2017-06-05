using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using ServiceGSV.Helper;
using ServiceGSV.Module;
using TFLLib;
using TFLLib.DAOCore;

namespace ServiceGSV
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Service1 : IService1
    {
        public Stream GetListCategory(string key)
        {
            var rs = BUS.BUS.GetAllProductCategory(1).Result;
            return ResultHelper.Json(rs.ToJson("*"));
        }

        public Stream GetListProduct(string key)
        {
            var rs = BUS.BUS.GetAllProduct(1).Result;
            return ResultHelper.Json(rs.ToJson("*"));
        }

        public string aaa()
        {
            
            return ("ddgdsgs").ToJson("*");
        }

        public string DangKyUser(string Name,string email,string pass)
        {
            var rs = BUS.BUS.DangKyUserMoi(new UserInfo
            {
                UserName = Name,

            }).Result;
            return rs.ToJson("*");
        }
    }
}
