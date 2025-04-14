import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPistoletJaunePDFComponent } from './chart-pistolet-jaune-pdf.component';

describe('ChartPistoletJaunePDFComponent', () => {
  let component: ChartPistoletJaunePDFComponent;
  let fixture: ComponentFixture<ChartPistoletJaunePDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartPistoletJaunePDFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartPistoletJaunePDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
