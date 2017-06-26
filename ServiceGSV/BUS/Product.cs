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

        public static PageResult<ProductModel> Store_GetListProduct(long? actionUserId, int pageIndex, int pageSize,
            string str_Name = null,int? num_CategoryId = null,int? num_SubCategoryId = null,
            int? num_Price = null,int? num_Status = null,DateTime? StartDate = null,
            DateTime? EndDate = null,int? num_PostUserId = null,int? num_DictrictId = null,int? num_ProviceId = null)
        {
            return BUSCore.DoPage<ProductModel>(
                userId: actionUserId,
                action: (c) =>
                {
                    #region [Lấy dữ liệu]

                    var pAgr = new PageArg<ProductModel.Select, ProductModel.Sort>
                    {
                        PageIndex = pageIndex,
                        PageSize = pageSize,
                        Select = new SelectItem<ProductModel.Select>[]
                        {
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.Product,
                                Column =
                                    new[] {"Id", "Name", "Description", "Photo", "CreateDate", "Title",
                                        "Price","Link" }
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.District,
                                Column = new[] {"Id","Name"}
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.Province,
                                Column = new[] {"Id","Name"}
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.UserInfo,
                                Column = new[] {"Id", "UserName", "AvatarPhoto" }
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.ProductCategory,
                                Column = new[] {"Id", "Name" }
                            }

                        },
                        DebugQuery = true
                    };
                    num_Status = 1;
                    var pResult = ProductDAO.Get(c.Db, pAgr,
                        str_Name: str_Name == null ? null : new StringParam(str_Name),
                        num_CategoryId: num_CategoryId == null ? null : new NumericParam(num_CategoryId),
                        num_SubCategoryId: num_SubCategoryId == null ? null : new NumericParam(num_SubCategoryId),
                        num_Price: num_Price == null ? null : new NumericParam(num_Price),
                        num_Status: num_Status == null ? null : new NumericParam(num_Status),
                        date_CreateDate:StartDate == null ? null : new DateTimeParam(StartDate,EndDate),
                        num_PostUserId: num_PostUserId == null ? null : new NumericParam(num_PostUserId),
                        num_DictrictId: num_DictrictId == null ? null : new NumericParam(num_DictrictId),
                        num_ProviceId: num_ProviceId == null ? null : new NumericParam(num_ProviceId)
                    );
                    #endregion
                    
                    c.SetError(pResult);
                    return pResult;
                });
        }

        public static PageResult<ProductModel> Store_GetInfoProduct(long? actionUserId, long id)
        {
            return BUSCore.DoPage<ProductModel>(
                userId: actionUserId,
                action: (c) =>
                {
                    #region [Lấy dữ liệu]

                    var pAgr = new PageArg<ProductModel.Select, ProductModel.Sort>
                    {
                        PageIndex = 0,
                        PageSize = 1,
                        Select = new SelectItem<ProductModel.Select>[]
                        {
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.Product,
                                Column =
                                    new[] {"Id", "Name", "Description", "Photo", "CreateDate", "Title",
                                        "Price" ,"Link" }
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.District,
                                Column = new[] {"Id","Name"}
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.Province,
                                Column = new[] {"Id","Name"}
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.UserInfo,
                                Column = new[] {"Id", "UserName", "AvatarPhoto","Phone", "CreateDate" }
                            },
                            new SelectItem<ProductModel.Select>()
                            {
                                Table = ProductModel.Select.ProductCategory,
                                Column = new[] {"Id", "Name" }
                            }

                        },
                        DebugQuery = true
                    };
                    var num_Status = 1;
                    long[] num_id  = new long[] { id };

                    var pResult = ProductDAO.Get(c.Db, pAgr,
                        id: num_id,
                        num_Status: num_Status == null ? null : new NumericParam(num_Status)
                    );
                    #endregion

                    c.SetError(pResult);
                    return pResult;
                });
        }
    }
}