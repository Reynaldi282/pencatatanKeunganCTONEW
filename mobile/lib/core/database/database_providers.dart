import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/core/database/app_database.dart';
import 'package:finance_app/core/database/dao/budget_dao.dart';
import 'package:finance_app/core/database/dao/category_dao.dart';
import 'package:finance_app/core/database/dao/sync_metadata_dao.dart';
import 'package:finance_app/core/database/dao/transaction_dao.dart';
import 'package:finance_app/core/database/dao/user_dao.dart';

final appDatabaseProvider = Provider<AppDatabase>((ref) => AppDatabase.instance);

final userDaoProvider = Provider<UserDao>((ref) => UserDao(ref.watch(appDatabaseProvider)));

final categoryDaoProvider = Provider<CategoryDao>((ref) => CategoryDao(ref.watch(appDatabaseProvider)));

final transactionDaoProvider = Provider<TransactionDao>((ref) => TransactionDao(ref.watch(appDatabaseProvider)));

final budgetDaoProvider = Provider<BudgetDao>((ref) => BudgetDao(ref.watch(appDatabaseProvider)));

final syncMetadataDaoProvider = Provider<SyncMetadataDao>((ref) => SyncMetadataDao(ref.watch(appDatabaseProvider)));
