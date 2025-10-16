import 'package:finance_app/core/storage/secure_storage_service.dart';
import 'package:finance_app/data/datasources/remote/auth_remote_data_source.dart';
import 'package:finance_app/data/models/token_pair_model.dart';
import 'package:finance_app/data/repositories/auth_repository_impl.dart';
import 'package:finance_app/domain/entities/token_pair.dart';
import 'package:test/test.dart';

class FakeAuthRemoteDataSource implements AuthRemoteDataSource {
  FakeAuthRemoteDataSource(this._tokenPairModel);

  TokenPairModel _tokenPairModel;
  int refreshCallCount = 0;

  @override
  Future<TokenPairModel> refreshTokens(String refreshToken) async {
    refreshCallCount++;
    if (refreshToken != 'valid-refresh') {
      throw StateError('Invalid refresh token');
    }
    return _tokenPairModel;
  }

  void arrangeTokenPair(TokenPairModel model) {
    _tokenPairModel = model;
  }
}

void main() {
  group('AuthRepositoryImpl', () {
    late FakeAuthRemoteDataSource remoteDataSource;
    late TokenStorage tokenStorage;
    late AuthRepositoryImpl repository;

    setUp(() {
      remoteDataSource = FakeAuthRemoteDataSource(
        const TokenPairModel(
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
        ),
      );
      tokenStorage = TokenStorage(InMemorySecureStorageClient());
      repository = AuthRepositoryImpl(
        remoteDataSource: remoteDataSource,
        tokenStorage: tokenStorage,
      );
    });

    test('hasValidSession returns false when no tokens are cached', () async {
      final result = await repository.hasValidSession();
      expect(result, isFalse);
    });

    test('persistTokenPair stores tokens and hasValidSession returns true', () async {
      await repository.persistTokenPair(
        const TokenPair(accessToken: 'access', refreshToken: 'refresh'),
      );

      final result = await repository.hasValidSession();
      expect(result, isTrue);
    });

    test('refreshToken updates stored tokens', () async {
      await repository.persistTokenPair(
        const TokenPair(accessToken: 'old-access', refreshToken: 'valid-refresh'),
      );

      final tokenPair = await repository.refreshToken();

      expect(tokenPair.accessToken, 'new-access');
      expect(tokenPair.refreshToken, 'new-refresh');
      expect(remoteDataSource.refreshCallCount, 1);

      final cached = await repository.getCachedTokenPair();
      expect(cached?.accessToken, 'new-access');
      expect(cached?.refreshToken, 'new-refresh');
    });

    test('clearSession removes cached tokens', () async {
      await repository.persistTokenPair(
        const TokenPair(accessToken: 'access', refreshToken: 'refresh'),
      );
      await repository.clearSession();

      final hasSession = await repository.hasValidSession();
      expect(hasSession, isFalse);
    });
  });
}
