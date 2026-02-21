import 'package:flutter/material.dart';

class DocumentTabs extends StatefulWidget {
  const DocumentTabs({super.key});

  @override
  State<DocumentTabs> createState() => _DocumentTabsState();
}

class _DocumentTabsState extends State<DocumentTabs> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    final tabs = ['Все документы', 'Приказы', 'Распоряжения'];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      child: Row(
        children: List.generate(tabs.length, (i) {
          final selected = index == i;
          return Expanded(
            child: InkWell(
              onTap: () => setState(() => index = i),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: selected ? Colors.blue.shade100 : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(
                    tabs[i],
                    style: TextStyle(
                      fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}
