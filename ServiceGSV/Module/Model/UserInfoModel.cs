using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServiceGSV.Module.Model
{
    public class ProductCategoryModel
    {
        public ProductCategory ProductCategory { get; set; }

        public enum Select
        {
            ProductCategory,
        }

        public enum Sort
        {
            ProductCategory,
        }
    }
}