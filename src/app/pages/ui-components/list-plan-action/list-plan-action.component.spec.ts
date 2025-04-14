import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlanActionComponent } from './list-plan-action.component';

describe('ListPlanActionComponent', () => {
  let component: ListPlanActionComponent;
  let fixture: ComponentFixture<ListPlanActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlanActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlanActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
