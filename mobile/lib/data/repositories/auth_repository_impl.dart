import 'package:flutter/foundation.dart';

import 'package:finance_app/core/storage/secure_storage_service.dart';
import 'package:finance_app/data/datasources/remote/auth_remote_data_source.dart';
import 'package:finance_app/domain/entities/token_pair.dart';
import 'package:finance_app/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl({
    required AuthRemoteDataSource remoteDataSource,
    required TokenStorage tokenStorage,
  })  : _remoteDataSource = remoteDataSource,
        _tokenStorage = tokenStorage;

  final AuthRemoteDataSource _remoteDataSource;
  final TokenStorage _tokenStorage;

  @override
  Future<void> clearSession() {
    return _tokenStorage.clear();
  }

  @override
  Future<TokenPair?> getCachedTokenPair() async {
    final access = await _tokenStorage.getAccessToken();
    final refresh = await _tokenStorage.getRefreshToken();
    if (access == null || refresh == null) {
      return null;
    }
    return TokenPair(accessToken: access, refreshToken: refresh);
  }

  @override
  Future<bool> hasValidSession() {
    return _tokenStorage.hasTokenPair();
  }

  @override
  Future<void> persistTokenPair(TokenPair tokenPair) {
    return _tokenStorage.saveTokenPair(tokenPair);
  }

  @override
  Future<TokenPair> refreshToken() async {
    final refreshToken = await _tokenStorage.getRefreshToken();
    if (refreshToken == null) {
      throw StateError('No refresh token available');
    }

    try {
      final tokenPairModel = await _remoteDataSource.refreshTokens(refreshToken);
      final tokenPair = tokenPairModel.toEntity();
      await _tokenStorage.saveTokenPair(tokenPair);
      return tokenPair;
    } on Exception catch (error) {
      debugPrint('Failed to refresh token: $error');
      rethrow;
    }
  }
}
