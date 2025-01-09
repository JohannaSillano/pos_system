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
        public IActionResult Invoice()
        {
            return View();
        }
    }
}
