// lib/shared_widgets/app_header.dart
import 'package:flutter/material.dart';
import 'package:maincrm/core/theme.dart';

class AppHeader extends StatelessWidget {
  final TextEditingController searchController;
  final int notificationCount;
  final ValueChanged<String> onSearchChanged;
  final VoidCallback? onNotificationsPressed;

  const AppHeader({
    super.key,
    required this.searchController,
    required this.notificationCount,
    required this.onSearchChanged,
    this.onNotificationsPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 8),
      child: Row(
        children: [
          // Поиск
          Expanded(
            child: Container(
              height: 46,
              decoration: BoxDecoration(
                color: AppColors.headerSearchBg,
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 1))],
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(children: [
                const Icon(Icons.search, color: Colors.black45),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: searchController,
                    onChanged: onSearchChanged,
                    decoration: const InputDecoration(
                      hintText: 'Поиск по названию',
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
              ]),
            ),
          ),

          const SizedBox(width: 18),

          // Уведомления
          InkWell(
            onTap: onNotificationsPressed,
            borderRadius: BorderRadius.circular(10),
            child: Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), boxShadow: const [
                BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 1))
              ]),
              child: Stack(children: [
                const Center(child: Icon(Icons.notifications_none, color: Colors.black54)),
                if (notificationCount > 0)
                  Positioned(
                    right: 6,
                    top: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: AppColors.badgeRed, borderRadius: BorderRadius.circular(10)),
                      child: Text(
                        notificationCount > 9 ? '9+' : '$notificationCount',
                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ]),
            ),
          ),

          const SizedBox(width: 12),

          // Профиль
          Container(
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(999), boxShadow: const [
              BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 1))
            ]),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Row(children: const [
              CircleAvatar(radius: 14, child: Text('И', style: TextStyle(fontSize: 13))),
              SizedBox(width: 10),
              Text('Иван Иванов', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              SizedBox(width: 6),
              Icon(Icons.arrow_drop_down_outlined),
            ]),
          ),
        ],
      ),
    );
  }
}
