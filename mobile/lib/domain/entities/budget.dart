class Budget {
  const Budget({
    required this.id,
    required this.categoryId,
    required this.limit,
    required this.periodStart,
    required this.periodEnd,
    required this.updatedAt,
  });

  final String id;
  final String categoryId;
  final double limit;
  final DateTime periodStart;
  final DateTime periodEnd;
  final DateTime updatedAt;
}
