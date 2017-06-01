using System.Collections.Generic;
using System.Linq;
using ServiceGSV.BUS;
using ServiceGSV.Module;
using TFLLib.DAOCore;

namespace Module
{
    internal partial class BUSCore
    {
        internal abstract class BaseController
        {
            protected BaseController(GiaSinhVienEntities db = null)
            {
                _cacheListAction = new Dictionary<long, long[]>();

                if (db == null)
                    Db = new GiaSinhVienEntities();
                else
                    Db = db;
            }
            
            #region [Fields]

            private readonly Dictionary<long, long[]> _cacheListAction;

            #endregion

            #region [Property]

            /// <summary>
            /// DB Context
            /// </summary>
            public GiaSinhVienEntities Db { get; protected set; }

            #endregion

            #region [Method]

            protected Rule BaseValidate(Rule[] rules)
            {
                foreach (var x in rules)
                    if (x.Method() == false)
                        return x;

                return null;
            }

            #endregion
        }

        internal class DoController : BaseController
        {
            public DoController(GiaSinhVienEntities db = null)
                : base(db)
            {
                Result = new DoResult();
            }

            #region [Property]

            /// <summary>
            /// Thông tin kết quả
            /// </summary>
            public DoResult Result { get; protected set; }

            #endregion

            #region [Method]

            /// <summary>
            /// Thực hiện quá trình kiểm tra
            /// </summary>
            /// <param name="rules">Danh sách các luật kiểm tra</param>
            /// <returns>Kết quả kiểm tra</returns>
            public bool Validate(params Rule[] rules)
            {
                var r = BaseValidate(rules);

                if (r != null)
                {
                    SetError(r.Message, r.Code);
                    return false;
                }

                return true;
            }

            /// <summary>
            /// Xóa thông báo lỗi
            /// </summary>
            public void SetError()
            {
                Result.ErrorCode = null;
                Result.Message = null;
            }

            /// <summary>
            /// Đặt lỗi
            /// </summary>
            /// <param name="message">Thống báo lỗi</param>
            /// <param name="errorCode">Mã lỗi</param>
            public void SetError(DoResult result)
            {
                Result.ErrorCode = result.ErrorCode;
                Result.Message = result.Message;
            }

            /// <summary>
            /// Đặt lỗi
            /// </summary>
            /// <param name="message">Thống báo lỗi</param>
            /// <param name="errorCode">Mã lỗi</param>
            public void SetError(string message, int errorCode)
            {
                Result.ErrorCode = errorCode;
                Result.Message = message;
            }

            #endregion
        }

        internal class DoController<T> : BaseController
        {
            public DoController(GiaSinhVienEntities db = null)
                : base(db)
            {
                FailResult = default(T);
                Result = new DoResult<T>();
            }

            #region [Property]

            /// <summary>
            /// Thiết lập: kết quả trả về mặc định khi thất bại
            /// </summary>
            public T FailResult { get; set; }

            /// <summary>
            /// Thông tin kết quả
            /// </summary>
            public DoResult<T> Result { get; protected set; }

            #endregion

            #region [Method]

            /// <summary>
            /// Thực hiện quá trình kiểm tra
            /// </summary>
            /// <param name="rules">Danh sách các luật kiểm tra</param>
            /// <returns>Kết quả kiểm tra</returns>
            public bool Validate(params Rule[] rules)
            {
                var r = BaseValidate(rules);

                if (r != null)
                {
                    SetError(r.Message, r.Code);
                    return false;
                }

                return true;
            }

            /// <summary>
            /// Xóa thông báo lỗi
            /// </summary>
            public void SetError()
            {
                Result.ErrorCode = null;
                Result.Message = null;
            }

            /// <summary>
            /// Đặt lỗi
            /// </summary>
            public void SetError(DoResult result)
            {
                Result.ErrorCode = result.ErrorCode;
                Result.Message = result.Message;
            }
            
            /// <summary>
            /// Đặt lỗi
            /// </summary>
            /// <param name="message">Thống báo lỗi</param>
            /// <param name="errorCode">Mã lỗi</param>
            public void SetError(string message, int errorCode)
            {
                Result.ErrorCode = errorCode;
                Result.Message = message;
            }

            #endregion
        }

        internal class PageController<T> : BaseController where T : new()
        {
            public PageController(GiaSinhVienEntities db = null)
                : base(db)
            {
                FailResult = new PageResult<T>();
                Result = new PageResult<T>();
            }

            #region [Property]

            public PageResult<T> FailResult { get; set; }

            /// <summary>
            /// Thông tin kết quả
            /// </summary>
            public PageResult<T> Result { get; protected set; }

            #endregion

            #region [Method]

            /// <summary>
            /// Thực hiện quá trình kiểm tra
            /// </summary>
            /// <param name="rules">Danh sách các luật kiểm tra</param>
            /// <returns>Kết quả kiểm tra</returns>
            public bool Validate(params Rule[] rules)
            {
                var r = BaseValidate(rules);

                if (r != null)
                {
                    SetError(r.Message, r.Code);
                    return false;
                }

                return true;
            }

            /// <summary>
            /// Xóa thông báo lỗi
            /// </summary>
            public void SetError()
            {
                Result.ErrorCode = null;
                Result.Message = null;
            }

            /// <summary>
            /// Đặt lỗi
            /// </summary>
            public void SetError(DoResult result)
            {
                Result.ErrorCode = result.ErrorCode;
                Result.Message = result.Message;
            }

            /// <summary>
            /// Đặt lỗi
            /// </summary>
            /// <param name="message">Thống báo lỗi</param>
            /// <param name="errorCode">Mã lỗi</param>
            public void SetError(string message, int errorCode)
            {
                Result.ErrorCode = errorCode;
                Result.Message = message;
            }

            #endregion
        }
    }
}