import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanActionSoudureComponent } from './add-plan-action-soudure.component';

describe('AddPlanActionSoudureComponent', () => {
  let component: AddPlanActionSoudureComponent;
  let fixture: ComponentFixture<AddPlanActionSoudureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlanActionSoudureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlanActionSoudureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
