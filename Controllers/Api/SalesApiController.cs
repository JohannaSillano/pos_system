using Microsoft.AspNetCore.Mvc;
using pos_system.Models;

namespace pos_system.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SalesApiController : ControllerBase
    {
        private readonly ILogger<SalesApiController> _logger;
        private readonly POSDbContext _posDbContext;
        private readonly IMDbContext _imDbContext;

        // Modify the constructor to accept ILogger
        public SalesApiController(ILogger<SalesApiController> logger, POSDbContext posDbContext, IMDbContext imDbContext)
        {
            _logger = logger;
            _posDbContext = posDbContext;
            _imDbContext = imDbContext;
        }

        [HttpGet]
        public IActionResult GetTransactionDetailsWithProducts()
        {
            // Fetch data from the POS database
            var transactions = (from t in _posDbContext.Transactions
                                join td in _posDbContext.TransactionDetails on t.Id equals td.TransactionId
                                select new
                                {
                                    t.TransactionNumber,
                                    t.TransactionDate,
                                    td.TransactionId,
                                    td.Id,
                                    td.Quantity,
                                    td.Amount,
                                    ProductId = td.ProductId
                                }).ToList();

            // Fetch product and category data from the Inventory database
            var productIds = transactions.Select(t => t.ProductId).Distinct().ToList();
            var products = _imDbContext.Products
                .Where(p => productIds.Contains(p.Id))
                .Select(p => new { p.Id, p.Name, p.Category }) // Assuming Category is a field in Products table
                .ToDictionary(p => p.Id, p => new { p.Name, p.Category });

            // Combine the data in memory and calculate the total sales, distinct products, and distinct categories
            var result = transactions.Select(t => new
            {
                t.TransactionNumber,
                t.TransactionDate,
                t.TransactionId,
                t.Id,
                t.Quantity,
                t.Amount,
                ProductName = products.ContainsKey(t.ProductId) ? products[t.ProductId].Name : "Unknown",
                ProductCategory = products.ContainsKey(t.ProductId) ? products[t.ProductId].Category : "Unknown"
            }).ToList();

            // Calculate total sold (sum of all quantities)
            var soldProducts = result.Sum(r => r.Quantity);

            // Calculate total sales (sum of all amount)
            var totalSales = result.Sum(r => r.Amount);

            // Calculate total distinct products and categories
            var distinctProducts = result.Select(r => r.ProductName).Distinct().Count();

            // Check if no data was found
            if (!result.Any())
            {
                return Ok(new { success = false, message = "No transactions found." });
            }

            // Return the data along with the total sales, distinct products, and distinct categories
            return Ok(new 
            {
                success = true, 
                Transactions = result, 
                TotalSoldProducts = soldProducts,
                TotalSales = totalSales,
                TotalDistinctProducts = distinctProducts,
            });
        }
    }
}