import { Test, TestingModule } from '@nestjs/testing';
import { SourceConnectionsService } from './source-connections.service';

describe('SourceConnectionsService', () => {
  let service: SourceConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SourceConnectionsService],
    }).compile();

    service = module.get<SourceConnectionsService>(SourceConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
