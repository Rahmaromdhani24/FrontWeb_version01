import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateurDetailsPlanActionModalComponent } from './operateur-details-plan-action-modal.component';

describe('OperateurDetailsPlanActionModalComponent', () => {
  let component: OperateurDetailsPlanActionModalComponent;
  let fixture: ComponentFixture<OperateurDetailsPlanActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperateurDetailsPlanActionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperateurDetailsPlanActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
