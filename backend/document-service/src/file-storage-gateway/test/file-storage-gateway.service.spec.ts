import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageGatewayService } from '../file-storage-gateway.service';

describe('FileStorageGatewayService', () => {
  let service: FileStorageGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileStorageGatewayService],
    }).compile();

    service = module.get<FileStorageGatewayService>(FileStorageGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
