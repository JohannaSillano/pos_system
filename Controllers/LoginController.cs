using Microsoft.AspNetCore.Mvc;
using pos_system.Models;

namespace pos_system.Controllers
{
    public class LoginController : Controller
    {
        private readonly POSContext _context;

        public LoginController(POSContext context)
        {
            _context = context;
        }
        
        // Login Action
        public IActionResult Login()
        {
            return View(); // Return Login.cshtml
        }

        // POST: Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(string Email, string Password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == Email && u.Password == Password);
            if (user != null)
            {
                HttpContext.Session.SetString("UserId", user.Id.ToString());
                HttpContext.Session.SetString("UserFullName", user.Name);
                return RedirectToAction("Index", "Home");
            }
            
            ViewBag.ErrorMessage = "Invalid email or password";
            return View("Login");
        }

        // Other actions related to login, e.g., ForgotPassword
    }
}
