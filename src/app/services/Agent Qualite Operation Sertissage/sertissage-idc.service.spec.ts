import { TestBed } from '@angular/core/testing';

import { SertissageIDCService } from './sertissage-idc.service';

describe('SertissageIDCService', () => {
  let service: SertissageIDCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SertissageIDCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
