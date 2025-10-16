import 'package:finance_app/core/config/environment.dart';
import 'package:test/test.dart';

void main() {
  group('EnvironmentConfig', () {
    test('returns development configuration', () {
      final config = EnvironmentConfig.forEnvironment(AppEnvironment.development);
      expect(config.apiBaseUrl, 'https://api-dev.example.com');
      expect(config.enableLogging, isTrue);
    });

    test('returns staging configuration', () {
      final config = EnvironmentConfig.forEnvironment(AppEnvironment.staging);
      expect(config.apiBaseUrl, 'https://api-staging.example.com');
      expect(config.enableLogging, isTrue);
    });

    test('returns production configuration', () {
      final config = EnvironmentConfig.forEnvironment(AppEnvironment.production);
      expect(config.apiBaseUrl, 'https://api.example.com');
      expect(config.enableLogging, isFalse);
    });
  });
}
