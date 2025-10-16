import 'dart:async';

import 'package:dio/dio.dart';

import 'package:finance_app/domain/entities/token_pair.dart';
import 'package:finance_app/core/storage/secure_storage_service.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor({
    required Dio dio,
    required TokenStorage tokenStorage,
    required Future<TokenPair> Function() onRefresh,
  })  : _dio = dio,
        _tokenStorage = tokenStorage,
        _onRefresh = onRefresh;

  final Dio _dio;
  final TokenStorage _tokenStorage;
  final Future<TokenPair> Function() _onRefresh;

  bool _isRefreshing = false;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _tokenStorage.getAccessToken();
    if (token != null && options.headers['Authorization'] == null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (_shouldAttemptRefresh(err)) {
      if (_isRefreshing) {
        handler.next(err);
        return;
      }

      _isRefreshing = true;
      try {
        final tokenPair = await _onRefresh();
        await _tokenStorage.saveTokenPair(tokenPair);

        final requestOptions = err.requestOptions;
        requestOptions.headers['Authorization'] = 'Bearer ${tokenPair.accessToken}';

        final response = await _dio.fetch<dynamic>(requestOptions);
        handler.resolve(response);
        return;
      } catch (_) {
        handler.next(err);
        return;
      } finally {
        _isRefreshing = false;
      }
    }

    handler.next(err);
  }

  bool _shouldAttemptRefresh(DioException err) {
    final statusCode = err.response?.statusCode;
    final skip = err.requestOptions.extra['skipAuthRefresh'] == true;
    return statusCode == 401 && !skip;
  }
}
