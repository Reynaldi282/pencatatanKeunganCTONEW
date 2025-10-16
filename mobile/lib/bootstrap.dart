import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/app.dart';
import 'package:finance_app/core/config/environment.dart';

Future<void> bootstrap(AppEnvironment environment) async {
  WidgetsFlutterBinding.ensureInitialized();

  final config = EnvironmentConfig.forEnvironment(environment);

  runApp(
    ProviderScope(
      overrides: [environmentConfigProvider.overrideWithValue(config)],
      child: const App(),
    ),
  );
}
