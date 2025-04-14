import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDetailsModalComponent } from './operator-details-modal.component';

describe('OperatorDetailsModalComponent', () => {
  let component: OperatorDetailsModalComponent;
  let fixture: ComponentFixture<OperatorDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
