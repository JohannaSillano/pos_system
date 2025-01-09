using Microsoft.AspNetCore.Mvc;
using pos_system.Models;
using System.Text.Json;
using System.Text;


namespace pos_system.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IMDbContext _context;

        public HomeController(ILogger<HomeController> logger, IMDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            var ProductList = _context.Products.Where(p => p.StockQuantity > 0).ToList();
            return View(ProductList);
        }

        // Fetch product in search bar using GET
        [HttpGet]
        public JsonResult searchProduct(string productQuery)
        {
            if (string.IsNullOrEmpty(productQuery))
            {
                var ProductList = _context.Products
                    .Where(p => !p.IsDeleted && p.StockQuantity > 0)
                    .Select(p => new { p.Id, p.Name, p.Price, p.StockQuantity })
                    .ToList();
                return Json(ProductList); // Return all products
            }
            else
            {
                var matchingProducts = _context.Products
                    .Where(p => !p.IsDeleted && p.StockQuantity > 0 && p.Name.ToLower().Contains(productQuery.ToLower()))
                    .Select(p => new { p.Id, p.Name, p.Price, p.StockQuantity })
                    .ToList();
                return Json(matchingProducts); // Return matching products
            }
        }
    }
}

