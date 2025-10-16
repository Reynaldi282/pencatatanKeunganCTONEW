import 'package:finance_app/domain/entities/budget.dart';

class BudgetModel {
  const BudgetModel({
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

  factory BudgetModel.fromJson(Map<String, dynamic> json) {
    return BudgetModel(
      id: json['id'] as String,
      categoryId: json['categoryId'] as String,
      limit: (json['limit'] as num).toDouble(),
      periodStart: DateTime.parse(json['periodStart'] as String),
      periodEnd: DateTime.parse(json['periodEnd'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'categoryId': categoryId,
      'limit': limit,
      'periodStart': periodStart.toIso8601String(),
      'periodEnd': periodEnd.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toDatabaseMap() {
    return <String, dynamic>{
      'id': id,
      'category_id': categoryId,
      'limit': limit,
      'period_start': periodStart.millisecondsSinceEpoch,
      'period_end': periodEnd.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory BudgetModel.fromDatabaseMap(Map<String, dynamic> map) {
    return BudgetModel(
      id: map['id'] as String,
      categoryId: map['category_id'] as String,
      limit: (map['limit'] as num).toDouble(),
      periodStart: DateTime.fromMillisecondsSinceEpoch(map['period_start'] as int),
      periodEnd: DateTime.fromMillisecondsSinceEpoch(map['period_end'] as int),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at'] as int),
    );
  }

  Budget toEntity() {
    return Budget(
      id: id,
      categoryId: categoryId,
      limit: limit,
      periodStart: periodStart,
      periodEnd: periodEnd,
      updatedAt: updatedAt,
    );
  }

  factory BudgetModel.fromEntity(Budget budget) {
    return BudgetModel(
      id: budget.id,
      categoryId: budget.categoryId,
      limit: budget.limit,
      periodStart: budget.periodStart,
      periodEnd: budget.periodEnd,
      updatedAt: budget.updatedAt,
    );
  }
}
