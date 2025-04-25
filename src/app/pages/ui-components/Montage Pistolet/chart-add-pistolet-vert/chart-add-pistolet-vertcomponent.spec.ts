import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAddPistoletVertComponent } from './chart-add-pistolet-vert.component';

describe('ChartAddPistoletVertComponent', () => {
  let component: ChartAddPistoletVertComponent;
  let fixture: ComponentFixture<ChartAddPistoletVertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartAddPistoletVertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartAddPistoletVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
