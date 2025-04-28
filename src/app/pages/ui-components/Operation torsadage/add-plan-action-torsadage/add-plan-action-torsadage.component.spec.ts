import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanActionTorsadageComponent } from './add-plan-action-torsadage.component';

describe('AddPlanActionTorsadageComponent', () => {
  let component: AddPlanActionTorsadageComponent;
  let fixture: ComponentFixture<AddPlanActionTorsadageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlanActionTorsadageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlanActionTorsadageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
