using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web;
using ServiceGSV.Module.Model;
using TFLLib.DAOCore;

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