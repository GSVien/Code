using System;
using System.Configuration;
using System.Dynamic;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;

namespace TeenIdol.Controllers
{
    public class AppController : Controller
    {
        public ActionResult Index()
        {
            //return Redirect("https://teenidol.vn");

            if (!Request.IsLocal && !Request.IsSecureConnection)
            {
                string redirectUrl = Request.Url.ToString().Replace("http:", "https:");
                Response.Redirect(redirectUrl, false);
                HttpContext.ApplicationInstance.CompleteRequest();
            }

            var path = Request.Path.ToLower();

            return View("~/Layouts/_layout.cshtml");
        }
    }
}