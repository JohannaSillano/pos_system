using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pos_system.Models;
using pos_system.ViewModels;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json; // Make sure to include the Newtonsoft.Json namespace

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
    }
}
