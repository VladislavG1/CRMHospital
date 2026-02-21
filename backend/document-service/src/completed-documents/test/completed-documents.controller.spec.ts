import { Test, TestingModule } from '@nestjs/testing';
import { CompletedDocumentsController } from '../completed-documents.controller';

describe('CompletedDocumentsController', () => {
  let controller: CompletedDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletedDocumentsController],
    }).compile();

    controller = module.get<CompletedDocumentsController>(CompletedDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
