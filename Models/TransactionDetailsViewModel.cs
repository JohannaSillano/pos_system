namespace pos_system.ViewModels
{
    public class TransactionDetailsViewModel
    {
        public required string TransactionNumber { get; set; }
        public required string CashierName { get; set; }
        public DateTime TransactionDate { get; set; }
        public required List<ProductViewModel> Products { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class ProductViewModel
    {
        public required string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Amount { get; set; }
    }
}
