using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pos_system.Models;  // Your model's namespace

namespace pos_system.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly POSContext _context;

        // Constructor to inject the database context
        public TransactionsController(POSContext context)
        {
            _context = context;
        }

        // GET: Transactions - Displays a list of all transactions
        public IActionResult Index()
        {
            // Retrieve all transactions from the database
            var transactions = _context.Transactions.ToList();

            // Return the view with the list of transactions
            return View(transactions);
        }
    }
}
