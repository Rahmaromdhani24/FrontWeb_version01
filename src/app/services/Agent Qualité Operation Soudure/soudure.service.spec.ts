import { TestBed } from '@angular/core/testing';

import { SoudureService } from './soudure.service';

describe('SoudureService', () => {
  let service: SoudureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoudureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
