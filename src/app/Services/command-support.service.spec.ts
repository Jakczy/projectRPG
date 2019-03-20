import { TestBed } from '@angular/core/testing';

import { CommandSupportService } from './command-support.service';

describe('CommandSupportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommandSupportService = TestBed.get(CommandSupportService);
    expect(service).toBeTruthy();
  });
});
