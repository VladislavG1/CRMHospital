import 'package:get_it/get_it.dart';
import 'package:maincrm/features/documents/domain/repositories/task_repository.dart';
import 'package:maincrm/features/documents/data/repositories/task_repository_impl.dart';

final di = GetIt.instance;

class Injector {
  static Future<void> setup() async {
    // Пример регистрации
    di.registerLazySingleton<TaskRepository>(() => TaskRepositoryImpl());
    
  }
}
