using System;
using System.Collections.Generic;  // Ensure this is here for ICollection
namespace pos_system.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TotalAmount { get; set; }

        // Navigation property to represent the "one" side of the relationship
        public ICollection<TransactionDetails> TransactionDetails { get; set; }

        public Transaction()
        {
            TransactionDetails = new List<TransactionDetails>();
        }
    }
}