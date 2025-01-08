using Microsoft.EntityFrameworkCore;

namespace pos_system.Models
{
    public class IMDbContext : DbContext
    {
        public IMDbContext(DbContextOptions<IMDbContext> options) : base(options) {}

        public required DbSet<Employee> Employees { get; set; }
        public required DbSet<Product> Products { get; set; }
    }
}
