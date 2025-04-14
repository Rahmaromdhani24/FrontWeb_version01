import { TestBed } from '@angular/core/testing';

import { PistoletMecaniqueService } from './pistolet-mecanique.service';

describe('PistoletMecaniqueService', () => {
  let service: PistoletMecaniqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PistoletMecaniqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
