using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServiceGSV.Module.DAO
{
    public class ProductDAO
    {
        public static List<Product> GetList(GiaSinhVienEntities db)
        {
            return db.Products.Where(w=> w.Status == ProductStatus.Active).ToList();
        }
    }
}