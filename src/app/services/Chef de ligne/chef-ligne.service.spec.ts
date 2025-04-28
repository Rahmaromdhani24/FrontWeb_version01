import { TestBed } from '@angular/core/testing';

import { ChefLigneService } from './chef-ligne.service';

describe('ChefLigneService', () => {
  let service: ChefLigneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChefLigneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
