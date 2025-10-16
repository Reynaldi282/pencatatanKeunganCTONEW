import 'package:sqflite/sqflite.dart';

import 'package:finance_app/core/database/app_database.dart';
import 'package:finance_app/data/models/transaction_model.dart';

class TransactionDao {
  TransactionDao(this._appDatabase);

  final AppDatabase _appDatabase;

  static const _table = 'transactions';

  Future<void> upsertAll(List<TransactionModel> transactions) async {
    final db = await _appDatabase.database;
    final batch = db.batch();
    for (final transaction in transactions) {
      batch.insert(
        _table,
        transaction.toDatabaseMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    await batch.commit(noResult: true);
  }

  Future<List<TransactionModel>> getAll() async {
    final db = await _appDatabase.database;
    final maps = await db.query(_table, orderBy: 'occurred_at DESC');
    return maps.map(TransactionModel.fromDatabaseMap).toList();
  }

  Future<void> deleteAll() async {
    final db = await _appDatabase.database;
    await db.delete(_table);
  }
}
