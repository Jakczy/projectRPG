import { TestBed } from '@angular/core/testing';

import { DialoguesService } from './dialogues.service';

describe('DialoguesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialoguesService = TestBed.get(DialoguesService);
    expect(service).toBeTruthy();
  });
});
