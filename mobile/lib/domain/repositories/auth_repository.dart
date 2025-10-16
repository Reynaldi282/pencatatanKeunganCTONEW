import 'package:finance_app/domain/entities/token_pair.dart';

abstract class AuthRepository {
  Future<bool> hasValidSession();
  Future<TokenPair?> getCachedTokenPair();
  Future<TokenPair> refreshToken();
  Future<void> persistTokenPair(TokenPair tokenPair);
  Future<void> clearSession();
}
