import 'package:finance_app/domain/entities/transaction.dart';

class TransactionModel {
  const TransactionModel({
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

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] as String,
      categoryId: json['categoryId'] as String,
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      occurredAt: DateTime.parse(json['occurredAt'] as String),
      description: json['description'] as String?,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'categoryId': categoryId,
      'amount': amount,
      'currency': currency,
      'occurredAt': occurredAt.toIso8601String(),
      'description': description,
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toDatabaseMap() {
    return <String, dynamic>{
      'id': id,
      'category_id': categoryId,
      'amount': amount,
      'currency': currency,
      'occurred_at': occurredAt.millisecondsSinceEpoch,
      'description': description,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory TransactionModel.fromDatabaseMap(Map<String, dynamic> map) {
    return TransactionModel(
      id: map['id'] as String,
      categoryId: map['category_id'] as String,
      amount: (map['amount'] as num).toDouble(),
      currency: map['currency'] as String,
      occurredAt: DateTime.fromMillisecondsSinceEpoch(map['occurred_at'] as int),
      description: map['description'] as String?,
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at'] as int),
    );
  }

  TransactionEntity toEntity() {
    return TransactionEntity(
      id: id,
      categoryId: categoryId,
      amount: amount,
      currency: currency,
      occurredAt: occurredAt,
      description: description,
      updatedAt: updatedAt,
    );
  }

  factory TransactionModel.fromEntity(TransactionEntity entity) {
    return TransactionModel(
      id: entity.id,
      categoryId: entity.categoryId,
      amount: entity.amount,
      currency: entity.currency,
      occurredAt: entity.occurredAt,
      description: entity.description,
      updatedAt: entity.updatedAt,
    );
  }
}
