using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pos_system.Models;
using pos_system.ViewModels;
using System.Linq;

namespace pos_system.Controllers
{
    public class InvoiceController : Controller
    {
        private readonly ILogger<InvoiceController> _logger;
        private readonly POSDbContext _posDbContext;
        private readonly IMDbContext _imDbContext;

        public InvoiceController(ILogger<InvoiceController> logger, POSDbContext posDbContext, IMDbContext imDbContext)
        {
            _logger = logger;
            _posDbContext = posDbContext;
            _imDbContext = imDbContext;
        }
        public IActionResult Invoice(int transactionId)
        {
            // Retrieve the transaction
            var transaction = _posDbContext.Transactions
                .Include(t => t.TransactionDetails)
                .FirstOrDefault(t => t.Id == transactionId);

            if (transaction == null)
            {
                return NotFound("Transaction not found.");
            }

            // Retrieve the employee who processed the transaction
            var employee = _imDbContext.Employees.FirstOrDefault(e => e.Id == transaction.EmployeeId);

            // Map transaction data to ViewModel
            var invoiceDetails = new TransactionDetailsViewModel
            {
                TransactionNumber = transaction.TransactionNumber,
                CashierName = employee != null ? $"{employee.FirstName} {employee.LastName}" : "Unknown",
                TransactionDate = transaction.TransactionDate,
                Subtotal = transaction.Subtotal,
                Tax = transaction.Tax,
                TotalAmount = transaction.TotalAmount,
                Products = transaction.TransactionDetails.Select(td =>
                {
                    var product = _imDbContext.Products.FirstOrDefault(p => p.Id == td.ProductId); // Fetch product inside the loop
                    return new ProductViewModel
                    {
                        Name = product != null ? product.Name : "Unknown",
                        Quantity = td.Quantity,
                        Amount = td.Amount
                    };
                }).ToList()
            };

            // Pass the ViewModel to the view
            return View(invoiceDetails);
        }
    }
}
