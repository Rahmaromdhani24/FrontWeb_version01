import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsPlanActionsTousProcessComponent } from './lists-plan-actions-tous-process.component';

describe('ListsPlanActionsTousProcessComponent', () => {
  let component: ListsPlanActionsTousProcessComponent;
  let fixture: ComponentFixture<ListsPlanActionsTousProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsPlanActionsTousProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsPlanActionsTousProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
