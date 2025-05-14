import { Test, TestingModule } from '@nestjs/testing';
import { SourceConnectionsController } from './source-connections.controller';
import { SourceConnectionsService } from './source-connections.service';

describe('SourceConnectionsController', () => {
  let controller: SourceConnectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourceConnectionsController],
      providers: [SourceConnectionsService],
    }).compile();

    controller = module.get<SourceConnectionsController>(
      SourceConnectionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
