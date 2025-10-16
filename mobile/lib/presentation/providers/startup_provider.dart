import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/data/repositories/providers.dart';
import 'package:finance_app/domain/repositories/auth_repository.dart';
import 'package:finance_app/domain/repositories/sync_repository.dart';

final startupControllerProvider =
    StateNotifierProvider<StartupController, StartupState>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  final syncRepository = ref.watch(syncRepositoryProvider);
  return StartupController(authRepository, syncRepository);
});

enum StartupStatus { loading, authenticated, unauthenticated }

@immutable
class StartupState {
  const StartupState({
    required this.status,
    this.errorMessage,
  });

  const StartupState.loading() : this(status: StartupStatus.loading);
  const StartupState.authenticated()
      : this(status: StartupStatus.authenticated);
  const StartupState.unauthenticated({String? errorMessage})
      : this(status: StartupStatus.unauthenticated, errorMessage: errorMessage);

  final StartupStatus status;
  final String? errorMessage;

  bool get isLoading => status == StartupStatus.loading;
  bool get isAuthenticated => status == StartupStatus.authenticated;
  bool get isUnauthenticated => status == StartupStatus.unauthenticated;

  StartupState copyWith({StartupStatus? status, String? errorMessage}) {
    return StartupState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    if (other is! StartupState) return false;
    return other.status == status && other.errorMessage == errorMessage;
  }

  @override
  int get hashCode => Object.hash(status, errorMessage);
}

class StartupController extends StateNotifier<StartupState> {
  StartupController(this._authRepository, this._syncRepository)
      : super(const StartupState.loading()) {
    _initialize();
  }

  final AuthRepository _authRepository;
  final SyncRepository _syncRepository;

  Future<void> _initialize() async {
    try {
      final hasSession = await _authRepository.hasValidSession();
      if (!hasSession) {
        state = const StartupState.unauthenticated();
        return;
      }

      await _authRepository.refreshToken();
      await _syncRepository.hydrateInitialData();
      state = const StartupState.authenticated();
    } catch (error) {
      state = StartupState.unauthenticated(errorMessage: error.toString());
    }
  }

  Future<void> logout() async {
    await _authRepository.clearSession();
    state = const StartupState.unauthenticated();
  }

  Future<void> recheckSession() async {
    state = const StartupState.loading();
    await _initialize();
  }
}
