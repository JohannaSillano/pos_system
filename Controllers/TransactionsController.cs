using Microsoft.AspNetCore.Mvc;
using pos_system.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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

                // Pass the transactions to the view
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
