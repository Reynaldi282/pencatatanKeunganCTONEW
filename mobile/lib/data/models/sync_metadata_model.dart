import 'package:finance_app/domain/entities/sync_metadata.dart';

class SyncMetadataModel {
  const SyncMetadataModel({
    required this.entity,
    required this.lastSyncedAt,
  });

  final String entity;
  final DateTime lastSyncedAt;

  factory SyncMetadataModel.fromJson(Map<String, dynamic> json) {
    return SyncMetadataModel(
      entity: json['entity'] as String,
      lastSyncedAt: DateTime.parse(json['lastSyncedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'entity': entity,
      'lastSyncedAt': lastSyncedAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toDatabaseMap() {
    return <String, dynamic>{
      'entity': entity,
      'last_synced_at': lastSyncedAt.millisecondsSinceEpoch,
    };
  }

  factory SyncMetadataModel.fromDatabaseMap(Map<String, dynamic> map) {
    return SyncMetadataModel(
      entity: map['entity'] as String,
      lastSyncedAt: DateTime.fromMillisecondsSinceEpoch(map['last_synced_at'] as int),
    );
  }

  SyncMetadata toEntity() {
    return SyncMetadata(
      entity: entity,
      lastSyncedAt: lastSyncedAt,
    );
  }

  factory SyncMetadataModel.fromEntity(SyncMetadata metadata) {
    return SyncMetadataModel(
      entity: metadata.entity,
      lastSyncedAt: metadata.lastSyncedAt,
    );
  }
}
