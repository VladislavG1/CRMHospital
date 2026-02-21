import { Test, TestingModule } from '@nestjs/testing';
import { TemaplateDocsController } from '../temaplate-docs.controller';

describe('TemaplateDocsController', () => {
  let controller: TemaplateDocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemaplateDocsController],
    }).compile();

    controller = module.get<TemaplateDocsController>(TemaplateDocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
