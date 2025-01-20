using Microsoft.AspNetCore.Mvc;
using pos_system.Models;
using System.Text.Json;
using System.Text;


namespace pos_system.Controllers
{
    public class HomeController(ILogger<HomeController> logger, IMDbContext imDBContext, POSDbContext posDBContext) : Controller
    {
        private readonly ILogger<HomeController> _logger = logger;
        private readonly IMDbContext _imDBContext = imDBContext;
        private readonly POSDbContext _posDBContext = posDBContext;

        public IActionResult Index()
        {
            // Retrieve employee ID from the session
            var userId = HttpContext.Session.GetInt32("UserId");

            // Pass the userId to the view using ViewBag
            ViewBag.UserId = userId;

            // Fetch list of products
            var ProductList = _imDBContext.Products.Where(p => p.StockQuantity > 0).ToList();
            return View(ProductList);
        }

        // Fetch product in search bar using GET
        [HttpGet]
        public JsonResult SearchProduct(string productQuery)
        {
            if (string.IsNullOrEmpty(productQuery))
            {
                var ProductList = _imDBContext.Products
                    .Where(p => !p.IsDeleted && p.StockQuantity > 0)
                    .Select(p => new { p.Id, p.Name, p.Price, p.StockQuantity })
                    .ToList();
                return Json(ProductList); // Return all products
            }
            else
            {
                var matchingProducts = _imDBContext.Products
                    .Where(p => !p.IsDeleted && p.StockQuantity > 0 && p.Name.ToLower().Contains(productQuery.ToLower()))
                    .Select(p => new { p.Id, p.Name, p.Price, p.StockQuantity })
                    .ToList();
                return Json(matchingProducts); // Return matching products
            }
        }
    }
}

