import 'package:flutter/material.dart';


/// Возвращает Map<String, dynamic> с полями:
/// { 'id': String, 'number': String, 'title': String, 'type': String, 'date': DateTime, 'hasAttachment': bool }
class DocumentFormDialog extends StatefulWidget {
  final Map<String, dynamic>? initial; // можно передать для редактирования

  const DocumentFormDialog({super.key, this.initial});

  @override
  State<DocumentFormDialog> createState() => _DocumentFormDialogState();
}

class _DocumentFormDialogState extends State<DocumentFormDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _numberCtl;
  late final TextEditingController _titleCtl;
  DateTime? _date;
  String _type = 'Приказ';
  bool _hasAttachment = false;

  final List<String> _types = ['Приказ', 'Распоряжение', 'Протокол', 'Другое'];

  @override
  void initState() {
    super.initState();
    final init = widget.initial;
    _numberCtl = TextEditingController(text: init != null ? (init['number'] ?? '') : '');
    _titleCtl = TextEditingController(text: init != null ? (init['title'] ?? '') : '');
    _date = init != null ? (init['date'] as DateTime?) : null;
    _type = init != null ? (init['type'] as String? ?? 'Приказ') : 'Приказ';
    _hasAttachment = init != null ? (init['hasAttachment'] as bool? ?? false) : false;
  }

  @override
  void dispose() {
    _numberCtl.dispose();
    _titleCtl.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _date ?? now,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) setState(() => _date = picked);
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    final out = <String, dynamic>{
      'id': widget.initial != null ? widget.initial!['id'] : DateTime.now().millisecondsSinceEpoch.toString(),
      'number': _numberCtl.text.trim(),
      'title': _titleCtl.text.trim(),
      'type': _type,
      'date': _date ?? DateTime.now(),
      'hasAttachment': _hasAttachment,
    };
    Navigator.of(context).pop(out);
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: width > 700 ? 560 : width * 0.95),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(children: [
                Expanded(child: Text(widget.initial != null ? 'Редактировать документ' : 'Добавить документ', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700))),
                IconButton(onPressed: () => Navigator.of(context).pop(), icon: const Icon(Icons.close)),
              ]),
              const SizedBox(height: 8),
              Form(
                key: _formKey,
                child: Column(children: [
                  TextFormField(
                    controller: _numberCtl,
                    decoration: const InputDecoration(labelText: 'Номер', border: OutlineInputBorder()),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Введите номер' : null,
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: _titleCtl,
                    decoration: const InputDecoration(labelText: 'Название', border: OutlineInputBorder()),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Введите название' : null,
                  ),
                  const SizedBox(height: 10),
                  Row(children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _type,
                        items: _types.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                        onChanged: (v) => setState(() => _type = v ?? _type),
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Тип'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: InkWell(
                        onTap: _pickDate,
                        child: InputDecorator(
                          decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Дата'),
                          child: Text(_date != null ? '${_date!.day.toString().padLeft(2,'0')}.${_date!.month.toString().padLeft(2,'0')}.${_date!.year}' : 'Выбрать дату'),
                        ),
                      ),
                    ),
                  ]),
                  const SizedBox(height: 10),
                  Row(children: [
                    Checkbox(value: _hasAttachment, onChanged: (v) => setState(() => _hasAttachment = v ?? false)),
                    const SizedBox(width: 6),
                    const Text('Вложение (есть/нет)'),
                    const Spacer(),
                  ]),
                ]),
              ),
              const SizedBox(height: 14),
              Row(children: [
                OutlinedButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Отмена')),
                const Spacer(),
                ElevatedButton(onPressed: _save, child: const Text('Сохранить')),
              ])
            ],
          ),
        ),
      ),
    );
  }
}
