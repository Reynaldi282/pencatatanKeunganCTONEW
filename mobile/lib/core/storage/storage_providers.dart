import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:finance_app/core/storage/secure_storage_service.dart';

final secureStorageClientProvider = Provider<SecureStorageClient>(
  (ref) => FlutterSecureStorageClient(),
);

final tokenStorageProvider = Provider<TokenStorage>(
  (ref) => TokenStorage(ref.watch(secureStorageClientProvider)),
);
