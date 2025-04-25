import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAddPistoletBleuComponent } from './chart-add-pistolet-bleu.component';

describe('ChartAddPistoletBleuComponent', () => {
  let component: ChartAddPistoletBleuComponent;
  let fixture: ComponentFixture<ChartAddPistoletBleuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartAddPistoletBleuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartAddPistoletBleuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
