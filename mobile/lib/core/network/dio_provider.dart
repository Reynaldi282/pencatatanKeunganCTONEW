import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/core/config/environment.dart';
import 'package:finance_app/core/storage/storage_providers.dart';
import 'package:finance_app/core/network/interceptors/auth_interceptor.dart';
import 'package:finance_app/data/repositories/providers.dart';

final dioProvider = Provider<Dio>((ref) {
  final environment = ref.watch(environmentConfigProvider);
  final tokenStorage = ref.watch(tokenStorageProvider);
  final authRepository = ref.watch(authRepositoryProvider);

  final baseOptions = BaseOptions(
    baseUrl: environment.apiBaseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: <String, dynamic>{'Accept': 'application/json'},
  );

  final dio = Dio(baseOptions);

  if (environment.enableLogging) {
    dio.interceptors.add(
      LogInterceptor(requestBody: true, responseBody: true),
    );
  }

  dio.interceptors.add(
    AuthInterceptor(
      dio: dio,
      tokenStorage: tokenStorage,
      onRefresh: () => authRepository.refreshToken(),
    ),
  );

  return dio;
});
