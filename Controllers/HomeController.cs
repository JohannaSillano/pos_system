using Microsoft.AspNetCore.Mvc;
using pos_system.Models;
using System.Text.Json;
using System.Text;


namespace pos_system.Controllers
{
    public class HomeController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly POSDbContext _context;

        public HomeController(HttpClient httpClient, POSDbContext context)
        {
            _httpClient = httpClient;
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            try
            {
                // Fetch all products initially
                var response = await _httpClient.GetAsync("http://localhost:5263/api/ProductsApi/GetAllProducts");

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var products = JsonSerializer.Deserialize<List<Product>>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    ViewBag.Products = products;
                }
                else
                {
                    ViewBag.Products = null;
                    ViewBag.Error = "Failed to fetch products from the Inventory API.";
                }
            }
            catch (Exception ex)
            {
                ViewBag.Products = null;
                ViewBag.Error = $"An error occurred: {ex.Message}";
            }

            return View();
        }

        public async Task<IActionResult> SearchProducts(string query)
        {
            try
            {
                // Fetch products based on search query
                var response = await _httpClient.GetAsync($"http://localhost:5263/api/ProductsApi/SearchProducts?query={query}");

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var products = JsonSerializer.Deserialize<List<Product>>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return Json(products); // Return products as JSON
                }
                else
                {
                    return Json(new { error = "No products found." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        // Fetch all products when the searchbar is empty and return as json format
        public async Task<IActionResult> EmptySearchBar()
        {
            try
            {
                // Fetch all products
                var response = await _httpClient.GetAsync("http://localhost:5263/api/ProductsApi/GetAllProducts");

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var products = JsonSerializer.Deserialize<List<Product>>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return Json(products); // Return all products as JSON
                }
                else
                {
                    return Json(new { error = "Failed to fetch products from the Inventory API." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        public IActionResult Transactions()
        {
            return View();
        }
    }
}

