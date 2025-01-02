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
        
        // Navigation Property: TransactionDetails associated with this transaction
        public required ICollection<TransactionDetails> TransactionDetails { get; set; }
    }

}
