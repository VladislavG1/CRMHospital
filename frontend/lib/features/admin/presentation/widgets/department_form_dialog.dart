import 'package:flutter/material.dart';


/// result = {'id': '...', 'name': '...'} или null (если отмена).
class DepartmentFormDialog extends StatelessWidget {
  final String? initialId;
  final String? initialName;

  const DepartmentFormDialog({
    super.key,
    this.initialId,
    this.initialName,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      elevation: 0,
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: _AdminFormDialogWrapper(id: initialId, name: initialName),
    );
  }
}


class _AdminDialogSizing extends StatelessWidget {
  final Widget child;
  const _AdminDialogSizing({required this.child});

  @override
  Widget build(BuildContext context) {
    final maxWidth = MediaQuery.of(context).size.width;
    return ConstrainedBox(
      constraints: BoxConstraints(
        maxWidth: maxWidth > 600 ? 460 : maxWidth * 0.92,
      ),
      child: child,
    );
  }
}


class _AdminDialogPadding extends StatelessWidget {
  final Widget child;
  const _AdminDialogPadding({required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(padding: const EdgeInsets.all(18.0), child: child);
  }
}


class _AdminDialogCard extends StatelessWidget {
  final Widget child;
  const _AdminDialogCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Material(
      borderRadius: BorderRadius.circular(14),
      color: Colors.white,
      child: child,
    );
  }
}

/// stateful (поля, валидация)
class _AdminDialogContent extends StatefulWidget {
  final String? id;
  final String? name;
  const _AdminDialogContent({this.id, this.name});

  @override
  State<_AdminDialogContent> createState() => _AdminDialogContentState();
}

class _AdminDialogContentState extends State<_AdminDialogContent> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameCtl;

  @override
  void initState() {
    super.initState();
    _nameCtl = TextEditingController(text: widget.name ?? '');
  }

  @override
  void dispose() {
    _nameCtl.dispose();
    super.dispose();
  }

  void _onSave() {
    if (!_formKey.currentState!.validate()) return;
    final name = _nameCtl.text.trim();
    final id = widget.id ?? DateTime.now().millisecondsSinceEpoch.toString();
    Navigator.of(context).pop(<String, String>{'id': id, 'name': name});
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.id != null;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Text(
              isEdit ? 'Редактировать отдел' : 'Добавить отдел',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
            ),
            const Spacer(),
            IconButton(onPressed: () => Navigator.of(context).pop(), icon: const Icon(Icons.close)),
          ],
        ),
        const SizedBox(height: 12),


        Form(
          key: _formKey,
          child: TextFormField(
            controller: _nameCtl,
            decoration: InputDecoration(
              labelText: 'Название отдела',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Введите название отдела';
              if (v.trim().length < 2) return 'Название должно быть не меньше 2 символов';
              return null;
            },
          ),
        ),

        const SizedBox(height: 18),


        Row(
          children: [
            OutlinedButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Отмена')),
            const Spacer(),
            ElevatedButton(onPressed: _onSave, child: Text(isEdit ? 'Сохранить' : 'Добавить')),
          ],
        ),
      ],
    );
  }
}


class _AdminFormDialogWrapper extends StatelessWidget {
  final String? id;
  final String? name;
  const _AdminFormDialogWrapper({this.id, this.name});

  @override
  Widget build(BuildContext context) {
    return _AdminDialogSizing(
      child: _AdminDialogCard(
        child: _AdminDialogPadding(
          child: _AdminDialogContent(id: id, name: name),
        ),
      ),
    );
  }
}
