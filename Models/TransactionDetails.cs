using System;
namespace pos_system.Models
{
    public class TransactionDetails
    {
        public int Id { get; set; }

        // Foreign Key to the Transaction (Mandatory)
        public int TransactionId { get; set; }  // Non-nullable, making this field mandatory

        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Amount { get; set; }

        // Navigation property to represent the "many" side of the relationship
        public Transaction Transaction { get; set; }  // Navigation property for the related Transaction
        //public Product Product { get; set; }


        // Constructor to initialize the Transaction property
        public TransactionDetails()
        {
            Transaction = new Transaction();
        }
    }
}