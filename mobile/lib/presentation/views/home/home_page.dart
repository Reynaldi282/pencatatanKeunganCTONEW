import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/presentation/localization/app_localizations.dart';
import 'package:finance_app/presentation/providers/startup_provider.dart';
import 'package:finance_app/presentation/providers/theme_provider.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  static const routePath = '/home';
  static const routeName = 'home';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final localization = AppLocalizations.of(context);
    final themeMode = ref.watch(themeModeProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(localization.translate('home_title')),
        actions: [
          IconButton(
            tooltip: 'Toggle theme',
            onPressed: () => ref.read(themeModeProvider.notifier).toggle(),
            icon: Icon(
              themeMode == ThemeMode.dark ? Icons.dark_mode : Icons.light_mode,
            ),
          ),
          IconButton(
            tooltip: localization.translate('logout'),
            onPressed: () => ref.read(startupControllerProvider.notifier).logout(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Text(
            localization.translate('home_title'),
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          Text(
            'Welcome to the Finance App scaffold. Start building amazing features! ',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
        ],
      ),
    );
  }
}
