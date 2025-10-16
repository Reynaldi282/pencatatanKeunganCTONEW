import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/data/repositories/providers.dart';
import 'package:finance_app/domain/entities/token_pair.dart';
import 'package:finance_app/presentation/localization/app_localizations.dart';
import 'package:finance_app/presentation/providers/startup_provider.dart';

class LoginPage extends ConsumerWidget {
  const LoginPage({super.key});

  static const routePath = '/login';
  static const routeName = 'login';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final localization = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(localization.translate('login_title')),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                localization.translate('login_title'),
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () async {
                  final authRepository = ref.read(authRepositoryProvider);
                  await authRepository.persistTokenPair(
                    const TokenPair(
                      accessToken: 'demo-access-token',
                      refreshToken: 'demo-refresh-token',
                    ),
                  );
                  await ref.read(startupControllerProvider.notifier).recheckSession();
                },
                child: Text(localization.translate('login_button')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
