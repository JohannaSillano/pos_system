using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pos_system.Models;

namespace pos_system.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly POSDbContext _posDbContext;
        private readonly IMDbContext _imDbContext;

        // Modify the constructor to accept ILogger
        public TransactionsController(ILogger<HomeController> logger, POSDbContext posDbContext, IMDbContext imDbContext)
        {
            _logger = logger;
            _posDbContext = posDbContext;
            _imDbContext = imDbContext;
        }

        // GET: Transactions
        public async Task<IActionResult> Transactions()
        {
            var transactions = await _posDbContext.Transactions
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return View(transactions); // Render a view with a list of transactions
        }
        
        public IActionResult GetTransactionDetails(int transactionId)
        {
            var transaction = _posDbContext.Transactions
                .Include(t => t.TransactionDetails)
                .FirstOrDefault(t => t.Id == transactionId);

            if (transaction == null)
            {
                return Json(new { success = false, message = "Transaction not found." });
            }

            // Retrieve the employee who processed the transaction
            var employee = _imDbContext.Employees.FirstOrDefault(e => e.Id == transaction.EmployeeId);

            // Prepare the result object that will be returned as JSON
            var result = new
            {
                success = true,
                TransactionNumber = transaction.TransactionNumber,
                Cashier = employee != null ? $"{employee.FirstName} {employee.LastName}" : "Unknown",
                TransactionDate = transaction.TransactionDate,
                Subtotal = transaction.Subtotal,
                Tax = transaction.Tax,
                TotalAmount = transaction.TotalAmount,
                Products = transaction.TransactionDetails.Select(td => 
                {
                    var product = _imDbContext.Products.FirstOrDefault(p => p.Id == td.ProductId); // Fetch product inside the loop
                    return new
                    {
                        ProductName = product != null ? product.Name : "Unknown",
                        td.Quantity,
                        td.Amount
                    };
                }).ToList() // Ensures Products is a list of simple data
            };
            return Json(result);
        }

        // Create Transaction in the database of POS
        [HttpPost]
        public IActionResult PostTransaction([FromBody] Models.Transaction transaction)
        {
            if (ModelState.IsValid)
            {
                // Add the transaction record to the database of POS and save the changes to the database.
                _posDbContext.Transactions.Add(transaction);
                _posDbContext.SaveChanges();

                // Get the ID of the newly added transaction
                int lastTransactionId = transaction.Id;

                return Ok(new{
                    message = "Transaction successfully processed.",
                    transactionId = lastTransactionId
                });
            }

            return BadRequest(new {
                message = "Invalid transaction data."
            });
        }

        // Create transaction details in the database of POS
        [HttpPost]
        public IActionResult PostTransactionDetails([FromBody] List<TransactionDetails> transactionDetailsList)
        {
            if (ModelState.IsValid)
            {
                // Add the transaction record to the database of POS and save the changes to the database.
                _posDbContext.TransactionDetails.AddRange(transactionDetailsList);
                _posDbContext.SaveChanges();

                // Group the transaction details by ProductId and calculate the total quantity for each product
                var productQuantities = transactionDetailsList
                    .GroupBy(td => td.ProductId) // Group by the ProductId to create groups for each product
                    .Select(g => new { ProductId = g.Key, TotalQuantity = g.Sum(td => td.Quantity) }); // For each group, create a new object containing the ProductId and the total quantity sold

                // Iterate over the grouped products and update their quantities in the database of IMS
                foreach (var pq in productQuantities)
                {
                    var product = _imDbContext.Products.FirstOrDefault(p => p.Id == pq.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity -= pq.TotalQuantity;
                    }
                }
                _imDbContext.SaveChanges(); // Save the changes to the database of IMS to reflect the updated inventory

                return Ok(new
                {
                    message = "Transaction details successfully processed."
                });
            }

            return BadRequest(new
            {
                message = "Invalid transaction details data."
            });
        }
    }
}
