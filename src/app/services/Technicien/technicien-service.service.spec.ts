import { TestBed } from '@angular/core/testing';

import { TechnicienServiceService } from './technicien-service.service';

describe('TechnicienServiceService', () => {
  let service: TechnicienServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicienServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
