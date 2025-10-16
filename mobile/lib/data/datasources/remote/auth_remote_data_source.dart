import 'package:dio/dio.dart';

import 'package:finance_app/data/models/token_pair_model.dart';

abstract class AuthRemoteDataSource {
  Future<TokenPairModel> refreshTokens(String refreshToken);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  AuthRemoteDataSourceImpl(this._dio);

  final Dio _dio;

  @override
  Future<TokenPairModel> refreshTokens(String refreshToken) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/auth/refresh',
      data: <String, dynamic>{'refreshToken': refreshToken},
      options: Options(extra: const <String, Object>{'skipAuthRefresh': true}),
    );

    final data = response.data ?? <String, dynamic>{};
    return TokenPairModel.fromJson(data);
  }
}
