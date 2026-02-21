import 'package:flutter/material.dart';
import 'package:maincrm/features/admin/presentation/widgets/admin_sidebar.dart';
import 'package:maincrm/shared_widgets/app_header.dart';
import 'package:maincrm/features/admin/presentation/widgets/documents/document_form_dialog.dart';

class AdminDocument {
  String id;
  String number;
  String title;
  String type;
  DateTime date;
  bool pinned;
  bool hasAttachment;

  AdminDocument({
    required this.id,
    required this.number,
    required this.title,
    required this.type,
    required this.date,
    this.pinned = false,
    this.hasAttachment = false,
  });

  AdminDocument copyWith({
    String? id,
    String? number,
    String? title,
    String? type,
    DateTime? date,
    bool? pinned,
    bool? hasAttachment,
  }) =>
      AdminDocument(
        id: id ?? this.id,
        number: number ?? this.number,
        title: title ?? this.title,
        type: type ?? this.type,
        date: date ?? this.date,
        pinned: pinned ?? this.pinned,
        hasAttachment: hasAttachment ?? this.hasAttachment,
      );
}

class AdminDocumentsPage extends StatefulWidget {
  const AdminDocumentsPage({super.key});

  @override
  State<AdminDocumentsPage> createState() => _AdminDocumentsPageState();
}

class _AdminDocumentsPageState extends State<AdminDocumentsPage> {
  final TextEditingController _search = TextEditingController();
  int _activeTab = 0;


  late List<AdminDocument> _docs;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _docs = [
      AdminDocument(id: 'd1', number: '01-23/ПР', title: 'Утверждение штатного расписания', type: 'Приказ', date: now.subtract(const Duration(days: 30)), hasAttachment: true),
      AdminDocument(id: 'd2', number: '02-23/РС', title: 'Изменение графика работы', type: 'Распоряжение', date: now.subtract(const Duration(days: 20)), pinned: true, hasAttachment: true),
      AdminDocument(id: 'd3', number: '03-23/ПТ', title: 'Протокол заседания', type: 'Протокол', date: now.subtract(const Duration(days: 10))),
    ];
  }


  Future<void> _openAddOrEdit({AdminDocument? forEdit}) async {
    final init = forEdit != null
        ? {
            'id': forEdit.id,
            'number': forEdit.number,
            'title': forEdit.title,
            'type': forEdit.type,
            'date': forEdit.date,
            'hasAttachment': forEdit.hasAttachment,
          }
        : null;

    final res = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => DocumentFormDialog(initial: init),
    );

    if (res == null) return;
    setState(() {
      if (forEdit != null) {

        final idx = _docs.indexWhere((e) => e.id == forEdit.id);
        if (idx != -1) {
          _docs[idx] = _docs[idx].copyWith(
            number: res['number'] as String,
            title: res['title'] as String,
            type: res['type'] as String,
            date: res['date'] as DateTime,
            hasAttachment: res['hasAttachment'] as bool,
          );
        }
      } else {

        final newDoc = AdminDocument(
          id: res['id'] as String,
          number: res['number'] as String,
          title: res['title'] as String,
          type: res['type'] as String,
          date: res['date'] as DateTime,
          hasAttachment: res['hasAttachment'] as bool,
        );
        _docs.insert(0, newDoc);
      }
    });
  }


  void _togglePin(AdminDocument d) {
    setState(() {
      final idx = _docs.indexWhere((e) => e.id == d.id);
      if (idx != -1) _docs[idx] = _docs[idx].copyWith(pinned: !d.pinned);
    });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(d.pinned ? 'Откреплено' : 'Закреплено')));
  }


  Future<void> _download(AdminDocument d) async {
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Начинаем скачивание...')));
    await Future.delayed(const Duration(milliseconds: 800));
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Скачивание завершено (заглушка)')));
  }


  void _view(AdminDocument d) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 24),
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: MediaQuery.of(ctx).size.width > 700 ? 720 : MediaQuery.of(ctx).size.width * 0.95),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Row(children: [
                Expanded(child: Text('${d.number} — ${d.title}', style: const TextStyle(fontWeight: FontWeight.w700))),
                IconButton(onPressed: () => Navigator.of(ctx).pop(), icon: const Icon(Icons.close)),
              ]),
              const SizedBox(height: 8),
              Row(children: [
                Chip(label: Text(d.type)),
                const SizedBox(width: 8),
                if (d.pinned) const Chip(label: Text('Закреплено')),
                if (d.hasAttachment) const SizedBox(width: 8),
                if (d.hasAttachment) const Chip(label: Text('Вложение')),
                const Spacer(),
                Text('${d.date.day.toString().padLeft(2,'0')}.${d.date.month.toString().padLeft(2,'0')}.${d.date.year}'),
              ]),
              const SizedBox(height: 12),
              Text(d.title),
              const SizedBox(height: 16),
              Row(children: [
                ElevatedButton.icon(onPressed: () { Navigator.of(ctx).pop(); _togglePin(d); }, icon: Icon(d.pinned ? Icons.push_pin : Icons.push_pin_outlined), label: Text(d.pinned ? 'Открепить' : 'Закрепить')),
                const SizedBox(width: 8),
                OutlinedButton.icon(onPressed: () { Navigator.of(ctx).pop(); _download(d); }, icon: const Icon(Icons.download_outlined), label: const Text('Скачать')),
                const Spacer(),
                TextButton(onPressed: () { Navigator.of(ctx).pop(); _openAddOrEdit(forEdit: d); }, child: const Text('Редактировать')),
              ])
            ]),
          ),
        ),
      ),
    );
  }

  List<AdminDocument> get _filtered {
    final q = _search.text.trim().toLowerCase();
    if (q.isEmpty) return _docs;
    return _docs.where((d) {
      return d.number.toLowerCase().contains(q) || d.title.toLowerCase().contains(q) || d.type.toLowerCase().contains(q);
    }).toList();
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  Widget _tabPill(String label, int idx) {
    final active = _activeTab == idx;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = idx),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(color: active ? const Color(0xFFEAF6FF) : Colors.transparent, borderRadius: BorderRadius.circular(8)),
        child: Text(label, style: TextStyle(fontWeight: active ? FontWeight.w700 : FontWeight.w600)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final docs = _filtered.where((d) {
      if (_activeTab == 1) return d.type.toLowerCase().contains('приказ');
      if (_activeTab == 2) return d.type.toLowerCase().contains('распоряжение');
      return true;
    }).toList();

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(onPressed: () => _openAddOrEdit(), icon: const Icon(Icons.add), label: const Text('+ Добавить документ')),
      body: SafeArea(
        child: LayoutBuilder(builder: (context, constraints) {
          final maxWidth = constraints.maxWidth;
          final sidebarWidth = maxWidth > 1000 ? 240.0 : (maxWidth > 600 ? 96.0 : 56.0);

          return Row(children: [
            AdminSidebar(width: sidebarWidth, active: 'documents'),
            Expanded(
              child: Column(children: [
                AppHeader(searchController: _search, notificationCount: 0, onSearchChanged: (_) => setState(() {})),
                Padding(padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 8), child: Row(children: [
                  _tabPill('Все документы', 0),
                  const SizedBox(width: 8),
                  _tabPill('Приказы', 1),
                  const SizedBox(width: 8),
                  _tabPill('Распоряжения', 2),
                  const Spacer(),
                  ElevatedButton.icon(onPressed: () => _openAddOrEdit(), icon: const Icon(Icons.add), label: const Text('Добавить')),
                ])),
                const SizedBox(height: 8),
                Expanded(child: Padding(padding: const EdgeInsets.symmetric(horizontal: 18.0), child: docs.isEmpty ? Center(child: Text('Нет документов', style: TextStyle(color: Theme.of(context).hintColor))) : ListView.separated(itemCount: docs.length, separatorBuilder: (_,__) => const SizedBox(height: 10), itemBuilder: (ctx, i) {
                  final d = docs[i];
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
                    child: Row(children: [
                      SizedBox(width: 100, child: Text(d.number, style: const TextStyle(color: Color(0xFF4BA6D6), fontWeight: FontWeight.w600))),
                      Expanded(flex: 3, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(d.title, style: const TextStyle(fontWeight: FontWeight.w600)), const SizedBox(height: 6), Text(d.type)])),
                      Expanded(child: Text('')), 
                      SizedBox(width: 120, child: Text('${d.date.day.toString().padLeft(2,'0')}.${d.date.month.toString().padLeft(2,'0')}.${d.date.year}')),
                      Row(children: [
                        if (d.hasAttachment) IconButton(onPressed: () => _download(d), icon: const Icon(Icons.attachment_outlined)),
                        IconButton(onPressed: () => _togglePin(d), icon: Icon(d.pinned ? Icons.push_pin : Icons.push_pin_outlined)),
                        IconButton(onPressed: () => _download(d), icon: const Icon(Icons.download_outlined)),
                        IconButton(onPressed: () => _view(d), icon: const Icon(Icons.remove_red_eye_outlined)),
                      ])
                    ]),
                  );
                }))),
              ]),
            ),
          ]);
        }),
      ),
    );
  }
}
