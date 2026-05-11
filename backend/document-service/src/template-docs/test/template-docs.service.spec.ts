import { Test, TestingModule } from '@nestjs/testing';
import { TemplateDocsService } from '../template-docs.service';

describe('TemplateDocsService', () => {
  let service: TemplateDocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateDocsService],
    }).compile();

    service = module.get<TemplateDocsService>(TemplateDocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
