using System.Linq;
using System.Net;
using System.Text;


namespace TeenIdol
{
    public static class Helper
    {
        #region [Field]

        private static string _apiHost = "http://localhost:54895/Service1.svc/";

        #endregion

        //public static dynamic ApiGet(string name, object parameters = null)
        //{
        //    using (var wc = new WebClient { Encoding = Encoding.UTF8 })
        //    {
        //        var param = parameters == null ? "" : "?" + string.Join("&", parameters.ToDict().Select(x => x.Key + "=" + x.Value));
        //        var r = wc.DownloadString(_apiHost + name + param);
        //        return JObject.Parse(r);
        //    }
        //}

        //public static dynamic ApiPost(string name, object parameters = null)
        //{
        //    using (var wc = new WebClient { Encoding = Encoding.UTF8, Headers = {[HttpRequestHeader.ContentType] = "application/json" } })
        //    {
        //        var param = parameters == null ? "" : parameters.ToJson();
        //        var r = wc.UploadString(_apiHost + name, param);
        //        return JObject.Parse(r);
        //    }
        //}
    }
}