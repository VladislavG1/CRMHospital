import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:maincrm/core/di/injector.dart';
import 'package:maincrm/core/theme.dart';
import 'package:maincrm/features/documents/domain/entities/task.dart';
import 'package:maincrm/features/documents/domain/repositories/task_repository.dart';
import 'package:maincrm/features/documents/presentation/widgets/task_card.dart';
import 'package:maincrm/shared_widgets/app_sidebar.dart';
import 'package:maincrm/shared_widgets/app_header.dart';


enum _ConfirmChoice { delete, archive }

class DocumentsPage extends StatefulWidget {
  const DocumentsPage({super.key});
  @override
  State<DocumentsPage> createState() => _DocumentsPageState();
}

class _DocumentsPageState extends State<DocumentsPage> {
  final TaskRepository _repo = di<TaskRepository>();
  final TextEditingController _searchController = TextEditingController();

  List<Task> _all = [];
  Set<String> _selectedIds = {};
  Set<String> _archivedIds = {}; // архивированные
  TaskTab _activeTab = TaskTab.approval;
  int _notificationCount = 3;
  FilterOptions? _appliedFilter;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // тест
    await Future.delayed(const Duration(milliseconds: 300));

    final now = DateTime.now();

    final List<Task> mock = [
      Task(
        id: '1',
        title: 'Проведение периодической аккредитации',
        description: 'Подготовить документы для аккредитации сотрудников',
        sender: 'Сидоров С.С.',
        department: 'Отдел контроля',
        date: DateTime(now.year, 6, 23),
        dueDate: DateTime(now.year, 6, 29),
        hasAttachment: true,
        pinned: false,
        tab: TaskTab.inbox,
        approvals: [
          ApprovalStage(fio: 'Петров П.П.', department: 'Юридический', handedAt: DateTime(now.year, 6, 20), status: ApprovalStatus.pending),
        ],
      ),
      Task(
        id: '2',
        title: 'Отчет о "Наименовании отчета"',
        description: 'Отчет о выполнении задач по проекту №456/П',
        sender: 'Петров П.П.',
        department: 'Финансы',
        date: DateTime(now.year, 6, 23),
        dueDate: DateTime(now.year, 6, 25),
        hasAttachment: true,
        pinned: true,
        tab: TaskTab.inbox,
        approvals: [
          ApprovalStage(fio: 'Смирнов С.', department: 'Проектный офис', handedAt: DateTime(now.year, 6, 22), status: ApprovalStatus.rejected),
        ],
      ),
      Task(
        id: '3',
        title: 'Список сотрудников на периодическую аккредитацию',
        description: 'Формирование списка сотрудников, подлежащих проверке',
        sender: 'Дмитрин Д.Д.',
        department: 'Кадры',
        date: DateTime(now.year, 6, 23),
        dueDate: DateTime(now.year, 6, 29),
        hasAttachment: false,
        pinned: false,
        tab: TaskTab.approval,
        approvals: [
          ApprovalStage(fio: 'Иванова О.', department: 'Директор', handedAt: DateTime(now.year, 6, 23), status: ApprovalStatus.pending),
        ],
      ),
      Task(
        id: '4',
        title: 'Согласовать итоговый план',
        description: 'Согласование плана работ на следующий квартал',
        sender: 'Сидоров С.С.',
        department: 'Планирование',
        date: DateTime(now.year, 6, 23),
        dueDate: DateTime(now.year, 6, 29),
        hasAttachment: true,
        pinned: false,
        tab: TaskTab.approval,
        approvals: [
          ApprovalStage(fio: 'Кузнецова А.', department: 'Юридический', handedAt: DateTime(now.year, 6, 21), status: ApprovalStatus.inProgress),
          ApprovalStage(fio: 'Иванов И.И.', department: 'Директор', handedAt: DateTime(now.year, 6, 23), status: ApprovalStatus.pending),
        ],
      ),
      Task(
        id: '5',
        title: 'Завершение подготовки отчётов',
        description: 'Завершить формирование итогового отчёта',
        sender: 'Бухгалтерия',
        department: 'Финансы',
        date: DateTime(now.year, 6, 23),
        dueDate: DateTime(now.year, 6, 29),
        hasAttachment: false,
        pinned: false,
        tab: TaskTab.outgoing,
        approvals: [
          ApprovalStage(fio: 'Петров П.П.', department: 'Финансы', handedAt: DateTime(now.year, 6, 22), status: ApprovalStatus.approved),
        ],
      ),
      Task(
        id: '6',
        title: 'Промежуточная проверка',
        description: 'Проверить текущие результаты по проекту',
        sender: 'Сергеев С.С.',
        department: 'Контроль качества',
        date: DateTime(now.year, 6, 20),
        dueDate: DateTime(now.year, 6, 28),
        hasAttachment: true,
        pinned: true,
        tab: TaskTab.approval,
        approvals: [
          ApprovalStage(fio: 'Петров П.П.', department: 'Финансы', handedAt: DateTime(now.year, 6, 21), status: ApprovalStatus.approved),
          ApprovalStage(fio: 'Козлова М.', department: 'Отдел контроля', handedAt: DateTime(now.year, 6, 22), status: ApprovalStatus.inProgress),
        ],
      ),
    ];

    setState(() {
      _all = mock;
      _selectedIds.clear();
    });
  }

  List<Task> get _visible {
    final query = _searchController.text.trim().toLowerCase();
    final f = _appliedFilter;
    return _all.where((t) {
      if (t.tab != _activeTab) return false;
      if (_archivedIds.contains(t.id)) return false; // архивированные
      if (query.isNotEmpty &&
          !(t.title.toLowerCase().contains(query) ||
              t.description.toLowerCase().contains(query) ||
              t.sender.toLowerCase().contains(query))) return false;
      if (f != null) {
        if (f.start != null && t.date.isBefore(f.start!)) return false;
        if (f.end != null && t.date.isAfter(f.end!)) return false;
        if (f.senderQuery.isNotEmpty && !t.sender.toLowerCase().contains(f.senderQuery.toLowerCase())) return false;
        if (f.departmentQuery.isNotEmpty && !t.department.toLowerCase().contains(f.departmentQuery.toLowerCase())) return false;
        if (f.pinnedOnly && !t.pinned) return false;
        if (f.withAttachmentOnly && !t.hasAttachment) return false;
      }
      return true;
    }).toList();
  }

  Future<void> _pinSelected() async {
    for (var id in _selectedIds) {
      final t = _all.firstWhere((e) => e.id == id);
      final updated = t.copyWith(pinned: true);
      await _repo.updateTask(updated);
    }
    _selectedIds.clear();
    await _load();
  }

  Future<void> _markReadSelected() async {
    for (var id in _selectedIds) {
      final t = _all.firstWhere((e) => e.id == id);
      final updated = t.copyWith(read: true);
      await _repo.updateTask(updated);
    }
    _selectedIds.clear();
    await _load();
  }

  /// выйду в окно
  Future<void> _confirmReadAndRemoveOrArchive(Task task) async {
  final choice = await showGeneralDialog<_ConfirmChoice>(
    context: context,
    barrierDismissible: true,
    barrierLabel: 'confirm_action',
    barrierColor: Colors.black.withOpacity(0.28),
    transitionDuration: const Duration(milliseconds: 220),
    pageBuilder: (ctx, anim1, anim2) {
      return const SizedBox.shrink();
    },
    transitionBuilder: (ctx, anim, sec, child) {
      final size = MediaQuery.of(ctx).size;
      final width = size.width > 900 ? 720.0 : size.width * 0.92;
      final scale = Tween(begin: 0.98, end: 1.0).animate(CurvedAnimation(parent: anim, curve: Curves.easeOut));
      return SafeArea(
        child: Center(
          child: FadeTransition(
            opacity: anim,
            child: ScaleTransition(
              scale: scale,
              child: Material(
                color: Colors.transparent,
                child: Container(
                  width: width,
                  decoration: BoxDecoration(
                    color: Theme.of(ctx).cardColor,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: const [
                      BoxShadow(color: Colors.black26, blurRadius: 20, offset: Offset(0, 8)),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 18.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          children: [
                            const Expanded(child: Text('Подтвердите действие', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700))),
                            InkWell(
                              borderRadius: BorderRadius.circular(12),
                              onTap: () => Navigator.of(ctx).pop(null),
                              child: const Padding(
                                padding: EdgeInsets.all(6.0),
                                child: Icon(Icons.close, size: 20),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Действие пометит задачу как прочитанную. Выберите дальнейшее действие:',
                            style: TextStyle(color: Theme.of(ctx).textTheme.bodySmall?.color, fontSize: 13),
                          ),
                        ),
                        const SizedBox(height: 18),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () => Navigator.of(ctx).pop(_ConfirmChoice.archive),
                                style: OutlinedButton.styleFrom(
                                  side: BorderSide(color: AppColors.primary.withOpacity(0.16)),
                                  backgroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                                child: Text('Ознакомиться и архивировать', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700)),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => Navigator.of(ctx).pop(_ConfirmChoice.delete),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                                child: const Text('Ознакомиться и удалить', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
    },
  );

  if (choice == null) return; 

  
  final updated = task.copyWith(read: true);
  await _repo.updateTask(updated);

  if (choice == _ConfirmChoice.delete) {
    await _repo.deleteTask(task.id);
    _selectedIds.remove(task.id);
    _archivedIds.remove(task.id);
    await _load();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Задача удалена')));
    }
  } else if (choice == _ConfirmChoice.archive) { 
    _archivedIds.add(task.id);
    _selectedIds.remove(task.id);
    setState(() {}); 
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Задача перемещена в архив')));
    }
  }
}

  Future<void> _deleteTask(String id) async {
    await _repo.deleteTask(id);
    _selectedIds.remove(id);
    await _load();
  }

  Future<void> _addTaskDialog() async {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    final senderController = TextEditingController();
    final deptController = TextEditingController();
    DateTime due = DateTime.now().add(const Duration(days: 3));
    bool hasAttach = false;
    TaskTab tabForNew = _activeTab;

    await showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Добавить задачу'),
          content: StatefulBuilder(builder: (context, setStateDialog) {
            return SizedBox(
              width: 480,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(controller: titleController, decoration: const InputDecoration(labelText: 'Название')),
                  TextField(controller: descController, decoration: const InputDecoration(labelText: 'Описание')),
                  TextField(controller: senderController, decoration: const InputDecoration(labelText: 'Отправитель')),
                  TextField(controller: deptController, decoration: const InputDecoration(labelText: 'Отдел')),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Text('Срок:'),
                      const SizedBox(width: 8),
                      Text('${due.day}.${due.month}.${due.year}'),
                      const SizedBox(width: 8),
                      TextButton(onPressed: () async {
                        final picked = await showDatePicker(context: context, initialDate: due, firstDate: DateTime.now().subtract(const Duration(days: 365)), lastDate: DateTime.now().add(const Duration(days: 365 * 2)));
                        if (picked != null) setStateDialog(() => due = picked);
                      }, child: const Text('Выбрать')),
                    ],
                  ),
                  Row(children: [Checkbox(value: hasAttach, onChanged: (v) => setStateDialog(() => hasAttach = v ?? false)), const Text('Вложение')]),
                  Row(children: [
                    const Text('Разместить в:'),
                    const SizedBox(width: 8),
                    DropdownButton<TaskTab>(value: tabForNew, items: const [
                      DropdownMenuItem(value: TaskTab.inbox, child: Text('Входящие')),
                      DropdownMenuItem(value: TaskTab.outgoing, child: Text('Исходящие')),
                      DropdownMenuItem(value: TaskTab.approval, child: Text('На согласовании')),
                    ], onChanged: (v) => setStateDialog(() => tabForNew = v ?? TaskTab.inbox)),
                  ]),
                ],
              ),
            );
          }),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Отмена')),
            ElevatedButton(onPressed: () async {
              final title = titleController.text.trim();
              final sender = senderController.text.trim().isEmpty ? 'Не указан' : senderController.text.trim();
              if (title.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Название обязательно')));
                return;
              }
              final task = Task(
                id: DateTime.now().millisecondsSinceEpoch.toString(),
                title: title,
                description: descController.text.trim(),
                sender: sender,
                department: deptController.text.trim().isEmpty ? 'Не указан' : deptController.text.trim(),
                date: DateTime.now(),
                dueDate: due,
                hasAttachment: hasAttach,
                tab: tabForNew,
                approvals: [],
              );
              await _repo.addTask(task);
              Navigator.of(ctx).pop();
              await _load();
            }, child: const Text('Добавить')),
          ],
        );
      },
    );
  }

  Future<void> _openFilterDialog() async {
  
  FilterOptions temp = _appliedFilter?.copy() ?? FilterOptions();

 
  final sendersAll = _all.map((e) => e.sender).toSet().toList()..sort();
  final deptsAll = _all.map((e) => e.department).toSet().toList()..sort();

  await showGeneralDialog(
    context: context,
    barrierDismissible: true,
    barrierLabel: 'filter',
    barrierColor: Colors.black.withOpacity(0.28),
    transitionDuration: const Duration(milliseconds: 240),
    pageBuilder: (ctx, a, b) => const SizedBox.shrink(),
    transitionBuilder: (ctx, anim, sec, child) {
      final size = MediaQuery.of(ctx).size;
      final panelWidth = size.width > 900 ? 380.0 : size.width * 0.92;
      final tween = Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero)
          .animate(CurvedAnimation(parent: anim, curve: Curves.easeOut));

      return SafeArea(
        child: Stack(
          children: [
            BackdropFilter(filter: ui.ImageFilter.blur(sigmaX: 6.0, sigmaY: 6.0), child: Container(color: Colors.black.withOpacity(0))),
            Positioned.fill(child: Container(color: Colors.black.withOpacity(0.12 * anim.value))),
            Align(
              alignment: Alignment.centerRight,
              child: SlideTransition(
                position: tween,
                child: Material(
                  color: Theme.of(ctx).cardColor,
                  elevation: 12,
                  shape: RoundedRectangleBorder(
                    borderRadius: size.width > 600
                        ? const BorderRadius.only(topLeft: Radius.circular(12), bottomLeft: Radius.circular(12))
                        : BorderRadius.zero,
                  ),
                  child: SizedBox(
                    width: panelWidth,
                    height: size.height,
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: StatefulBuilder(builder: (dCtx, setStateDialog) {
                        final senderController = TextEditingController(text: temp.senderQuery);
                        final deptController = TextEditingController(text: temp.departmentQuery);


                        List<String> senderSuggestions() {
                          final q = senderController.text.trim().toLowerCase();
                          if (q.isEmpty) return sendersAll;
                          return sendersAll.where((s) => s.toLowerCase().contains(q)).toList();
                        }

                        List<String> deptSuggestions() {
                          final q = deptController.text.trim().toLowerCase();
                          if (q.isEmpty) return deptsAll;
                          return deptsAll.where((s) => s.toLowerCase().contains(q)).toList();
                        }

                        int matchingCount() {
                          return _all.where((t) {
                            if (temp.start != null && t.date.isBefore(temp.start!)) return false;
                            if (temp.end != null && t.date.isAfter(temp.end!)) return false;
                            if (temp.group == FilterGroup.forReview && t.tab != TaskTab.approval) return false;
                            if (temp.group == FilterGroup.forExecution && t.tab != TaskTab.outgoing) return false;
                            if (temp.senderQuery.isNotEmpty && !t.sender.toLowerCase().contains(temp.senderQuery.toLowerCase())) return false;
                            if (temp.departmentQuery.isNotEmpty && !t.department.toLowerCase().contains(temp.departmentQuery.toLowerCase())) return false;
                            if (temp.pinnedOnly && !t.pinned) return false;
                            if (temp.withAttachmentOnly && !t.hasAttachment) return false;
                            if (_archivedIds.contains(t.id)) return false;
                            return true;
                          }).length;
                        }

                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // кнопка-минус (декоративная) и крестик закрыть
                            Row(
                              children: [
                                // декоративная кнопка
                                InkWell(
                                  borderRadius: BorderRadius.circular(8),
                                  onTap: () {
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(color: Colors.grey.withOpacity(0.06), borderRadius: BorderRadius.circular(8)),
                                    child: const Icon(Icons.remove, size: 18),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Expanded(child: Text('Фильтр', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700))),
                                IconButton(onPressed: () => Navigator.of(ctx).pop(), icon: const Icon(Icons.close)),
                              ],
                            ),
                            const SizedBox(height: 10),

                            // Period
                            const Text('Период', style: TextStyle(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton(
                                    onPressed: () async {
                                      final picked = await showDatePicker(
                                        context: ctx,
                                        initialDate: temp.start ?? DateTime.now(),
                                        firstDate: DateTime.now().subtract(const Duration(days: 365 * 5)),
                                        lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
                                      );
                                      if (picked != null) setStateDialog(() => temp.start = picked);
                                    },
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    child: Align(
                                      alignment: Alignment.centerLeft,
                                      child: Text(temp.start != null ? '${temp.start!.day}.${temp.start!.month}.${temp.start!.year}' : 'Дата начала'),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: OutlinedButton(
                                    onPressed: () async {
                                      final picked = await showDatePicker(
                                        context: ctx,
                                        initialDate: temp.end ?? DateTime.now(),
                                        firstDate: DateTime.now().subtract(const Duration(days: 365 * 5)),
                                        lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
                                      );
                                      if (picked != null) setStateDialog(() => temp.end = picked);
                                    },
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    child: Align(
                                      alignment: Alignment.centerLeft,
                                      child: Text(temp.end != null ? '${temp.end!.day}.${temp.end!.month}.${temp.end!.year}' : 'Дата конца'),
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 12),

                            const Text('Группа задач', style: TextStyle(fontWeight: FontWeight.w600)),
                            RadioListTile<FilterGroup>(
                              title: const Text('На ознакомление'),
                              value: FilterGroup.forReview,
                              groupValue: temp.group,
                              onChanged: (v) => setStateDialog(() => temp.group = v ?? FilterGroup.none),
                              contentPadding: EdgeInsets.zero,
                              dense: true,
                            ),
                            RadioListTile<FilterGroup>(
                              title: const Text('На исполнение'),
                              value: FilterGroup.forExecution,
                              groupValue: temp.group,
                              onChanged: (v) => setStateDialog(() => temp.group = v ?? FilterGroup.none),
                              contentPadding: EdgeInsets.zero,
                              dense: true,
                            ),

                            const SizedBox(height: 8),


                            const Text('Отправитель', style: TextStyle(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 6),
                            TextField(
                              controller: senderController,
                              decoration: const InputDecoration(hintText: 'Введите отправителя', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(8)))),
                              onChanged: (v) => setStateDialog(() => temp.senderQuery = v),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              constraints: const BoxConstraints(maxHeight: 120),
                              child: Card(
                                margin: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                elevation: 0,
                                child: ListView(
                                  padding: EdgeInsets.zero,
                                  shrinkWrap: true,
                                  children: senderSuggestions().map((s) {
                                    return ListTile(
                                      dense: true,
                                      title: Text(s),
                                      onTap: () {
                                        senderController.text = s;
                                        setStateDialog(() => temp.senderQuery = s);
                                      },
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),

                            const SizedBox(height: 10),

                            const Text('Отдел', style: TextStyle(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 6),
                            TextField(
                              controller: deptController,
                              decoration: const InputDecoration(hintText: 'Введите отдел', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(8)))),
                              onChanged: (v) => setStateDialog(() => temp.departmentQuery = v),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              constraints: const BoxConstraints(maxHeight: 120),
                              child: Card(
                                margin: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                elevation: 0,
                                child: ListView(
                                  padding: EdgeInsets.zero,
                                  shrinkWrap: true,
                                  children: deptSuggestions().map((s) {
                                    return ListTile(
                                      dense: true,
                                      title: Text(s),
                                      onTap: () {
                                        deptController.text = s;
                                        setStateDialog(() => temp.departmentQuery = s);
                                      },
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),

                            const SizedBox(height: 10),


                            const Text('Времени осталось', style: TextStyle(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 6),
                            DropdownButtonFormField<String>(
                              value: null,
                              items: const [
                                DropdownMenuItem(value: '1', child: Text('до 1 дня')),
                                DropdownMenuItem(value: '3', child: Text('до 3 дней')),
                                DropdownMenuItem(value: '7', child: Text('до недели')),
                              ],
                              onChanged: (_) {},
                              decoration: InputDecoration(border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)), isDense: true, contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12)),
                            ),

                            const SizedBox(height: 12),


                            Wrap(
                              spacing: 8,
                              children: [
                                FilterChip(
                                  label: const Text('Закрепленные'),
                                  selected: temp.pinnedOnly,
                                  onSelected: (s) => setStateDialog(() => temp.pinnedOnly = s),
                                ),
                                FilterChip(
                                  label: const Text('С приложениями'),
                                  selected: temp.withAttachmentOnly,
                                  onSelected: (s) => setStateDialog(() => temp.withAttachmentOnly = s),
                                ),
                              ],
                            ),

                            const SizedBox(height: 12),


                            Row(
                              children: [
                                Expanded(
                                  child: Text('${matchingCount()} совпадение(й)', style: const TextStyle(color: Colors.black54)),
                                ),
                                const SizedBox(width: 8),
                                SizedBox(
                                  width: 160,
                                  child: ElevatedButton(
                                    onPressed: () {
                                      setState(() {
                                        _appliedFilter = temp;
                                        _selectedIds.clear();
                                      });
                                      Navigator.of(ctx).pop();
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primary,
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    child: Text('Применить (${matchingCount()})', style: const TextStyle(fontWeight: FontWeight.w700)),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        );
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    },
  );
}


  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(onPressed: _addTaskDialog, icon: const Icon(Icons.add), label: const Text('+ Добавить задачу')),
      body: SafeArea(
        child: LayoutBuilder(builder: (context, constraints) {
          final maxWidth = constraints.maxWidth;
          final sidebarWidth = maxWidth > 1000 ? 240.0 : (maxWidth > 600 ? 96.0 : 56.0);

          return Row(children: [
            AppSidebar(width: sidebarWidth, active: 'tasks'),
            Expanded(
              child: Column(
                children: [
                  AppHeader(
                    searchController: _searchController,
                    notificationCount: _notificationCount,
                    onSearchChanged: (_) => setState(() {}),
                    onNotificationsPressed: () {
                      setState(() {
                        if (_notificationCount > 0) _notificationCount--;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Нажата кнопка уведомлений. Осталось: $_notificationCount')));
                    },
                  ),

                  // табы
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
                    child: Row(children: [
                      _tabPill('Входящие', TaskTab.inbox),
                      const SizedBox(width: 10),
                      _tabPill('Исходящие', TaskTab.outgoing),
                      const SizedBox(width: 10),
                      _tabPill('На согласовании', TaskTab.approval),
                      const Spacer(),
                      InkWell(
                        borderRadius: BorderRadius.circular(8),
                        onTap: _openFilterDialog,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8), boxShadow: const [BoxShadow(color: Color(0x05000000), blurRadius: 4, offset: Offset(0, 1))]),
                          child: Row(children: const [Icon(Icons.filter_list), SizedBox(width: 8), Text('Фильтр')]),
                        ),
                      ),
                      const SizedBox(width: 12),
                      ElevatedButton.icon(
                        onPressed: _addTaskDialog,
                        icon: const Icon(Icons.add),
                        label: const Text('+ Добавить задачу'),
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                      ),
                    ]),
                  ),

                  // Действия
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 200),
                      child: _selectedIds.isNotEmpty
                          ? Row(
                              key: const ValueKey('actions_visible'),
                              children: [
                                _actionPill('Закрепить', Icons.push_pin_outlined, _pinSelected),
                                const SizedBox(width: 8),
                                _actionPill('Скачать файл', Icons.download_outlined, () {}),
                                const SizedBox(width: 8),
                                _actionPill('Ознакомиться', Icons.remove_red_eye_outlined, _markReadSelected),
                                const Spacer(),
                                _actionPill('Убрать выделенное', Icons.clear, () => setState(() => _selectedIds.clear())),
                                const SizedBox(width: 8),
                                _actionPill('Выделить все', Icons.select_all, () => setState(() => _selectedIds = _visible.map((e) => e.id).toSet())),
                              ],
                            )
                          : const SizedBox(key: ValueKey('actions_hidden')),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Список карточек
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 18),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        child: _visible.isEmpty
                            ? Center(child: Text('Нет задач в этой вкладке', style: TextStyle(color: Theme.of(context).hintColor)))
                            : ListView.separated(
                                itemCount: _visible.length,
                                separatorBuilder: (_, __) => const SizedBox(height: 10),
                                itemBuilder: (ctx, idx) {
                                  final t = _visible[idx];
                                  final selected = _selectedIds.contains(t.id);
                                  return TaskCard(
                                    task: t,
                                    selected: selected,
                                    onSelectChanged: (v) => setState(() {
                                      if (v) _selectedIds.add(t.id);
                                      else _selectedIds.remove(t.id);
                                    }),
                                    onDelete: () async {
                                      await _confirmReadAndRemoveOrArchive(t);
                                    },
                                    onUpdate: (updated) async {
                                      await _repo.updateTask(updated);
                                      await _load();
                                    },
                                  );
                                },
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

  Widget _tabPill(String label, TaskTab tab) {
    final active = _activeTab == tab;
    return GestureDetector(
      onTap: () => setState(() {
        _activeTab = tab;
        _selectedIds.clear();
      }),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: active ? AppColors.tabActive : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(label, style: TextStyle(fontWeight: active ? FontWeight.w700 : FontWeight.w500)),
      ),
    );
  }

  Widget _actionPill(String label, IconData icon, VoidCallback onTap) {
    return InkWell(
      borderRadius: BorderRadius.circular(999),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(999), color: Colors.grey.withOpacity(0.06)),
        child: Row(children: [Icon(icon, size: 16), const SizedBox(width: 8), Text(label)]),
      ),
    );
  }
}

class FilterOptions {
  DateTime? start;
  DateTime? end;
  FilterGroup group;
  String senderQuery;
  String departmentQuery;
  bool pinnedOnly;
  bool withAttachmentOnly;

  FilterOptions({this.start, this.end, this.group = FilterGroup.none, this.senderQuery = '', this.departmentQuery = '', this.pinnedOnly = false, this.withAttachmentOnly = false});

  FilterOptions copy() => FilterOptions(start: start, end: end, group: group, senderQuery: senderQuery, departmentQuery: departmentQuery, pinnedOnly: pinnedOnly, withAttachmentOnly: withAttachmentOnly);
}

enum FilterGroup { none, forReview, forExecution }
