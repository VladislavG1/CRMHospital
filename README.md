### Backend CRM системы для медицинского учреждения
Разработка микросервисной архитектуры с использованием фреймворка NestJS на TypeScript.
Стек технологий:
1. TypeScript (NestJS)
2. PostgreSQL (Prisma ORM)
3. Docker
4. Nginx
5. Kafka
6. Swagger (автоматизация через NestJS)

### Архитектура проекта
В архитектуре проекта прослеживается общая структура, основанная на специфике организации работы в фреймворке NestJS:
1. MicroService - полностью автономный блок, имеющий собственную СУБД, работающую на Prisma ORM.
2. Nginx - входные ворота проекта, принимающие запросы от пользователей и перенаправляющие их в нужный микросервис.
3. Docker-compose и Dockerfile - упаковка микросервисов в изолированные контейнеры под общим управлением.
4. Каждый микросервис состоит из типовых составных частей:
   4.1. Prisma - ORM-описание базы данных для микросервиса
   4.2. Service - модуль микросервиса, отвечающий за свою часть логики
   4.2.1. controller.ts - слой обработки запросов, определяющий маршруты, по которым можно обратиться к программе (API запросы)
   4.2.2. service.ts - слой бизнес-логики, в котором описывается реализация для каждого маршрута из контроллера
   4.2.3. module.ts - коробка, объединяющая контроллер и сервис
   4.2.4. Strategies - дополнительная логика проверки JWT-токена на валидность для JWT-модуля
   4.2.5. Guards - охранники на входе в контроллер, описывающие логику защиты доступа к необходимым API запросам
5. Utils - дополнительные инструменты

### Основная структура:
IdentityMicroService
DocumentMicroService
WorkFlowMicroService
NotificationMicroService
CalendarMicroService
EventLogMicroService
nginx
.env
docker-compose.yml

### IdentityMicroService

> Микросервис управления "личностью" пользователя. Включает аутентификацию, управление профилем, системой ролей, разрешениями и департаментами.

prisma - 
 - prisma client 
 - schema.prisma

src
 - AuthService
    - controller
    - service
    - module
 - UserService
    - controller
    - service
    - module
 - JwtService
    - guards
    - interfaces
    - strategies
    - service
    - module
 - PermissionService
    - controller
    - service
    - module
 - DepartmentService
    - controller
    - service
    - module
 - RedisService
    - module
 - Utils
    - Decorator
    - ApiDecorator
    - interface
 - prisma.service.ts
 - app.module.ts
 - main.ts

Tests
.prettierrc
Dockerfile
eslint.config.mjs
nest-cli.json
package.json
tsconfig.build.json
tsconfig.json

### DocumentMicroService

> Микросервис управления документами. Включает документы, их статусы и прикрепленные файлы.

prisma - 
 - prisma client 
 - schema.prisma

src
 - DocumentsService
    - controller
    - service
    - module
 - CompletedDocumentsService
    - controller
    - service
    - module
 - TemplateDocsService
    - guards
    - interfaces
    - strategies
    - service
    - module
 - FileStorageGatewayService
    - controller
    - service
    - module
 - RedisService
    - module
 - Utils
    - Decorator
    - ApiDecorator
    - interface
 - prisma.service.ts
 - app.module.ts
 - main.ts

Tests
.prettierrc
Dockerfile
eslint.config.mjs
nest-cli.json
package.json
tsconfig.build.json
tsconfig.json

### WorkFlowMicroService

> Микросервис управления операционной деятельностью. Включает логику управления задачами и процессом согласования.

prisma - 
 - prisma client 
 - schema.prisma

src
 - TaskService
    - controller
    - service
    - module
 - MassAssignmentService
    - controller
    - service
    - module
 - ApprovalService
    - controller
    - service
    - module
 - CommentService
    - controller
    - service
    - module
- TaskHistoryService
    - controller
    - service
    - module
 - RedisService
    - module
 - Utils
    - Decorator
    - ApiDecorator
    - interface
 - prisma.service.ts
 - app.module.ts
 - main.ts

Tests
.prettierrc
Dockerfile
eslint.config.mjs
nest-cli.json
package.json
tsconfig.build.json
tsconfig.json

### NotificationMicroService

> Микросервис уведомлений. Включает управление очередью уведомлений, формирование текста уведомления и отправку уведомлений (внутри CRM, на почту и внешние интеграции).

prisma - 
 - prisma client 
 - schema.prisma

src
 - NotificationCoreService
    - controller
    - service
    - module
 - TransportService
    - controller
    - service
    - module
 - TemplateEngineService
    - controller
    - service
    - module
 - RedisService
    - module
 - Utils
    - Decorator
    - ApiDecorator
    - interface
 - prisma.service.ts
 - app.module.ts
 - main.ts

Tests
.prettierrc
Dockerfile
eslint.config.mjs
nest-cli.json
package.json
tsconfig.build.json
tsconfig.json

### CalendarMicroService

> Микросервис управления расписанием. Включает управление рабочими сменами отделений, логикой записи пациентов и синхронизацию с задачами.

prisma - 
 - prisma client 
 - schema.prisma

src
 - ScheduleService
    - controller
    - service
    - module
 - AppointmentService
    - controller
    - service
    - module
 - EventSyncService
    - controller
    - service
    - module
 - RedisService
    - module
 - Utils
    - Decorator
    - ApiDecorator
    - interface
 - prisma.service.ts
 - app.module.ts
 - main.ts

Tests
.prettierrc
Dockerfile
eslint.config.mjs
nest-cli.json
package.json
tsconfig.build.json
tsconfig.json

### EventLogMicroService

> Микросервис логирования. Включает запись действий пользователей  и сбор ошибок из всех микросервисов.

prisma - 
 - prisma client 
 - schema.prisma

src
 - AuditService
    - controller
    - service
    - module
 - ErrorTrackerService
    - controller
    - service
    - module
 - RedisService
    - module
 - Utils
    - Decorator
    - ApiDecorator
    - interface
 - prisma.service.ts
 - app.module.ts
 - main.ts

Tests
.prettierrc
Dockerfile
eslint.config.mjs
nest-cli.json
package.json
tsconfig.build.json
tsconfig.json
