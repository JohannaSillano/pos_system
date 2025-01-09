using Microsoft.AspNetCore.Mvc;
using pos_system.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Text.Json;
using System.Transactions;

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

        // Create transaction in the database using POST method
        [HttpPost]
        public async Task<IActionResult> PostTransaction([FromBody] Models.Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest(new { message = "Invalid model state.", errors });
            }

            using (var transactionScope = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Save the transaction to the database
                    _context.Transactions.Add(transaction);
                    await _context.SaveChangesAsync();

                    // Commit the database transaction
                    await transactionScope.CommitAsync();
                    return Ok(new { message = "Transaction successfully processed." });
                }
                catch (Exception ex)
                {
                    await transactionScope.RollbackAsync();
                    return StatusCode(500, new { message = "An error occurred while processing the transaction.", details = ex.Message });
                }
            }
        }
    }
}
