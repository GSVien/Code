using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web;
using ServiceGSV.Module.Model;
using TFLLib.DAOCore;

namespace ServiceGSV.Module.DAO
{
    public class ProvinceDAO
    {
        public static List<Province> GetList(GiaSinhVienEntities db)
        {
            return db.Provinces.Where(w=> w.Status == 1).ToList();
        }
    }
}