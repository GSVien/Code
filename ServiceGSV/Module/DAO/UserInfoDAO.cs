using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Web;
using ServiceGSV.Module.Model;
using TFLLib;
using TFLLib.DAOCore;

namespace ServiceGSV.Module.DAO
{
    public class UserInfoDAO
    {
        public UserInfo GetById(GiaSinhVienEntities db,long id)
        {
            return db.UserInfoes.FirstOrDefault(f => f.Id == id).CloneObject();
        }

        public static PageResult<UserInfoModel> Get(
            GiaSinhVienEntities db,
            PageArg<UserInfoModel.Select, UserInfoModel.Sort> pageArg,
            long[] id = null,
            StringParam str_Name = null,
            NumericParam num_Status = null)
        {
            return DAOCore.DoPage<UserInfoModel, UserInfoModel.Select, UserInfoModel.Sort>(pageArg, (c, p) =>
            {
                var total = new ObjectParameter("Total", typeof(int));
                var query = new ObjectParameter("Query", typeof(string));

                string data = null;
                
                //db.usp_Badwords_Get(
                //    pageArg.SelectQuery(), pageArg.SortQuery(), p.PageIndex, p.PageSize, pageArg.DebugQuery,
                //    id == null ? null : string.Join(",", id),
                //    str_Value == null ? null : str_Value.ToString(),
                //    num_Status == null ? null : num_Status.ToString(),
                //    total, query).FirstOrDefault();

                c.SetResult(p, c.ConvertFromXml(data), (int)total.Value, query.Value == DBNull.Value ? null : (string)query.Value);
            });
        }

        public static DoResult<UserInfo> Insert(GiaSinhVienEntities db, UserInfo data)
        {
            return DAOCore.Do<UserInfo>(c =>
            {
                var it = new UserInfo();
                it.Passwork = data.Passwork;
                it.UserName = data.UserName;
                it.Phone = data.Phone;
                it.Address = data.Address;
                it.AvatarPhoto = data.AvatarPhoto;
                it.Email = data.Email;
                it.GroupId = data.GroupId;
                it.CreateDate = DateTime.Now;
                it.Status = UserStatus.Active;

                db.UserInfoes.Add(it);
                db.SaveChanges();

                return it;
            });
        }

        public static DoResult ChangeStatus(GiaSinhVienEntities db, long id, UserStatus newStatus)
        {
            return DAOCore.Do(c =>
            {
                var it = db.UserInfoes.Single(x => x.Id == id);

                it.Status = newStatus;
                db.SaveChanges();
            });
        }

        public static DoResult<UserInfo> Update(GiaSinhVienEntities db, UserInfo data)
        {
            return DAOCore.Do<UserInfo>(c =>
            {
                var it = db.UserInfoes.Single(x => x.Id == data.Id);
                it.UserName = data.UserName;
                it.Phone = data.Phone;
                it.Address = data.Address;
                it.AvatarPhoto = data.AvatarPhoto;
                it.Email = data.Email;
                it.GroupId = data.GroupId;

                db.SaveChanges();

                return it;
            });
        }

    }
}