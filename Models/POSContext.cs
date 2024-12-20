using Microsoft.EntityFrameworkCore;

namespace pos_system.Models
{
    public class POSContext : DbContext
    {
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionDetails> TransactionDetails { get; set; }

        public POSContext(DbContextOptions<POSContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure decimal precision to avoid truncation warnings
            modelBuilder.Entity<Transaction>()
                .Property(t => t.TotalAmount)
                .HasPrecision(18, 2); // Adjust precision as needed

            modelBuilder.Entity<TransactionDetails>()
                .Property(td => td.Amount)
                .HasPrecision(18, 2); // Adjust precision as needed

            // Configure relationships between Transaction and TransactionDetails
            modelBuilder.Entity<TransactionDetails>()
                .HasOne(td => td.Transaction) // Many-to-One relationship
                .WithMany(t => t.TransactionDetails) // One-to-Many relationship
                .HasForeignKey(td => td.TransactionId); // Foreign key on TransactionDetails

            base.OnModelCreating(modelBuilder); // Properly placed
        }
    }
}