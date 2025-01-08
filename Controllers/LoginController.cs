using Microsoft.AspNetCore.Mvc;
using pos_system.Models;

namespace pos_system.Controllers
{
    public class LoginController : Controller
    {
        private readonly IMDbContext _imsDbContext;
        public LoginController(IMDbContext imsDbContext)
        {
            _imsDbContext = imsDbContext;
        }

        // Login Action
        public IActionResult Login()
        {
            return View(); // Return Login.cshtml
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(string email, string password)
        {
            // Query the IMSDB for user authentication
            var user = _imsDbContext.Users.FirstOrDefault(u => u.Email == email && u.Password == password);

            if (user != null && user.Role == "Cashier")
            {
                // Store user details in session
                HttpContext.Session.SetString("UserId", user.Id.ToString());
                HttpContext.Session.SetString("UserFullName", user.FullName);

                // Redirect to the POS dashboard
                return RedirectToAction("Index", "Home");
            }

            // If login fails or user is not a cashier
            ViewBag.ErrorMessage = user == null ? "Invalid email or password." : "Access denied. Only cashiers can log in.";
            return View("Login");
        }
    }
}

