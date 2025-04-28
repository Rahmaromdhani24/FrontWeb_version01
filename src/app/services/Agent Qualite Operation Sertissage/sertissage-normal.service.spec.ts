import { TestBed } from '@angular/core/testing';

import { SertissageNormalService } from './sertissage-normal.service';

describe('SertissageNormalService', () => {
  let service: SertissageNormalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SertissageNormalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
