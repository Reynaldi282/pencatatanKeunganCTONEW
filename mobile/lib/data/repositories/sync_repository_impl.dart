import 'package:finance_app/core/database/dao/budget_dao.dart';
import 'package:finance_app/core/database/dao/category_dao.dart';
import 'package:finance_app/core/database/dao/sync_metadata_dao.dart';
import 'package:finance_app/core/database/dao/transaction_dao.dart';
import 'package:finance_app/core/database/dao/user_dao.dart';
import 'package:finance_app/data/models/budget_model.dart';
import 'package:finance_app/data/models/category_model.dart';
import 'package:finance_app/data/models/sync_metadata_model.dart';
import 'package:finance_app/data/models/transaction_model.dart';
import 'package:finance_app/data/models/user_model.dart';
import 'package:finance_app/domain/entities/budget.dart';
import 'package:finance_app/domain/entities/category.dart';
import 'package:finance_app/domain/entities/sync_metadata.dart';
import 'package:finance_app/domain/entities/transaction.dart';
import 'package:finance_app/domain/entities/user.dart';
import 'package:finance_app/domain/repositories/sync_repository.dart';

class SyncRepositoryImpl implements SyncRepository {
  SyncRepositoryImpl({
    required UserDao userDao,
    required CategoryDao categoryDao,
    required TransactionDao transactionDao,
    required BudgetDao budgetDao,
    required SyncMetadataDao syncMetadataDao,
  })  : _userDao = userDao,
        _categoryDao = categoryDao,
        _transactionDao = transactionDao,
        _budgetDao = budgetDao,
        _syncMetadataDao = syncMetadataDao;

  final UserDao _userDao;
  final CategoryDao _categoryDao;
  final TransactionDao _transactionDao;
  final BudgetDao _budgetDao;
  final SyncMetadataDao _syncMetadataDao;

  @override
  Future<void> cacheBudgets(List<Budget> budgets) async {
    final models = budgets.map(BudgetModel.fromEntity).toList();
    await _budgetDao.upsertAll(models);
  }

  @override
  Future<void> cacheCategories(List<Category> categories) async {
    final models = categories.map(CategoryModel.fromEntity).toList();
    await _categoryDao.upsertAll(models);
  }

  @override
  Future<void> cacheTransactions(List<TransactionEntity> transactions) async {
    final models = transactions.map(TransactionModel.fromEntity).toList();
    await _transactionDao.upsertAll(models);
  }

  @override
  Future<void> cacheUser(User user) async {
    final model = UserModel.fromEntity(user);
    await _userDao.upsert(model);
  }

  @override
  Future<SyncMetadata?> getSyncMetadata(String entity) async {
    final metadata = await _syncMetadataDao.getByEntity(entity);
    return metadata?.toEntity();
  }

  @override
  Future<void> hydrateInitialData() async {
    await _userDao.getUser();
    await _categoryDao.getAll();
    await _transactionDao.getAll();
    await _budgetDao.getAll();
  }

  @override
  Future<void> upsertSyncMetadata(SyncMetadata metadata) async {
    final model = SyncMetadataModel.fromEntity(metadata);
    await _syncMetadataDao.upsert(model);
  }
}
