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
        public Stream GetListProduct(string key)
        {
            var rs = BUS.BUS.GetAllProduct(1).Result;
            return ResultHelper.Json(rs.ToJson("*"));
        }

        public string aaa()
        {
            
            return ("ddgdsgs").ToJson("*");
        }

        #region User
        public Stream DangNhapBangEmail(string email,string passwork)
        {
            var rs = BUS.BUS.Bus_DangNhapBangEmail(email, passwork);
            return ResultHelper.Json(rs.ToJson("*"));
        }
        public Stream DangKyUserMoi(string email, string username, string passwork, string photo, string sodienthoai)
        {
            var rs = BUS.BUS.Bus_DangKyUserMoi(email,username, passwork, photo, sodienthoai);
            return ResultHelper.Json(rs.ToJson("*"));
        }
        public Stream ThayDoiThongTinUser(string username, string passwork, string photo, string sodienthoai)
        {
            var rs = BUS.BUS.Bus_ThayDoiThongTinUser(username, passwork, photo, sodienthoai);
            return ResultHelper.Json(rs.ToJson("*"));
        }
        #endregion

        #region Product
        public Stream GetListCategory(string key)
        {
            var rs = BUS.BUS.GetAllProductCategory(1);
            return ResultHelper.Json(rs.ToJson("*"));
        }

        public Stream GetSubProductCategory(long num_categoryId)
        {
            var rs = BUS.BUS.GetSubProductCategory(1, num_categoryId);
            return ResultHelper.Json(rs.ToJson("*"));
        }


        public Stream GetAllProvince(string key)
        { 
            var rs = BUS.BUS.GetAllProvince(1);
            return ResultHelper.Json(rs.ToJson("*"));
        }

        public Stream GetDistrict(long num_ProviceId)
        {
            var rs = BUS.BUS.GetDistrict(1, num_ProviceId);
            return ResultHelper.Json(rs.ToJson("*"));
        }



        public Stream GetListProductModel(long actionUserId, int pageIndex, int pageSize,
            string str_Name , int num_CategoryId , int num_SubCategoryId ,
            int StartPrice , int EndPrice, long StartDate ,
            long EndDate, int num_PostUserId , int num_DictrictId , int num_ProviceId)
        {
            DateTime? _startDate = null;
            DateTime? _endDate = null;
            if (StartDate > 0)
            {
                _startDate = ParamHelper.ConvertUnixTimeToDate(StartDate);
            }
            if (EndDate > 0)
            {
                _endDate = ParamHelper.ConvertUnixTimeToDate(EndDate);
            }

            int? _Category = null;
            int? _SubCategoryId = null;
            int? _PostUserId = null;
            int? _DictrictId = null;
            int? _ProviceId = null;
            int? _Price = null;

            if (num_CategoryId > 0)
                _Category = num_CategoryId;
            if (num_SubCategoryId > 0)
                _SubCategoryId = num_SubCategoryId;
            if (num_PostUserId > 0)
                _PostUserId = num_PostUserId;
            if (num_DictrictId > 0)
                _DictrictId = num_DictrictId;
            if (num_ProviceId > 0)
                _ProviceId = num_ProviceId;
            var rs = BUS.BUS.Store_GetListProduct(actionUserId,pageIndex,pageSize,
            str_Name , _Category, _SubCategoryId, _Price, null , _startDate,
                _endDate, _PostUserId, _DictrictId, _ProviceId);
            return ResultHelper.Json(rs.ToJson("*"));
        }

        public Stream GetInfoProductModel(long actionUserId, long id)
        {
            var rs = BUS.BUS.Store_GetInfoProduct(actionUserId, id);
            return ResultHelper.Json(rs.ToJson("*"));
        }
        #endregion
    }
}
