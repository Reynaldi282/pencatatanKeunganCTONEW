import 'package:finance_app/domain/entities/category.dart';

class CategoryModel {
  const CategoryModel({
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

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] as String,
      name: json['name'] as String,
      type: _categoryTypeFromString(json['type'] as String),
      icon: json['icon'] as String?,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'type': type.name,
      'icon': icon,
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toDatabaseMap() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'type': type.name,
      'icon': icon,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory CategoryModel.fromDatabaseMap(Map<String, dynamic> map) {
    return CategoryModel(
      id: map['id'] as String,
      name: map['name'] as String,
      type: _categoryTypeFromString(map['type'] as String),
      icon: map['icon'] as String?,
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at'] as int),
    );
  }

  Category toEntity() {
    return Category(
      id: id,
      name: name,
      type: type,
      icon: icon,
      updatedAt: updatedAt,
    );
  }

  factory CategoryModel.fromEntity(Category category) {
    return CategoryModel(
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.icon,
      updatedAt: category.updatedAt,
    );
  }

  static CategoryType _categoryTypeFromString(String value) {
    return CategoryType.values.firstWhere(
      (element) => element.name == value,
      orElse: () => CategoryType.expense,
    );
  }
}
