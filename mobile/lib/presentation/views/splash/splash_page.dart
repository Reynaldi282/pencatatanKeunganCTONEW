import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/presentation/localization/app_localizations.dart';
import 'package:finance_app/presentation/providers/startup_provider.dart';

class SplashPage extends ConsumerWidget {
  const SplashPage({super.key});

  static const routePath = '/splash';
  static const routeName = 'splash';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final startupState = ref.watch(startupControllerProvider);
    final localization = AppLocalizations.of(context);

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 24),
              Text(
                localization.translate('splash_loading'),
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
              if (startupState.errorMessage != null) ...[
                const SizedBox(height: 16),
                Text(
                  startupState.errorMessage!,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: Theme.of(context).colorScheme.error),
                  textAlign: TextAlign.center,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
