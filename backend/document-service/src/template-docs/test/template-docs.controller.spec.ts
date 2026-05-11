import { Test, TestingModule } from '@nestjs/testing';
import { TemplateDocsController } from '../template-docs.controller';

describe('TemplateDocsController', () => {
  let controller: TemplateDocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateDocsController],
    }).compile();

    controller = module.get<TemplateDocsController>(TemplateDocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
