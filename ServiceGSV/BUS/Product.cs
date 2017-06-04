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

        public static DoResult<List<Product>> GetAllProduct(long? actionUserId)
        {
            return BUSCore.Do<List<Product>>(
                userId: actionUserId,
                action: (c) =>
                {
                    // Cập nhật hệ thống
                    var r = ProductDAO.GetList(c.Db);
                    return r;
                });

        }
    }
}