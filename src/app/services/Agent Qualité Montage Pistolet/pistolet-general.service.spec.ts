import { TestBed } from '@angular/core/testing';

import { PistoletGeneralService } from './pistolet-general.service';

describe('PistoletGeneralService', () => {
  let service: PistoletGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PistoletGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
