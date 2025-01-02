using Microsoft.EntityFrameworkCore;

namespace pos_system.Models
{
    public class POSContext : DbContext
    {
        public required DbSet<Transaction> Transactions { get; set; }
        public required DbSet<TransactionDetails> TransactionDetails { get; set; }
        public required DbSet<User> Users { get; set; }

        public POSContext(DbContextOptions<POSContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Explicitly define the column type and precision for SubTotal, Tax, and TotalAmount
            modelBuilder.Entity<Transaction>()
                .Property(t => t.Subtotal)
                .HasColumnType("decimal(18,2)") // Define the column type with precision and scale
                .HasPrecision(18, 2); // Define the precision and scale for SubTotal

            modelBuilder.Entity<Transaction>()
                .Property(t => t.Tax)
                .HasColumnType("decimal(18,2)") // Define the column type with precision and scale
                .HasPrecision(18, 2); // Define the precision and scale for Tax

            modelBuilder.Entity<Transaction>()
                .Property(t => t.TotalAmount)
                .HasColumnType("decimal(18,2)") // Define the column type with precision and scale
                .HasPrecision(18, 2); // Define the precision and scale for TotalAmount

            modelBuilder.Entity<TransactionDetails>()
                .Property(td => td.Amount)
                .HasColumnType("decimal(18,2)") // Define the column type with precision and scale
                .HasPrecision(18, 2); // Define the precision and scale for UnitPrice

            // Configure relationships between Transaction and TransactionDetails
            modelBuilder.Entity<TransactionDetails>()
                .HasOne(td => td.Transaction) // Many-to-One relationship
                .WithMany(t => t.TransactionDetails) // One-to-Many relationship
                .HasForeignKey(td => td.TransactionId); // Foreign key on TransactionDetails

            base.OnModelCreating(modelBuilder); // Ensure any other configuration is applied
        }
    }
}
