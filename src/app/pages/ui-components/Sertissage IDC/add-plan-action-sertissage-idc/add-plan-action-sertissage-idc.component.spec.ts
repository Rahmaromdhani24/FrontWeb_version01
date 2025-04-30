import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanActionSertissageIDCComponent } from './add-plan-action-sertissage-idc.component';

describe('AddPlanActionSertissageIDCComponent', () => {
  let component: AddPlanActionSertissageIDCComponent;
  let fixture: ComponentFixture<AddPlanActionSertissageIDCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlanActionSertissageIDCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlanActionSertissageIDCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
