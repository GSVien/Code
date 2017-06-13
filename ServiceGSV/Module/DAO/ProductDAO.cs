using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web;
using ServiceGSV.Module.Model;
using TFLLib.DAOCore;

namespace ServiceGSV.Module.DAO
{
    public class ProductDAO
    {
        public static List<Product> GetList(GiaSinhVienEntities db)
        {
            return db.Products.Where(w=> w.Status == ProductStatus.Active).ToList();
        }

        public static PageResult<ProductModel> Get(
            GiaSinhVienEntities db,
            PageArg<ProductModel.Select, ProductModel.Sort> pageArg,
            long[] id = null,
            StringParam str_Name = null,
            NumericParam num_CategoryId = null,
            NumericParam num_SubCategoryId = null,
            NumericParam num_Price = null,
            NumericParam num_Status = null,
            DateTimeParam date_CreateDate = null,
            NumericParam num_PostUserId = null,
            NumericParam num_DictrictId = null,
            NumericParam num_ProviceId = null)
        {
            return DAOCore.DoPage<ProductModel, ProductModel.Select, ProductModel.Sort>(pageArg, (c, p) =>
            {
                var total = new ObjectParameter("Total", typeof(int));
                var query = new ObjectParameter("Query", typeof(string));

                var data = db.usp_Product_Get(
                    pageArg.SelectQuery(), pageArg.SortQuery(), p.PageIndex, p.PageSize, pageArg.DebugQuery,
                    id == null ? null : string.Join(",", id),
                    str_Name == null ? null : str_Name.ToString(),
                    num_CategoryId == null ? null : num_CategoryId.ToString(),
                    num_SubCategoryId == null ? null : num_SubCategoryId.ToString(),
                    num_Price == null ? null : num_Price.ToString(),
                    num_Status == null ? null : num_Status.ToString(),
                    date_CreateDate == null ? null : date_CreateDate.ToString(),
                    num_PostUserId == null ? null : num_PostUserId.ToString(),
                    num_DictrictId == null ? null : num_DictrictId.ToString(),
                    num_ProviceId == null ? null : num_ProviceId.ToString(),
                    total, query).FirstOrDefault();

                c.SetResult(p, c.ConvertFromXml(data), (int)total.Value, query.Value == DBNull.Value ? null : (string)query.Value);
            });
        }
    }
}