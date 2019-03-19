import { TestBed } from '@angular/core/testing';

import { PlayerNarratorService } from './player-narrator.service';

describe('PlayerNarratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerNarratorService = TestBed.get(PlayerNarratorService);
    expect(service).toBeTruthy();
  });
});
