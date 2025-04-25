import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateursDetailsPlanActionSoudureComponent } from './operateurs-details-plan-action-soudure.component';

describe('OperateursDetailsPlanActionSoudureComponent', () => {
  let component: OperateursDetailsPlanActionSoudureComponent;
  let fixture: ComponentFixture<OperateursDetailsPlanActionSoudureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperateursDetailsPlanActionSoudureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperateursDetailsPlanActionSoudureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
