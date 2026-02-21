import 'package:flutter/material.dart';

class DocumentTable extends StatelessWidget {
  const DocumentTable({super.key});

  @override
  Widget build(BuildContext context) {
    final rows = [
      ['01-23/ПР', 'Об утверждении штатного расписания', 'Приказ', 'Утверждение нового штатного...', '10.06.2023'],
      ['02-23/РС', 'Об временном изменении графика', 'Распоряжение', 'Изменение рабочего...', '19.06.2023'],
      ['03-23/ПТ', 'Протокол заседания', 'Протокол', 'Рассмотрение сложных случаев', '25.07.2023'],
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: ListView.builder(
        itemCount: rows.length,
        itemBuilder: (context, i) {
          final row = rows[i];

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(child: Text(row[0])),
                Expanded(child: Text(row[1])),
                Expanded(child: Text(row[2])),
                Expanded(child: Text(row[3])),
                Expanded(child: Text(row[4])),

                IconButton(onPressed: () {}, icon: const Icon(Icons.download)),
                IconButton(onPressed: () {}, icon: const Icon(Icons.remove_red_eye_outlined)),
                IconButton(onPressed: () {}, icon: const Icon(Icons.edit_outlined)),
              ],
            ),
          );
        },
      ),
    );
  }
}
