import 'package:sqflite/sqflite.dart';

import 'package:finance_app/core/database/app_database.dart';
import 'package:finance_app/data/models/budget_model.dart';

class BudgetDao {
  BudgetDao(this._appDatabase);

  final AppDatabase _appDatabase;

  static const _table = 'budgets';

  Future<void> upsertAll(List<BudgetModel> budgets) async {
    final db = await _appDatabase.database;
    final batch = db.batch();
    for (final budget in budgets) {
      batch.insert(
        _table,
        budget.toDatabaseMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    await batch.commit(noResult: true);
  }

  Future<List<BudgetModel>> getAll() async {
    final db = await _appDatabase.database;
    final maps = await db.query(_table);
    return maps.map(BudgetModel.fromDatabaseMap).toList();
  }

  Future<void> deleteAll() async {
    final db = await _appDatabase.database;
    await db.delete(_table);
  }
}
