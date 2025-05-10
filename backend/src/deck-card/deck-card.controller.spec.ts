import { Test, TestingModule } from '@nestjs/testing';
import { DeckCardController } from './deck-card.controller';

describe('DeckCardController', () => {
  let controller: DeckCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeckCardController],
    }).compile();

    controller = module.get<DeckCardController>(DeckCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
