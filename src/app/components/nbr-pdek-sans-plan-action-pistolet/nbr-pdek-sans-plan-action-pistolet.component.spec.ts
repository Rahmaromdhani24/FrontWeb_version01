import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbrPdekSansPlanActionPistoletComponent } from './nbr-pdek-sans-plan-action-pistolet.component';

describe('NbrPdekSansPlanActionPistoletComponent', () => {
  let component: NbrPdekSansPlanActionPistoletComponent;
  let fixture: ComponentFixture<NbrPdekSansPlanActionPistoletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NbrPdekSansPlanActionPistoletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NbrPdekSansPlanActionPistoletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
