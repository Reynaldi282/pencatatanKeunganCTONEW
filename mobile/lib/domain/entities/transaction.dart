class TransactionEntity {
  const TransactionEntity({
    required this.id,
    required this.categoryId,
    required this.amount,
    required this.currency,
    required this.occurredAt,
    this.description,
    required this.updatedAt,
  });

  final String id;
  final String categoryId;
  final double amount;
  final String currency;
  final DateTime occurredAt;
  final String? description;
  final DateTime updatedAt;
}
