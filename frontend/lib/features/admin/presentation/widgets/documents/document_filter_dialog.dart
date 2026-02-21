import 'package:flutter/material.dart';


class DocumentFilterResult {
  final String? type; 
  final String? author; 
  final DateTime? start;
  final DateTime? end;
  final bool includeHidden;

  DocumentFilterResult({
    this.type,
    this.author,
    this.start,
    this.end,
    required this.includeHidden,
  });

  @override
  String toString() => 'DocumentFilterResult(type:$type, author:$author, start:$start, end:$end, hidden:$includeHidden)';
}


class DocumentFilterDialog extends StatefulWidget {
  final String? initialType;
  final String? initialAuthor;
  final DateTime? initialStart;
  final DateTime? initialEnd;
  final bool initialIncludeHidden;

  const DocumentFilterDialog({
    super.key,
    this.initialType,
    this.initialAuthor,
    this.initialStart,
    this.initialEnd,
    this.initialIncludeHidden = false,
  });

  @override
  State<DocumentFilterDialog> createState() => _DocumentFilterDialogState();
}

class _DocumentFilterDialogState extends State<DocumentFilterDialog> {
  final List<String> _types = ['Приказ', 'Распоряжение', 'Протокол'];
  final List<String> _authors = ['Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.'];

  String? _selectedType;
  String? _selectedAuthor;
  DateTime? _start;
  DateTime? _end;
  bool _includeHidden = false;

  late final TextEditingController _startCtl;
  late final TextEditingController _endCtl;

  @override
  void initState() {
    super.initState();
    _selectedType = widget.initialType;
    _selectedAuthor = widget.initialAuthor;
    _start = widget.initialStart;
    _end = widget.initialEnd;
    _includeHidden = widget.initialIncludeHidden;
    _startCtl = TextEditingController(text: _start != null ? _fmt(_start!) : '');
    _endCtl = TextEditingController(text: _end != null ? _fmt(_end!) : '');
  }

  @override
  void dispose() {
    _startCtl.dispose();
    _endCtl.dispose();
    super.dispose();
  }

  String _fmt(DateTime d) => '${d.day.toString().padLeft(2, '0')}.${d.month.toString().padLeft(2, '0')}.${d.year}';

  Future<void> _pickStart() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _start ?? now,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        _start = picked;
        _startCtl.text = _fmt(picked);
        if (_end != null && _end!.isBefore(_start!)) _end = null..toString();
      });
    }
  }

  Future<void> _pickEnd() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _end ?? _start ?? now,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        _end = picked;
        _endCtl.text = _fmt(picked);
        if (_start != null && _start!.isAfter(_end!)) _start = null..toString();
      });
    }
  }

  void _reset() {
    setState(() {
      _selectedType = null;
      _selectedAuthor = null;
      _start = null;
      _end = null;
      _includeHidden = false;
      _startCtl.text = '';
      _endCtl.text = '';
    });
  }

  void _apply() {
    if (_start != null && _end != null && _start!.isAfter(_end!)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Дата начала не может быть позже даты конца')));
      return;
    }

    final result = DocumentFilterResult(
      type: _selectedType,
      author: _selectedAuthor,
      start: _start,
      end: _end,
      includeHidden: _includeHidden,
    );

    Navigator.of(context).pop(result);
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width * (MediaQuery.of(context).size.width > 900 ? 0.44 : 0.92);
    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: width, maxHeight: MediaQuery.of(context).size.height * 0.86),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 18, 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  const Expanded(child: Text('Фильтры для документов', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700))),
                  IconButton(
                    icon: const Icon(Icons.close, size: 22),
                    onPressed: () => Navigator.of(context).pop(), // отмена
                  ),
                ],
              ),

              const SizedBox(height: 8),

              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 8),
                      const Text('Тип документа', style: TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        value: _selectedType,
                        items: [null, ..._types].map((v) {
                          return DropdownMenuItem<String>(
                            value: v,
                            child: Text(v ?? 'Любой'),
                          );
                        }).toList(),
                        onChanged: (v) => setState(() => _selectedType = v),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),

                      const SizedBox(height: 14),


                      const Text('Автор документа', style: TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        value: _selectedAuthor,
                        items: [null, ..._authors].map((v) {
                          return DropdownMenuItem<String>(
                            value: v,
                            child: Text(v ?? 'Любой'),
                          );
                        }).toList(),
                        onChanged: (v) => setState(() => _selectedAuthor = v),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),

                      const SizedBox(height: 14),

                      const Text('Дата создания', style: TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _startCtl,
                              readOnly: true,
                              onTap: _pickStart,
                              decoration: InputDecoration(
                                hintText: 'Дата начала',
                                suffixIcon: IconButton(icon: const Icon(Icons.calendar_today_outlined), onPressed: _pickStart),
                                filled: true,
                                fillColor: Colors.white,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: _endCtl,
                              readOnly: true,
                              onTap: _pickEnd,
                              decoration: InputDecoration(
                                hintText: 'Дата конца',
                                suffixIcon: IconButton(icon: const Icon(Icons.calendar_today_outlined), onPressed: _pickEnd),
                                filled: true,
                                fillColor: Colors.white,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Скрытые документы', style: TextStyle(fontWeight: FontWeight.w600)),
                          Switch(value: _includeHidden, onChanged: (v) => setState(() => _includeHidden = v)),
                        ],
                      ),

                      const SizedBox(height: 18),
                    ],
                  ),
                ),
              ),


              Row(
                children: [
                  OutlinedButton(
                    onPressed: _reset,
                    style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12), side: const BorderSide(color: Color(0xFF50BFE0))),
                    child: const Text('Сбросить', style: TextStyle(color: Color(0xFF50BFE0))),
                  ),
                  const Spacer(),
                  ElevatedButton(
                    onPressed: _apply,
                    style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12), backgroundColor: const Color(0xFF27A7D5)),
                    child: const Text('Применить'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
