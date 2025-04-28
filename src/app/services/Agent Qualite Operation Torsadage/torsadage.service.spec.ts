import { TestBed } from '@angular/core/testing';

import { TorsadageService } from './torsadage.service';

describe('TorsadageService', () => {
  let service: TorsadageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TorsadageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
