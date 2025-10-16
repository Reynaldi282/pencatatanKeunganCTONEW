import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:finance_app/domain/entities/token_pair.dart';

abstract class SecureStorageClient {
  Future<String?> read({required String key});
  Future<void> write({required String key, required String? value});
  Future<void> delete({required String key});
}

class FlutterSecureStorageClient implements SecureStorageClient {
  FlutterSecureStorageClient([FlutterSecureStorage? storage])
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  @override
  Future<String?> read({required String key}) {
    return _storage.read(key: key);
  }

  @override
  Future<void> write({required String key, required String? value}) {
    if (value == null) {
      return _storage.delete(key: key);
    }
    return _storage.write(key: key, value: value);
  }

  @override
  Future<void> delete({required String key}) {
    return _storage.delete(key: key);
  }
}

class TokenStorage {
  TokenStorage(this._client);

  final SecureStorageClient _client;

  static const _accessTokenKey = 'access_token';
  static const _refreshTokenKey = 'refresh_token';

  Future<void> saveTokenPair(TokenPair tokenPair) async {
    await _client.write(key: _accessTokenKey, value: tokenPair.accessToken);
    await _client.write(key: _refreshTokenKey, value: tokenPair.refreshToken);
  }

  Future<String?> getAccessToken() => _client.read(key: _accessTokenKey);

  Future<String?> getRefreshToken() => _client.read(key: _refreshTokenKey);

  Future<bool> hasTokenPair() async {
    final access = await getAccessToken();
    final refresh = await getRefreshToken();
    return access != null && refresh != null;
  }

  Future<void> clear() async {
    await _client.delete(key: _accessTokenKey);
    await _client.delete(key: _refreshTokenKey);
  }
}

class InMemorySecureStorageClient implements SecureStorageClient {
  final Map<String, String> _storage = <String, String>{};

  @override
  Future<void> delete({required String key}) async {
    _storage.remove(key);
  }

  @override
  Future<String?> read({required String key}) async {
    return _storage[key];
  }

  @override
  Future<void> write({required String key, required String? value}) async {
    if (value == null) {
      _storage.remove(key);
      return;
    }
    _storage[key] = value;
  }
}
