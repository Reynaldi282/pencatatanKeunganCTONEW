import 'package:finance_app/domain/entities/budget.dart';
import 'package:finance_app/domain/entities/category.dart';
import 'package:finance_app/domain/entities/sync_metadata.dart';
import 'package:finance_app/domain/entities/transaction.dart';
import 'package:finance_app/domain/entities/user.dart';

abstract class SyncRepository {
  Future<void> hydrateInitialData();
  Future<void> cacheUser(User user);
  Future<void> cacheCategories(List<Category> categories);
  Future<void> cacheTransactions(List<TransactionEntity> transactions);
  Future<void> cacheBudgets(List<Budget> budgets);
  Future<SyncMetadata?> getSyncMetadata(String entity);
  Future<void> upsertSyncMetadata(SyncMetadata metadata);
}
