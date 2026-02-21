import 'package:flutter/material.dart';
import 'package:maincrm/core/theme.dart';


class AppSidebar extends StatelessWidget {
  final double width;
  final String active;

  const AppSidebar({super.key, required this.width, this.active = 'tasks'});

  @override
  Widget build(BuildContext context) {
    final showLabels = width >= 200;

    return Container(
      width: width,
      color: AppColors.sidebarBg,
      child: Column(
        children: [
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                  boxShadow: const [BoxShadow(color: Color(0x14000000), blurRadius: 8, offset: Offset(0, 4))],
                ),
                child: IconButton(
                  onPressed: () {
                    // Можно сделать быстрый переход к добавлению задачи — сейчас просто SnackBar
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Создать задачу')));
                  },
                  icon: const Icon(Icons.add, color: Colors.white),
                  tooltip: 'Добавить',
                ),
              ),
            ),
          ),

          const SizedBox(height: 14),

          _menuItem(context, id: 'tasks', icon: Icons.view_list_rounded, label: 'Задачи', active: active == 'tasks'),
          _menuItem(context, id: 'calendar', icon: Icons.calendar_month_outlined, label: 'Календарь', active: active == 'calendar'),

          const SizedBox(height: 8),
          _menuItem(
            context,
            id: 'admin',
            icon: Icons.admin_panel_settings_outlined,
            label: 'Админ панель',
            active: active == 'admin',
          ),
          const Divider(height: 1),
          const Spacer(),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            child: _supportCard(context, showLabels),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(12, 6, 12, 16),
            child: Row(
              children: [
                const Icon(Icons.logout_outlined, size: 18),
                if (showLabels) const SizedBox(width: 8),
                if (showLabels)
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Выйти')));
                      },
                      child: const Text('Выйти', style: TextStyle(fontWeight: FontWeight.w600)),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _menuItem(BuildContext context, {required String id, required IconData icon, required String label, bool active = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Stack(
        children: [
          InkWell(
            borderRadius: BorderRadius.circular(10),
            onTap: () {
              if (id == 'tasks') {
                if (ModalRoute.of(context)?.settings.name != '/') {
                  Navigator.pushReplacementNamed(context, '/');
                }
              } else if (id == 'calendar') {
                if (ModalRoute.of(context)?.settings.name != '/calendar') {
                  Navigator.pushReplacementNamed(context, '/calendar');
                }
              } else if (id == 'admin') {
                if (ModalRoute.of(context)?.settings.name != '/admin') {
                  Navigator.pushReplacementNamed(context, '/admin');
                }
              }

            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: active ? AppColors.tabsBg : Colors.transparent,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: const [BoxShadow(color: Color(0x05000000), blurRadius: 4, offset: Offset(0, 2))],
                    ),
                    child: Icon(icon, color: Colors.black54, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Text(label, style: TextStyle(fontWeight: active ? FontWeight.w700 : FontWeight.w600))),
                ],
              ),
            ),
          ),

          if (active)
            Positioned(
              right: 2,
              top: 6,
              bottom: 6,
              child: Container(
                width: 6,
                decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(4)),
              ),
            ),
        ],
      ),
    );
  }

  Widget _supportCard(BuildContext context, bool showLabels) {
    return Container(
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: const [BoxShadow(color: Color(0x07000000), blurRadius: 8, offset: Offset(0, 4))]),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(width: 54, height: 54, decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(8)), child: const Center(child: Icon(Icons.person_outline, size: 28, color: Color(0xFFEDAA4E)))),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Поддержка', style: TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              SizedBox(
                height: 36,
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Открыть поддержку')));
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, padding: const EdgeInsets.symmetric(horizontal: 12), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), elevation: 0),
                  child: const Text('Поддержка'),
                ),
              ),
            ]),
          ),
        ],
      ),
    );
  }
}
