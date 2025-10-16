import 'package:sqflite/sqflite.dart';

import 'package:finance_app/core/database/app_database.dart';
import 'package:finance_app/data/models/category_model.dart';

class CategoryDao {
  CategoryDao(this._appDatabase);

  final AppDatabase _appDatabase;

  static const _table = 'categories';

  Future<void> upsertAll(List<CategoryModel> categories) async {
    final db = await _appDatabase.database;
    final batch = db.batch();
    for (final category in categories) {
      batch.insert(
        _table,
        category.toDatabaseMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    await batch.commit(noResult: true);
  }

  Future<List<CategoryModel>> getAll() async {
    final db = await _appDatabase.database;
    final maps = await db.query(_table);
    return maps.map(CategoryModel.fromDatabaseMap).toList();
  }

  Future<void> deleteAll() async {
    final db = await _appDatabase.database;
    await db.delete(_table);
  }
}
