using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web;
using ServiceGSV.Module.Model;
using TFLLib.DAOCore;

namespace ServiceGSV.Module.DAO
{
    public class DistrictDAO
    {
        public static List<District> GetListByProviceId(GiaSinhVienEntities db,long proviceId)
        {
            return db.Districts.Where(w=> w.Status == 1 && w.ProvinceId == proviceId).ToList();
        }
    }
}