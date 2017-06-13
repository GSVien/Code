using System;
using ServiceGSV.Helper;
using TFLLib.DAOCore;

namespace ServiceGSV
{
    /// <summary>
    /// Param Helper is a class helping convert param in specific type into desired type 
    /// </summary>
    public class EnumModel
    {
        public int Value { get; set; }
        public string Name { get; set; }
    }
    public class ParamHelper
    {
        public static Random rand = new Random();
        /// <summary>
        /// Convert dateTime in long to DateTimeParam
        /// </summary>
        /// <param name="dateTime">long in millisecond</param>
        /// <returns>DateTime in DateTimeParam</returns>
        
        public static readonly DateTime OriginDate = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        public static long ConvertDateToUnixTime(DateTime date)
        {
            return (long)(date.ToLocalTime() - OriginDate).TotalMilliseconds;
        }

        public static DateTime ConvertUnixTimeToDate(long unixTime)
        {
            if (unixTime == 0)
                return new DateTime(1, 1, 1, 0, 0, 0);
            return OriginDate.AddMilliseconds(unixTime).ToLocalTime();
        }

        //public static DateTime ConvertUnixTimeToDate(long unixTime, int clientTimeZoneOffset)
        //{
        //    if (unixTime == 0)
        //        return new DateTime(1, 1, 1, 0, 0, 0);
        //    return OriginDate
        //        .AddMilliseconds(unixTime).ToLocalTime()
        //        .AddMinutes(-clientTimeZoneOffset)
        //        .AddMinutes(AppConst.TimeZoneMinute);
        //}

        //public static DateTime ConvertUnixTimeToDateLocal(long unixTime, int clientTimeZoneOffset)
        //{
        //    if (unixTime == 0)
        //        return new DateTime(1, 1, 1, 0, 0, 0);
        //    return OriginDate
        //        .AddMilliseconds(unixTime).ToLocalTime()
        //        .AddHours(-AppConst.TimeZoneWith0)
        //        .AddMinutes(clientTimeZoneOffset);
        //}

        public static DateTimeParam ConvertStringToDateTimeParam(long dateTime)
        {
            return new DateTimeParam(new DateTime(dateTime));
        }

        public static DateTime ConvertLongToDateTime(long dateTime)
        {
            return new DateTime(dateTime);
        }

        //static CryptLib _cryptLib = new CryptLib();
        //public static string DecryptData(string data, string secretKey)
        //{
        //    try
        //    {
        //        return _cryptLib.decrypt(data.Replace("\\/", "/"), CryptLib.getHashSha256(secretKey, 32), "1234567887654321");
        //    }
        //    catch
        //    {
        //        //MessageBox.Show("Lỗi mã hóa dữ liệu");
        //        return "";
        //    }
        //}
    }
}