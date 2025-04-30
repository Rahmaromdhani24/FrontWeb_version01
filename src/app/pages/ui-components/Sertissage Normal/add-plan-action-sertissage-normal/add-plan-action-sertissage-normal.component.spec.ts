import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanActionSertissageNormalComponent } from './add-plan-action-sertissage-normal.component';

describe('AddPlanActionSertissageNormalComponent', () => {
  let component: AddPlanActionSertissageNormalComponent;
  let fixture: ComponentFixture<AddPlanActionSertissageNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlanActionSertissageNormalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlanActionSertissageNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
