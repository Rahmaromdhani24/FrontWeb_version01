import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAddPistoletJauneComponent } from './chart-add-pistolet-jaune.component';

describe('ChartAddPistoletMecaniqueComponent', () => {
  let component: ChartAddPistoletJauneComponent;
  let fixture: ComponentFixture<ChartAddPistoletJauneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartAddPistoletJauneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartAddPistoletJauneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
