namespace pos_system.ViewModels
{
    public class TransactionViewModel
    {
        public decimal SubTotal { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public required List<TransactionDetailViewModel> Details { get; set; }
    }

    public class TransactionDetailViewModel
    {
        public int ProductId { get; set; }
        public required string ProductName { get; set; }
        public decimal ProductSubtotal { get; set; }
        public int Quantity { get; set; }
    }
}
