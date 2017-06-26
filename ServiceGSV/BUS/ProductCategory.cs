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
        public static PageResult<ProductCategoryModel> GetListProductCategory(long? actionUserId, int? pageIndex = 0, int? pageSize = 10,
            long[] id = null, string str_Value = null, int? num_Status = null)
        {
            return BUSCore.DoPage<ProductCategoryModel>(
                userId: actionUserId,
                action: (c) =>
                {
                    var pArg = new PageArg<ProductCategoryModel.Select, ProductCategoryModel.Sort>
                    {
                        PageIndex = Convert.ToInt32(pageIndex),
                        PageSize = Convert.ToInt32(pageSize),
                        Select = new[]
                        {
                            new SelectItem<ProductCategoryModel.Select>{ Table = ProductCategoryModel.Select.ProductCategory, Column = new []{ "Id", "Name", "Photo" }},
                        },
                        DebugQuery = true
                    };

                    //var r = ProductCategoryDAO.Get(c.Db, pArg,
                    //    id: id,
                    //    str_Value: str_Value == null ? null : new StringParam(str_Value),
                    //    num_Status: num_Status == null ? null : new NumericParam(num_Status));
                    var r = new PageResult<ProductCategoryModel>();
                    c.SetError(r);
                    if (r.Total == 0)
                        r.Items = new List<ProductCategoryModel>();
                    return r;
                });
        }

        public static DoResult<List<ProductCategory>> GetAllProductCategory(long? actionUserId)
        {
            return BUSCore.Do<List<ProductCategory>>(
                userId: actionUserId,
                action: (c) =>
                {
                    // Cập nhật hệ thống
                    var r = ProductCategoryDAO.GetList(c.Db);
                    return r;
                });

        }
        public static DoResult<ProductCategory> GetProductCategoryByLink(long? actionUserId, string link)
        {
            return BUSCore.Do<ProductCategory>(
                userId: actionUserId,
                action: (c) =>
                {
                    // Cập nhật hệ thống
                    var r = ProductCategoryDAO.GetByLink(c.Db, link);
                    return r;
                });
        }
        public static DoResult<List<SubProductCategory>> GetSubProductCategory(long? actionUserId,long categoryId)
        {
            return BUSCore.Do<List<SubProductCategory>>(
                userId: actionUserId,
                action: (c) =>
                {
                    // Cập nhật hệ thống
                    var r = SubProductCategoryDAO.GetListByCategoryId(c.Db, categoryId);
                    return r;
                });

        }

        public static DoResult<List<Province>> GetAllProvince(long? actionUserId)
        {
            return BUSCore.Do<List<Province>>(
                userId: actionUserId,
                action: (c) =>
                {
                    // Cập nhật hệ thống
                    var r = ProvinceDAO.GetList(c.Db);
                    return r;
                });

        }

        public static DoResult<Province> GetProvinceByLink(long? actionUserId,string link)
        {
            return BUSCore.Do<Province>(
                userId: actionUserId,
                action: (c) =>
                {
                    // Cập nhật hệ thống
                    var r = ProvinceDAO.GetByLink(c.Db,link);
                    return r;
                });
        }

        public static DoResult<List<District>> GetDistrict(long? actionUserId,long proviceId)
        {
            return BUSCore.Do<List<District>>(
                userId: actionUserId,
                action: (c) =>
                {
                    // Cập nhật hệ thống
                    var r = DistrictDAO.GetListByProviceId(c.Db, proviceId);
                    return r;
                });

        }
    }
}