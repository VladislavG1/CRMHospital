import 'dart:async';
import 'package:maincrm/features/documents/domain/entities/task.dart';
import 'package:maincrm/features/documents/domain/repositories/task_repository.dart';

class TaskRepositoryImpl implements TaskRepository {
  final List<Task> _store = [];
  int _idCounter = 1;

  TaskRepositoryImpl() {
    _initDemo();
  }

  void _initDemo() {
    _store.addAll([
      Task(
        id: (_idCounter++).toString(),
        title: 'Проведение периодической аккредитации',
        description: 'Подготовить список сотрудников, согласовать даты и материалы.',
        sender: 'Сидоров С.С.',
        department: 'Отдел контроля',
        date: DateTime.now().subtract(const Duration(days: 7)),
        dueDate: DateTime.now().add(const Duration(days: 5)),
        hasAttachment: true,
        pinned: false,
        tab: TaskTab.approval,
        approvals: [
          ApprovalStage(fio: 'Смирнов С.', department: 'Проектный офис', handedAt: DateTime.now().subtract(const Duration(days: 6)), status: ApprovalStatus.approved),
          ApprovalStage(fio: 'Кузнецова А.', department: 'Юридический', handedAt: DateTime.now().subtract(const Duration(days: 4)), status: ApprovalStatus.inProgress),
          ApprovalStage(fio: 'Иванова О.', department: 'Директор', handedAt: DateTime.now(), status: ApprovalStatus.pending),
        ],
      ),
      Task(
        id: (_idCounter++).toString(),
        title: 'Ежемесячный отчет',
        description: 'Подготовить ежемесячный финансовый отчет.',
        sender: 'Бухгалтерия',
        department: 'Финансы',
        date: DateTime.now().subtract(const Duration(days: 3)),
        dueDate: DateTime.now().add(const Duration(days: 7)),
        hasAttachment: true,
        pinned: true,
        tab: TaskTab.inbox,
      ),
    ]);
  }

  @override
  Future<void> addTask(Task task) async {
    final t = Task(
      id: (_idCounter++).toString(),
      title: task.title,
      description: task.description,
      sender: task.sender,
      department: task.department,
      date: task.date,
      dueDate: task.dueDate,
      hasAttachment: task.hasAttachment,
      pinned: task.pinned,
      read: task.read,
      tab: task.tab,
      approvals: task.approvals,
    );
    _store.add(t);
  }

  @override
  Future<void> deleteTask(String id) async {
    _store.removeWhere((t) => t.id == id);
  }

  @override
  Future<List<Task>> getTasks() async {
    await Future.delayed(const Duration(milliseconds: 120));
    return List<Task>.from(_store);
  }

  @override
  Future<void> updateTask(Task task) async {
    final idx = _store.indexWhere((t) => t.id == task.id);
    if (idx != -1) {
      _store[idx] = task;
    }
  }
}
