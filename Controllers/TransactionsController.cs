using Microsoft.AspNetCore.Mvc;
using pos_system.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Text.Json;

namespace pos_system.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly POSDbContext _context;

        public TransactionsController(POSDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Transactions()
        {
            try
            {
                // Fetch the transactions with their related details
                var transactions = await _context.Transactions
                    .Include(t => t.TransactionDetails)
                    .OrderByDescending(t => t.TransactionDate) // Optionally order by date
                    .ToListAsync();

                // If you want to return the data as JSON, handle circular references like this:
                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve,
                    MaxDepth = 32 // Optional: Adjust depth if necessary
                };

                // Serialize the transactions with circular reference handling
                var jsonResponse = JsonSerializer.Serialize(transactions, options);

                // You can either return JSON in a separate endpoint, or send as a response:
                //return Content(jsonResponse, "application/json");

                // If you're rendering a view, continue as normal:
                return View(transactions);
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., database issues)
                ViewBag.Error = "An error occurred while fetching transactions: " + ex.Message;
                return View();
            }
        }
    }
}
