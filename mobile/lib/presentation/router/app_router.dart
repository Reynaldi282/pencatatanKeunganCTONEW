import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:finance_app/presentation/providers/startup_provider.dart';
import 'package:finance_app/presentation/views/auth/login_page.dart';
import 'package:finance_app/presentation/views/home/home_page.dart';
import 'package:finance_app/presentation/views/splash/splash_page.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();

final appRouterProvider = Provider<GoRouter>((ref) {
  final startupListenable = ValueNotifier(ref.read(startupControllerProvider));

  ref.listen(startupControllerProvider, (_, next) {
    startupListenable.value = next;
  });

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: SplashPage.routePath,
    refreshListenable: startupListenable,
    routes: [
      GoRoute(
        path: SplashPage.routePath,
        name: SplashPage.routeName,
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: LoginPage.routePath,
        name: LoginPage.routeName,
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: HomePage.routePath,
        name: HomePage.routeName,
        builder: (context, state) => const HomePage(),
      ),
    ],
    redirect: (context, state) {
      final startupState = startupListenable.value;

      if (startupState.isLoading) {
        return SplashPage.routePath;
      }

      final isAuthRoute = state.matchedLocation == LoginPage.routePath;
      final isSplashRoute = state.matchedLocation == SplashPage.routePath;

      if (startupState.isAuthenticated) {
        if (isAuthRoute || isSplashRoute) {
          return HomePage.routePath;
        }
        return null;
      }

      if (!startupState.isAuthenticated && !isAuthRoute) {
        return LoginPage.routePath;
      }

      return null;
    },
  );
});
