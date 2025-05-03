import { TestBed } from '@angular/core/testing';

import { StatistiquesPistoletService } from './statistiques-pistolet.service';

describe('StatistiquesPistoletService', () => {
  let service: StatistiquesPistoletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatistiquesPistoletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
