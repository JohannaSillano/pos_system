using System;
using System.Collections.Generic;

namespace pos_system.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }

        public decimal Subtotal { get; set; }

        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }

        // Navigation property to represent the "one" side of the relationship
        public ICollection<TransactionDetails> TransactionDetails { get; set; }

        public Transaction()
        {
            TransactionDetails = new List<TransactionDetails>();  // Ensures the collection is never null
        }
    }
}
