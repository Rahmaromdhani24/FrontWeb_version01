import { TestBed } from '@angular/core/testing';

import { PdekService } from './pdek.service';

describe('PdekService', () => {
  let service: PdekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
