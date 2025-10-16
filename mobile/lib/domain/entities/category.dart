enum CategoryType { income, expense }

class Category {
  const Category({
    required this.id,
    required this.name,
    required this.type,
    this.icon,
    required this.updatedAt,
  });

  final String id;
  final String name;
  final CategoryType type;
  final String? icon;
  final DateTime updatedAt;
}
