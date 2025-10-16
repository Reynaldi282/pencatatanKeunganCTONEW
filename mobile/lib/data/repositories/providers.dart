import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/core/config/environment.dart';
import 'package:finance_app/core/database/database_providers.dart';
import 'package:finance_app/core/storage/storage_providers.dart';
import 'package:finance_app/data/datasources/remote/auth_remote_data_source.dart';
import 'package:finance_app/data/repositories/auth_repository_impl.dart';
import 'package:finance_app/data/repositories/sync_repository_impl.dart';
import 'package:finance_app/domain/repositories/auth_repository.dart';
import 'package:finance_app/domain/repositories/sync_repository.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final environment = ref.watch(environmentConfigProvider);
  final tokenStorage = ref.watch(tokenStorageProvider);

  final dio = Dio(
    BaseOptions(
      baseUrl: environment.apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ),
  );

  if (environment.enableLogging) {
    dio.interceptors.add(
      LogInterceptor(requestBody: true, responseBody: true),
    );
  }

  final remoteDataSource = AuthRemoteDataSourceImpl(dio);

  return AuthRepositoryImpl(
    remoteDataSource: remoteDataSource,
    tokenStorage: tokenStorage,
  );
});

final syncRepositoryProvider = Provider<SyncRepository>((ref) {
  return SyncRepositoryImpl(
    userDao: ref.watch(userDaoProvider),
    categoryDao: ref.watch(categoryDaoProvider),
    transactionDao: ref.watch(transactionDaoProvider),
    budgetDao: ref.watch(budgetDaoProvider),
    syncMetadataDao: ref.watch(syncMetadataDaoProvider),
  );
});
