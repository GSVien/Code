using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceModel.Web;
using System.Text;
using TFLLib;
using TFLLib.DAOCore;

namespace ServiceGSV.Helper
{
    public class ResultHelper
    {
        public static Stream Json(string json)
        {
            if (WebOperationContext.Current != null)
                WebOperationContext.Current.OutgoingResponse.ContentType = "application/json; charset=utf-8";
            return new MemoryStream(Encoding.UTF8.GetBytes(json));
        }

        public static Stream Error(int errorCode, string message)
        {
            return Json(new { ErrorCode = errorCode, Message = message }.ToJson("*"));
        }

        public static Stream Error(DoResult result)
        {
            return Json(new { ErrorCode = result.ErrorCode, Message = result.Message }.ToJson("*"));
        }

        public static List<T> Shuffle<T>(List<T> list, Random rng)
        {
            if(list == null) return null;
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
            return list;
        }
    }
}