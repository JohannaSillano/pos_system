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
            var employee = _imsDbContext.Employees.FirstOrDefault(u => u.Email == email && u.Password == password);

            if (employee != null && employee.Role == "Cashier")
            {
                // Store user details in session
                HttpContext.Session.SetInt32("UserId", employee.Id);
                HttpContext.Session.SetString("UserFullName", employee.FirstName);
                HttpContext.Session.SetString("UserFullName", employee.LastName);
                
                // Redirect to the POS dashboard
                return RedirectToAction("Index", "Home");
            }

            // If login fails or user is not a cashier
            ViewBag.ErrorMessage = employee == null ? "Invalid email or password." : "Access denied. Only cashiers can log in.";
            return View("Login");
        }

        [HttpPost]
        public IActionResult Logout()
        {
            // Clear the session to log the user out
            HttpContext.Session.Clear();

            // Redirect to the home page or login page after logout
            return RedirectToAction("Login", "Login");
        }
    }
}

