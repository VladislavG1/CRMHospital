import 'package:flutter/material.dart';
import 'package:maincrm/core/theme.dart';

class DepartmentDetailPage extends StatelessWidget {
  final String departmentName;

  const DepartmentDetailPage({super.key, required this.departmentName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(departmentName),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.pop(context)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(18.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Отдел: $departmentName', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            const Text('Здесь будут параметры отдела, пользователи, роли и т.д.'),
            const SizedBox(height: 20),
            //  список пользователей (заглушка)
            Expanded(
              child: ListView(
                children: List.generate(6, (i) {
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      leading: CircleAvatar(child: Text('U${i + 1}')),
                      title: Text('Сотрудник ${i + 1}'),
                      subtitle: Text('Должность ${i + 1}'),
                    ),
                  );
                }),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
