export class CreateHistoryDto {
    task_id: string;
    user_id: string;
    action: string;
    old_value?: string;
    new_value?: string;
}