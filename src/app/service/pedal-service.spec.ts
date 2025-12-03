import { TestBed } from '@angular/core/testing';

import { PedalService } from './pedal-service';

describe('PedalService', () => {
  let service: PedalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
