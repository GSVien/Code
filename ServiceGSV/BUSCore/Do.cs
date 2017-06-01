#define TEST_MODE
using System;
using System.Linq;
using ServiceGSV.BUS;
using ServiceGSV.Module;
using TFLLib.DAOCore;

namespace Module
{
    internal partial class BUSCore
    {
        
        internal static DoResult Do(long? userId,  Action<DoController> action)
        {
            var controller = new DoController();

            try
            {
                controller.Db.Database.Connection.Open();
                action(controller);
               
            }
            catch (Exception ex)
            {
                controller.SetError(ex.Message, -1);
            }
            finally
            {
                controller.Db.Database.Connection.Close();
            }

            return controller.Result;
        }

        internal static DoResult<T> Do<T>(long? userId, Func<DoController<T>, T> action)
        {
            var controller = new DoController<T>();

            try
            {
                controller.Db.Database.Connection.Open();
                controller.Result.Result = action(controller);
            }
            catch (Exception ex)
            {
                controller.Result.Result = controller.FailResult;
                controller.SetError(ex.Message, -1);
            }
            finally
            {
                controller.Db.Database.Connection.Close();
            }

            return controller.Result;
        }

        internal static PageResult<T> DoPage<T>(long? userId, Func<PageController<T>, PageResult<T>> action)
            where T : new()
        {
            var controller = new PageController<T>();

            try
            {
                controller.Db.Database.Connection.Open();

               
                    var r = action(controller);
                    if (r == null)
                    {
                        controller.Result.Items = null;
                        controller.Result.PageIndex = 0;
                        controller.Result.PageSize = 0;
                        controller.Result.PageCount = 0;
                        controller.Result.Total = 0;
                    }
                    else
                    {
                        controller.Result.ErrorCode = r.ErrorCode;
                        controller.Result.Message = r.Message;
                        controller.Result.Items = r.Items;
                        controller.Result.PageIndex = r.PageIndex;
                        controller.Result.PageSize = r.PageSize;
                        controller.Result.PageCount = r.PageCount;
                        controller.Result.Total = r.Total;
                    }
                

                return controller.Result;
            }
            catch (Exception ex)
            {
                controller.Result.Items = controller.FailResult.Items;
                controller.Result.PageIndex = controller.FailResult.PageIndex;
                controller.Result.PageSize = controller.FailResult.PageSize;
                controller.Result.PageCount = controller.FailResult.PageCount;
                controller.Result.Total = controller.FailResult.PageCount;
                controller.SetError(ex.Message, -1);
            }
            finally
            {
                controller.Result.Query = null;
                controller.Db.Database.Connection.Close();
            }

            return controller.Result;
        }

        internal static DoResult Do(Action<DoController> action, GiaSinhVienEntities db = null)
        {
            var controller = new DoController(db);

            try
            {
                if (db == null)
                    controller.Db.Database.Connection.Open();
                action(controller);
            }
            catch (Exception ex)
            {
                controller.SetError(ex.Message, -1);
            }
            finally
            {
                controller.Db.Database.Connection.Close();
            }

            return controller.Result;
        }

        internal static DoResult<T> Do<T>(Func<DoController<T>, T> action, GiaSinhVienEntities db = null)
        {
            var controller = new DoController<T>(db);

            try
            {
                if (db == null)
                    controller.Db.Database.Connection.Open();
                controller.Result.Result = action(controller);
            }
            catch (Exception ex)
            {
                controller.Result.Result = controller.FailResult;
                controller.SetError(ex.Message, -1);
            }
            finally
            {
                controller.Db.Database.Connection.Close();
            }

            return controller.Result;
        }

        internal static PageResult<T> DoPage<T>(Func<PageController<T>, PageResult<T>> action, GiaSinhVienEntities db = null)
            where T : new()
        {
            var controller = new PageController<T>(db);

            try
            {
                if (db == null)
                    controller.Db.Database.Connection.Open();

                var r = action(controller);
                if (r == null)
                {
                    controller.Result.Items = null;
                    controller.Result.PageIndex = 0;
                    controller.Result.PageSize = 0;
                    controller.Result.PageCount = 0;
                    controller.Result.Total = 0;
                }
                else
                {
                    controller.Result.ErrorCode = r.ErrorCode;
                    controller.Result.Message = r.Message;
                    controller.Result.Items = r.Items;
                    controller.Result.PageIndex = r.PageIndex;
                    controller.Result.PageSize = r.PageSize;
                    controller.Result.PageCount = r.PageCount;
                    controller.Result.Total = r.Total;
                }

                return controller.Result;
            }
            catch (Exception ex)
            {
                controller.Result.Items = controller.FailResult.Items;
                controller.Result.PageIndex = controller.FailResult.PageIndex;
                controller.Result.PageSize = controller.FailResult.PageSize;
                controller.Result.PageCount = controller.FailResult.PageCount;
                controller.Result.Total = controller.FailResult.PageCount;
                controller.SetError(ex.Message, -1);
            }
            finally
            {
                controller.Result.Query = null;
                controller.Db.Database.Connection.Close();
            }

            return controller.Result;
        }
    }
}
