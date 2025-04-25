import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAddPistoletRougeComponent } from './chart-add-pistolet-rouge.component';

describe('ChartAddPistoletRougeComponent', () => {
  let component: ChartAddPistoletRougeComponent;
  let fixture: ComponentFixture<ChartAddPistoletRougeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartAddPistoletRougeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartAddPistoletRougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
