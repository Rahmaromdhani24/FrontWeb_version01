import { TestBed } from '@angular/core/testing';

import { PistoletPneumatiqueService } from './pistolet-pneumatique.service';

describe('PistoletPneumatiqueService', () => {
  let service: PistoletPneumatiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PistoletPneumatiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
