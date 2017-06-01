using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServiceGSV.Module.DAO
{
    public class ProductCategoryDAO
    {
        public static List<ProductCategory> GetList(GiaSinhVienEntities db)
        {
            return db.ProductCategories.Where(w=> w.Status == ProductCategoryStatus.Active).ToList();
        }
    }
}