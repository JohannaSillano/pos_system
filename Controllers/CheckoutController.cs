using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using pos_system.Models;

namespace pos_system.Controllers;

public class CheckoutController : Controller
{
    // Action to load the Payment page
    public IActionResult Payment()
    {
        return View();
    }

    public IActionResult Transactiohs()
    {
        return View();
    }

    // Action to load the Transactions page (after payment)
    public IActionResult Transactions()
    {
        return View();
    }
}