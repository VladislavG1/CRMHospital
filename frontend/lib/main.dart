import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'core/di/injector.dart';
import 'features/documents/presentation/pages/documents_page.dart';
import 'features/calendar/presentation/pages/calendar_page.dart';
import 'features/admin/presentation/pages/admin_panel_page.dart';
import 'features/admin/presentation/pages/admin_documents_page.dart';
// import 'features/admin/presentation/pages/admin_calendar_page.dart';
// import 'features/admin/presentation/pages/department_detail_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Injector.setup();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'vsem privet',
      theme: AppTheme.light(),
      initialRoute: '/',
      routes: {
        '/': (ctx) => const DocumentsPage(),
        '/calendar': (ctx) => const CalendarPage(),
        '/admin': (ctx) => const AdminPanelPage(),
        '/admin/documents': (ctx) => const AdminDocumentsPage(),
        // '/admin/calendar': (ctx) => AdminCalendarPage(), 
      },
      debugShowCheckedModeBanner: false,
    );
  }
}
