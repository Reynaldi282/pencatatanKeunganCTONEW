class SyncMetadata {
  const SyncMetadata({
    required this.entity,
    required this.lastSyncedAt,
  });

  final String entity;
  final DateTime lastSyncedAt;
}
