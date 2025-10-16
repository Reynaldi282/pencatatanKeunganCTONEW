import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Supported application environments.
enum AppEnvironment { development, staging, production }

/// Holds configuration values that depends on the [AppEnvironment].
class EnvironmentConfig {
  const EnvironmentConfig({
    required this.environment,
    required this.apiBaseUrl,
    required this.enableLogging,
  });

  final AppEnvironment environment;
  final String apiBaseUrl;
  final bool enableLogging;

  bool get isProduction => environment == AppEnvironment.production;
  bool get isStaging => environment == AppEnvironment.staging;
  bool get isDevelopment => environment == AppEnvironment.development;

  static EnvironmentConfig forEnvironment(AppEnvironment environment) {
    switch (environment) {
      case AppEnvironment.development:
        return const EnvironmentConfig(
          environment: AppEnvironment.development,
          apiBaseUrl: 'https://api-dev.example.com',
          enableLogging: true,
        );
      case AppEnvironment.staging:
        return const EnvironmentConfig(
          environment: AppEnvironment.staging,
          apiBaseUrl: 'https://api-staging.example.com',
          enableLogging: true,
        );
      case AppEnvironment.production:
        return const EnvironmentConfig(
          environment: AppEnvironment.production,
          apiBaseUrl: 'https://api.example.com',
          enableLogging: false,
        );
    }
  }
}

/// Provider that exposes the [EnvironmentConfig] for the current running flavor.
final environmentConfigProvider = Provider<EnvironmentConfig>((ref) {
  throw UnimplementedError('EnvironmentConfig must be overridden at bootstrap.');
});
