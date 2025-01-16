using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;  // Ensure this is here for ICollection
namespace pos_system.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public required string TransactionNumber { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public int EmployeeId { get; set; }

        // Navigation property to represent the "one" side of the relationship
        [JsonIgnore]  // Prevents a loop when serializing to JSON
        public ICollection<TransactionDetails> TransactionDetails { get; set; }

        public Transaction()
        {
            TransactionDetails = new List<TransactionDetails>();
        }
    }
}