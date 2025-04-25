import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanActionComponent } from './add-plan-action.component';

describe('AddPlanActionComponent', () => {
  let component: AddPlanActionComponent;
  let fixture: ComponentFixture<AddPlanActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlanActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlanActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
