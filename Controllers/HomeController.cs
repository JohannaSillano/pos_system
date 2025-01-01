using Microsoft.AspNetCore.Mvc;
using pos_system.Models;
using System.Text.Json;
using System.Text;
using pos_system.ViewModels;


namespace pos_system.Controllers
{
    public class HomeController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly POSContext _context;

        public HomeController(HttpClient httpClient, POSContext context)
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

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionViewModel viewModel)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Step 1: Create the Transaction
                var newTransaction = new Transaction
                {
                    TransactionDate = DateTime.Now,
                    SubTotal = viewModel.SubTotal,
                    Tax = viewModel.Tax,
                    TotalAmount = viewModel.TotalAmount
                };

                _context.Transactions.Add(newTransaction);
                await _context.SaveChangesAsync();

                // Step 2: Create TransactionDetails
                var transactionDetails = viewModel.Details.Select(detail => new TransactionDetails
                {
                    TransactionId = newTransaction.Id, // Use the newly created Transaction's ID
                    ProductId = detail.ProductId,
                    ProductName = detail.ProductName,
                    ProductSubtotal = detail.ProductSubtotal,
                    Quantity = detail.Quantity
                }).ToList();

                _context.TransactionDetails.AddRange(transactionDetails);
                await _context.SaveChangesAsync();

                // Step 3: Update Stock in Inventory System
                foreach (var detail in transactionDetails)
                {
                    var stockUpdateRequest = new
                    {
                        Id = detail.ProductId,
                        StockQuantity = -detail.Quantity
                    };

                    var content = new StringContent(JsonSerializer.Serialize(stockUpdateRequest), Encoding.UTF8, "application/json");
                    var response = await _httpClient.PostAsync("http://localhost:5263/api/productsapi/updateproductstock", content);

                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception($"Failed to update stock for Product ID {detail.ProductId}");
                    }
                }

                // Step 4: Commit Transaction
                await transaction.CommitAsync();

                return Ok(new { Message = "Transaction created and stock updated successfully!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { Error = $"An error occurred: {ex.Message}" });
            }
        }

        public IActionResult Transactions()
        {
            return View();
        }
    }
}
