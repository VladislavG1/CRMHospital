import 'package:flutter/material.dart';
import 'package:maincrm/features/admin/presentation/widgets/admin_sidebar.dart';
import 'package:maincrm/features/admin/presentation/widgets/department_form_dialog.dart';
import 'package:maincrm/shared_widgets/app_header.dart';

class AdminPanelPage extends StatefulWidget {
  const AdminPanelPage({super.key});

  @override
  State<AdminPanelPage> createState() => _AdminPanelPageState();
}

class _AdminPanelPageState extends State<AdminPanelPage> {
  final TextEditingController _search = TextEditingController();

  // Список отделов — структура: { id: String, name: String }
  List<Map<String, String>> departments = [
    {'id': 'd1', 'name': 'Контроль качества'},
    {'id': 'd2', 'name': 'Экономика/Документы'},
    {'id': 'd3', 'name': 'Амбулатория'},
    {'id': 'd4', 'name': 'ФАП'},
  ];


  List<Map<String, String>> get _visibleDepartments {
    final q = _search.text.trim().toLowerCase();
    if (q.isEmpty) return departments;
    return departments.where((d) => d['name']!.toLowerCase().contains(q)).toList();
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }


  Future<void> _onAddDepartment() async {
    final result = await showDialog<Map<String, String>>(
      context: context,
      builder: (_) => const DepartmentFormDialog(),
    );

    if (result == null) return;

    setState(() {
      departments.insert(0, {'id': result['id']!, 'name': result['name']!});
    });

    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Отдел добавлен')));
  }

 
  Future<void> _onEditDepartment(Map<String, String> dept) async {
    final result = await showDialog<Map<String, String>>(
      context: context,
      builder: (_) => DepartmentFormDialog(initialId: dept['id'], initialName: dept['name']),
    );

    if (result == null) return; 

    setState(() {
      final idx = departments.indexWhere((d) => d['id'] == result['id']);
      if (idx != -1) {
        departments[idx] = {'id': result['id']!, 'name': result['name']!};
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Отдел обновлён')));
  }

 
  void _confirmDelete(String id) {
    final dept = departments.firstWhere((d) => d['id'] == id);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Удалить отдел?'),
        content: Text('Вы действительно хотите удалить отдел "${dept['name']}"?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Отмена')),
          ElevatedButton(
            onPressed: () {
              setState(() => departments.removeWhere((d) => d['id'] == id));
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Отдел удалён')));
            },
            child: const Text('Удалить'),
          ),
        ],
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(builder: (context, constraints) {
          final maxWidth = constraints.maxWidth;
          final sidebarWidth = maxWidth > 1000 ? 240.0 : (maxWidth > 600 ? 96.0 : 56.0);

          final visible = _visibleDepartments;

          return Row(children: [
            AdminSidebar(width: sidebarWidth, active: 'org'),

            Expanded(
              child: Column(
                children: [
                  AppHeader(searchController: _search, notificationCount: 0, onSearchChanged: (_) => setState(() {})),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 12),
                    child: Row(
                      children: [
                        const Expanded(child: Text('Атрибут Организационно-штатной структуры', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600))),
                        ElevatedButton.icon(onPressed: _onAddDepartment, icon: const Icon(Icons.add), label: const Text('Добавить отдел')),
                        const SizedBox(width: 12),
                        TextButton.icon(onPressed: () => Navigator.pushReplacementNamed(context, '/'), icon: const Icon(Icons.exit_to_app), label: const Text('Выйти')),
                      ],
                    ),
                  ),

                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 18.0),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: const Color(0xFFF5F9FB), borderRadius: BorderRadius.circular(8)),
                        child: Column(
                          children: [
                            for (final dep in visible)
                              GestureDetector(
                                onTap: () {
                                  Navigator.pushNamed(context, '/admin/department', arguments: dep);
                                },
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  height: 56,
                                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
                                  child: Row(
                                    children: [
                                      Expanded(child: Text(dep['name']!, style: const TextStyle(fontSize: 16))),
                                      TextButton.icon(
                                        onPressed: () => _onEditDepartment(dep),
                                        icon: const Icon(Icons.edit, size: 16),
                                        label: const Text('Редактировать'),
                                      ),
                                      const SizedBox(width: 8),
                                      TextButton.icon(
                                        onPressed: () => _confirmDelete(dep['id']!),
                                        icon: const Icon(Icons.delete, size: 16),
                                        label: const Text('Удалить'),
                                        style: TextButton.styleFrom(foregroundColor: Colors.red),
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                            if (visible.isEmpty)
                              Expanded(child: Center(child: Text('Нет отделов', style: TextStyle(color: Theme.of(context).hintColor)))),
                            const Spacer(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ]);
        }),
      ),
    );
  }
}
