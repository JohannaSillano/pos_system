using System;

namespace pos_system.Models
{
    public class TransactionDetails
    {
        public int Id { get; set; }

        // Foreign Key to the Transaction (Mandatory)
        public int TransactionId { get; set; }
        
        // Foreign Key to Product (Mandatory)
        public int ProductId { get; set; }
        public required string ProductName { get; set; }

        public int Quantity { get; set; }
        public decimal Amount { get; set; }
        
        // Navigation Property to Transaction
        public required Transaction Transaction { get; set; }
    }

}
