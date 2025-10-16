import 'package:sqflite/sqflite.dart';

import 'package:finance_app/core/database/app_database.dart';
import 'package:finance_app/data/models/sync_metadata_model.dart';

class SyncMetadataDao {
  SyncMetadataDao(this._appDatabase);

  final AppDatabase _appDatabase;

  static const _table = 'sync_metadata';

  Future<SyncMetadataModel?> getByEntity(String entity) async {
    final db = await _appDatabase.database;
    final maps = await db.query(
      _table,
      where: 'entity = ?',
      whereArgs: [entity],
      limit: 1,
    );
    if (maps.isEmpty) {
      return null;
    }
    return SyncMetadataModel.fromDatabaseMap(maps.first);
  }

  Future<void> upsert(SyncMetadataModel metadata) async {
    final db = await _appDatabase.database;
    await db.insert(
      _table,
      metadata.toDatabaseMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }
}
