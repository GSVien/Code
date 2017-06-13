using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web;
using ServiceGSV.Module.Model;
using TFLLib.DAOCore;

namespace ServiceGSV.Module.DAO
{
    public class SubProductCategoryDAO
    {
        public static List<SubProductCategory> GetListByCategoryId(GiaSinhVienEntities db,long categoryId)
        {
            return db.SubProductCategories.Where(w=> w.Status == SubProductCategoryStatus.Active && w.ProductCategoryId == categoryId).ToList();
        }

        
    }
}