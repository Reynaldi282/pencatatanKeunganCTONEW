import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static const supportedLocales = <Locale>[
    Locale('en'),
    Locale('es'),
  ];

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  late Map<String, String> _localizedStrings;

  Future<void> _load() async {
    final bundle = rootBundle;
    final localeString = locale.languageCode;
    final localizedData = await bundle.loadString('assets/l10n/$localeString.json');
    final Map<String, dynamic> jsonMap = jsonDecode(localizedData) as Map<String, dynamic>;
    _localizedStrings = jsonMap.map((key, value) => MapEntry(key, value.toString()));
  }

  static Future<AppLocalizations> load(Locale locale) async {
    final localization = AppLocalizations(locale);
    try {
      await localization._load();
    } catch (_) {
      // Fallback to English when the desired locale is missing.
      final fallback = AppLocalizations(const Locale('en'));
      await fallback._load();
      return fallback;
    }
    return localization;
  }

  String translate(String key) => _localizedStrings[key] ?? key;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => AppLocalizations.supportedLocales
      .map((supported) => supported.languageCode)
      .contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) => AppLocalizations.load(locale);

  @override
  bool shouldReload(covariant LocalizationsDelegate<AppLocalizations> old) => false;
}
