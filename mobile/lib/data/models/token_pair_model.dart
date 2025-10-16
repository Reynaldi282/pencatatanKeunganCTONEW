import 'package:finance_app/domain/entities/token_pair.dart';

class TokenPairModel {
  const TokenPairModel({
    required this.accessToken,
    required this.refreshToken,
  });

  final String accessToken;
  final String refreshToken;

  factory TokenPairModel.fromJson(Map<String, dynamic> json) {
    return TokenPairModel(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accessToken': accessToken,
      'refreshToken': refreshToken,
    };
  }

  TokenPair toEntity() => TokenPair(accessToken: accessToken, refreshToken: refreshToken);

  factory TokenPairModel.fromEntity(TokenPair entity) {
    return TokenPairModel(accessToken: entity.accessToken, refreshToken: entity.refreshToken);
  }
}
