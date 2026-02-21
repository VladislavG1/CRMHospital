import { Test, TestingModule } from '@nestjs/testing';
import { FileStoregeGatewayService } from '../file-storege-gateway.service';

describe('FileStoregeGatewayService', () => {
  let service: FileStoregeGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileStoregeGatewayService],
    }).compile();

    service = module.get<FileStoregeGatewayService>(FileStoregeGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
