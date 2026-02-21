import 'package:flutter/material.dart';
import 'package:maincrm/shared_widgets/app_sidebar.dart';
import 'package:maincrm/shared_widgets/app_header.dart';

class CalendarPage extends StatelessWidget {
  const CalendarPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(builder: (context, constraints) {
          final maxWidth = constraints.maxWidth;
          final sidebarWidth = maxWidth > 1000 ? 240.0 : (maxWidth > 600 ? 96.0 : 56.0);

          return Row(
            children: [
              // передаём active='calendar' чтобы подсветить пункт
              AppSidebar(width: sidebarWidth, active: 'calendar'),
              Expanded(
                child: Column(
                  children: [
                    // Можно переиспользовать AppHeader (по желанию)
                    AppHeader(
                      searchController: TextEditingController(),
                      notificationCount: 0,
                      onSearchChanged: (_) {},
                    ),

                    // Простая заглушка календаря
                    Expanded(
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.calendar_month, size: 96, color: Colors.black12),
                            SizedBox(height: 12),
                            Text('Календарь — в разработке', style: TextStyle(fontSize: 18, color: Colors.black54)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        }),
      ),
    );
  }
}
