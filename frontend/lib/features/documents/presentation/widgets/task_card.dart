import 'package:flutter/material.dart';
import 'package:maincrm/features/documents/domain/entities/task.dart';
import 'package:maincrm/core/theme.dart';


class TaskCard extends StatelessWidget {
  final Task task;
  final bool selected;
  final ValueChanged<bool> onSelectChanged;
  final Future<void> Function() onDelete;
  final Future<void> Function(Task updated) onUpdate;

  const TaskCard({
    super.key,
    required this.task,
    required this.selected,
    required this.onSelectChanged,
    required this.onDelete,
    required this.onUpdate,
  });

  Color _colorForApprovalStatus(ApprovalStatus s) {
    switch (s) {
      case ApprovalStatus.pending:
        return Colors.grey.shade400;
      case ApprovalStatus.inProgress:
        return const Color(0xFFF2C94C); 
      case ApprovalStatus.approved:
        return const Color(0xFF4FBF6A); 
      case ApprovalStatus.rejected:
        return const Color(0xFFE14B4B); 
    }
  }

  IconData _iconForApprovalStatus(ApprovalStatus s) {
    switch (s) {
      case ApprovalStatus.pending:
        return Icons.hourglass_empty;
      case ApprovalStatus.inProgress:
        return Icons.autorenew;
      case ApprovalStatus.approved:
        return Icons.check;
      case ApprovalStatus.rejected:
        return Icons.close;
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = task.approvals.isNotEmpty ? _colorForApprovalStatus(task.approvals.last.status) : Colors.grey.shade300;

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: Stack(
        children: [
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 0.6,
            color: AppColors.cardBg,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(width: 44, child: Checkbox(value: selected, onChanged: (v) => onSelectChanged(v ?? false))),
                  const SizedBox(width: 8),

  
                  Expanded(
                    flex: 6,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Название задачи', style: TextStyle(color: AppColors.primary.withOpacity(0.9), fontSize: 12)),
                        const SizedBox(height: 4),
                        Text(task.title, style: TextStyle(fontSize: 15, fontWeight: task.pinned ? FontWeight.w800 : FontWeight.w700)),
                        const SizedBox(height: 6),
                        Text(task.description, style: const TextStyle(fontSize: 13, color: Colors.black87)),
                      ],
                    ),
                  ),

                  const SizedBox(width: 16),

          
                  Flexible(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Отправитель', style: TextStyle(color: AppColors.primary.withOpacity(0.9), fontSize: 12)),
                        const SizedBox(height: 4),
                        Text(task.sender, style: const TextStyle(fontWeight: FontWeight.w600)),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text('Дата', style: TextStyle(color: AppColors.primary.withOpacity(0.9), fontSize: 12)),
                              const SizedBox(height: 4),
                              Text('${task.date.day}.${task.date.month}.${task.date.year}', style: const TextStyle(fontSize: 12)),
                            ]),
                            const SizedBox(width: 12),
                            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text('Срок', style: TextStyle(color: AppColors.primary.withOpacity(0.9), fontSize: 12)),
                              const SizedBox(height: 4),
                              Text('${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}', style: const TextStyle(fontSize: 12)),
                            ]),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(width: 12),

            
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Row(
                        children: [
                          _smallSquareIcon(Icons.attachment_outlined, AppColors.primary.withOpacity(0.08), AppColors.primary),
                          const SizedBox(width: 8),
                          _smallSquareIcon(Icons.push_pin_outlined, AppColors.pinRed.withOpacity(0.08), AppColors.pinRed),
                          const SizedBox(width: 8),
                          _smallSquareIcon(Icons.description_outlined, Colors.grey.withOpacity(0.06), Colors.black54),
                        ],
                      ),

                      const SizedBox(height: 10),

                      SizedBox(
                        width: 120,
                        child: ElevatedButton(
                          onPressed: () {
                            final updated = task.copyWith(read: true);
                            onUpdate(updated);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            elevation: 0,
                          ),
                          child: Text(
                            task.tab == TaskTab.outgoing ? 'Исполнить' : 'Ознакомиться',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                          ),
                        ),
                      ),

                      const SizedBox(height: 8),


                      Container(
                        decoration: BoxDecoration(borderRadius: BorderRadius.circular(8), color: Colors.red.shade50),
                        child: IconButton(
                          icon: Icon(Icons.delete_outline, color: Colors.red.shade400),
                          onPressed: () => onDelete(),
                          padding: const EdgeInsets.all(6),
                          constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),


          Positioned(
            right: 14,
            top: 6,
            child: Container(
              width: 140,
              height: 8,
              decoration: BoxDecoration(
                color: statusColor,
                borderRadius: const BorderRadius.only(topLeft: Radius.circular(6), bottomLeft: Radius.circular(6)),
              ),
            ),
          ),
        ],
      ),
    );
  }


  Widget _smallSquareIcon(IconData icon, Color bg, Color iconColor) {
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(icon, size: 18, color: iconColor),
    );
  }
}
