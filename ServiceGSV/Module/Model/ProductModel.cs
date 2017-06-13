using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServiceGSV.Module.Model
{
    public class ProductModel
    {
        public Product Product { get; set; }
        public UserInfo UserInfo { get; set; }
        public Province Province { get; set; }
        public District District { get; set; }
        public ProductCategory ProductCategory { get; set; }
        public enum Select
        {
            Product,
            UserInfo,
            Province,
            District,
            ProductCategory
        }

        public enum Sort
        {
            Product,
        }
    }
}