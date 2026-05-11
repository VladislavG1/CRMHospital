import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageGatewayController } from '../file-storage-gateway.controller';

describe('FileStorageGatewayController', () => {
  let controller: FileStorageGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileStorageGatewayController],
    }).compile();

    controller = module.get<FileStorageGatewayController>(FileStorageGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
