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
                // Call the Inventory System API
                var response = await _httpClient.GetAsync("http://localhost:5263/api/productsapi/getallproducts");

                if (response.IsSuccessStatusCode)
                {
                    // Deserialize the response JSON into a list of Product models
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var products = JsonSerializer.Deserialize<List<Product>>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true // Handle case-insensitive property matching
                    });

                    // Pass the products to the view
                    ViewBag.Products = products;
                }
                else
                {
                    // Handle failure (e.g., log the error or return an error message)
                    ViewBag.Products = null;
                    ViewBag.Error = "Failed to fetch products from the Inventory API.";
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., network issues)
                ViewBag.Products = null;
                ViewBag.Error = $"An error occurred: {ex.Message}";
            }

            return View();
        }
    }
}
