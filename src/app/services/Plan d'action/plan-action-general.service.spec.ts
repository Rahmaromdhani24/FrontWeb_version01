import { TestBed } from '@angular/core/testing';

import { PlanActionGeneralService } from './plan-action-general.service';

describe('PlanActionGeneralService', () => {
  let service: PlanActionGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanActionGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
