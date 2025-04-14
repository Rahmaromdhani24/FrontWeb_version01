import { TestBed } from '@angular/core/testing';

import { PistoletJauneService } from './pistolet-jaune.service';

describe('PistoletJauneService', () => {
  let service: PistoletJauneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PistoletJauneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
