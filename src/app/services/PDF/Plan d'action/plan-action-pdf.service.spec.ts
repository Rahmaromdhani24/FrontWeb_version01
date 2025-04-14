import { TestBed } from '@angular/core/testing';

import { PlanActionPdfService } from './plan-action-pdf.service';

describe('PlanActionPdfService', () => {
  let service: PlanActionPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanActionPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
