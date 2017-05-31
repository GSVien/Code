using System.Web.Mvc;
using System.Web.Routing;

namespace TeenIdol
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "MVC Controller",
                url: "App/{action}",
                defaults: new { controller = "App" }
            );

            routes.MapRoute(
                name: "Angular Controller",
                url: "{*.}",
                defaults: new { controller = "App", action = "Index" }
            );
        }
    }
}
