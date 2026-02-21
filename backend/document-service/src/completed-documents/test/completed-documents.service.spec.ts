import { Test, TestingModule } from '@nestjs/testing';
import { CompletedDocumentsService } from '../completed-documents.service';

describe('CompletedDocumentsService', () => {
  let service: CompletedDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompletedDocumentsService],
    }).compile();

    service = module.get<CompletedDocumentsService>(CompletedDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
