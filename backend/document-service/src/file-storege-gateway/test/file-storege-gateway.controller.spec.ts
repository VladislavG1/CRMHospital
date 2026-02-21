import { Test, TestingModule } from '@nestjs/testing';
import { FileStoregeGatewayController } from '../file-storege-gateway.controller';

describe('FileStoregeGatewayController', () => {
  let controller: FileStoregeGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileStoregeGatewayController],
    }).compile();

    controller = module.get<FileStoregeGatewayController>(FileStoregeGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
