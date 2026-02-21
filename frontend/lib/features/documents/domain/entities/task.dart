import 'package:flutter/foundation.dart';

enum TaskTab { inbox, outgoing, approval }

enum ApprovalStatus { pending, inProgress, approved, rejected }

class ApprovalStage {
  final String fio;
  final String department;
  final DateTime handedAt;
  final ApprovalStatus status;

  const ApprovalStage({
    required this.fio,
    required this.department,
    required this.handedAt,
    required this.status,
  });

  ApprovalStage copyWith({
    String? fio,
    String? department,
    DateTime? handedAt,
    ApprovalStatus? status,
  }) {
    return ApprovalStage(
      fio: fio ?? this.fio,
      department: department ?? this.department,
      handedAt: handedAt ?? this.handedAt,
      status: status ?? this.status,
    );
  }
}

class Task {
  final String id;
  final String title;
  final String description;
  final String sender;
  final String department;
  final DateTime date;
  final DateTime dueDate;
  final bool hasAttachment;
  final bool pinned;
  final bool read;
  final TaskTab tab;
  final List<ApprovalStage> approvals;

  const Task({
    required this.id,
    required this.title,
    required this.description,
    required this.sender,
    required this.department,
    required this.date,
    required this.dueDate,
    this.hasAttachment = false,
    this.pinned = false,
    this.read = false,
    required this.tab,
    this.approvals = const [],
  });

  Task copyWith({
    String? id,
    String? title,
    String? description,
    String? sender,
    String? department,
    DateTime? date,
    DateTime? dueDate,
    bool? hasAttachment,
    bool? pinned,
    bool? read,
    TaskTab? tab,
    List<ApprovalStage>? approvals,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      sender: sender ?? this.sender,
      department: department ?? this.department,
      date: date ?? this.date,
      dueDate: dueDate ?? this.dueDate,
      hasAttachment: hasAttachment ?? this.hasAttachment,
      pinned: pinned ?? this.pinned,
      read: read ?? this.read,
      tab: tab ?? this.tab,
      approvals: approvals ?? List<ApprovalStage>.from(this.approvals),
    );
  }
}
