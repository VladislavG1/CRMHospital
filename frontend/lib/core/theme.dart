import 'package:flutter/material.dart';



class AppColors {
  // Основной 
  static const Color primary = Color(0xFF1EA7D7);

  // Доп. оттенки / акценты
  static const Color accentLight = Color(0xFFEFF8FB);
  static const Color headerSearchBg = Color(0xFFF7FAFB);

  // Sidebar
  static const Color sidebarBg = Color(0xFFF8FAFB);
  static const Color sidebarAccent = Color(0xFFEDF8FC);

  // Cards / rows
  static const Color cardBg = Colors.white;
  static const Color lightRow = Color(0xFFF2FBFF);

  // Другие цвета
  static const Color pinRed = Color(0xFFD9534F);
  static const Color tabActive = Color(0xFF9EE0F0);
  static const Color tabsBg = Color(0xFFF1FAFD);

  // Notifications badge
  static const Color badgeRed = Color(0xFFE24646);
}

class AppTheme {
  static ThemeData light() {
    final colorScheme = ColorScheme.fromSeed(seedColor: AppColors.primary, brightness: Brightness.light);

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFFF9FBFC),
      cardColor: AppColors.cardBg,
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
          elevation: 0,
        ),
      ),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(fontSize: 14.0),
        bodySmall: TextStyle(fontSize: 12.0),
      ),
    );
  }
}
