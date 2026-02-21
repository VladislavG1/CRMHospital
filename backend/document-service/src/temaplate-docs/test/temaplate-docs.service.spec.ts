import { Test, TestingModule } from '@nestjs/testing';
import { TemaplateDocsService } from '../temaplate-docs.service';

describe('TemaplateDocsService', () => {
  let service: TemaplateDocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemaplateDocsService],
    }).compile();

    service = module.get<TemaplateDocsService>(TemaplateDocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
