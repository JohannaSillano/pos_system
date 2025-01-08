using Microsoft.EntityFrameworkCore;

namespace pos_system.Models
{
    public class IMDbContext : DbContext
    {
        public IMDbContext(DbContextOptions<IMDbContext> options) : base(options) {}

        public required DbSet<User> Users { get; set; }
        public required DbSet<Product> Products { get; set; }
    }
}
