import 'package:sqflite/sqflite.dart';

import 'package:finance_app/core/database/app_database.dart';
import 'package:finance_app/data/models/user_model.dart';

class UserDao {
  UserDao(this._appDatabase);

  final AppDatabase _appDatabase;

  static const _table = 'users';

  Future<void> upsert(UserModel user) async {
    final db = await _appDatabase.database;
    await db.insert(
      _table,
      user.toDatabaseMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<UserModel?> getUser() async {
    final db = await _appDatabase.database;
    final maps = await db.query(_table, limit: 1);
    if (maps.isEmpty) {
      return null;
    }
    return UserModel.fromDatabaseMap(maps.first);
  }

  Future<void> deleteAll() async {
    final db = await _appDatabase.database;
    await db.delete(_table);
  }
}
