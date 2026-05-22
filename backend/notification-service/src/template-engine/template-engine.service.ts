import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TemplateEngineService {
    private readonly logger = new Logger(TemplateEngineService.name);

    private readonly templates: Record<string, string> = {
        'TASK_CREATED': 'Создана новая задача "{task_name}". Постановщик: {creator_name}.',
        'TASK_ASSIGNED': 'Вы назначены исполнителем по задаче "{task_name}". Постановщик: {creator_name}.',
        'STATUS_CHANGED': 'Статус задачи "{task_name}" изменен с "{old_status}" на "{new_status}".',
        'TASK_REJECTED': 'Задача "{task_name}" отклонена и возвращена на доработку. Причина: {comment}.',
        'COMMENT_ADDED': 'Пользователь {user_name} оставил комментарий к задаче "{task_name}": "{comment}".'
    };

    renderByType(typeName: string, context: Record<string, any>): string {
        const template = this.templates[typeName];
        
        if (!template) {
            this.logger.warn(`Шаблон для типа уведомления "${typeName}" не найден. Возвращен пустой текст.`);
            return '';
        }

        return this.compile(template, context);
    }

    compile(template: string, context: Record<string, any>): string {
        return template.replace(/{([^{}]+)}/g, (match, key) => {
            const value = context[key.trim()];
            return value !== undefined ? String(value) : match;
        });
    }
}