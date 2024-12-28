using System;
namespace pos_system.Models
{
    public class TransactionDetails
    {
        public int Id { get; set; }

        // Foreign Key to the Transaction (Mandatory)
        public int TransactionId { get; set; }  // Non-nullable, making this field mandatory

        // Foregin Key from IM Database
        public int ProductId { get; set; }

        public string? ProductName { get; set; }
        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }

        // Navigation property to represent the "many" side of the relationship
        public Transaction Transaction { get; set; }  // Navigation property for the related Transaction

        // Constructor to initialize the Transaction property
        public TransactionDetails()
        {
            Transaction = new Transaction();
        }
    }
}