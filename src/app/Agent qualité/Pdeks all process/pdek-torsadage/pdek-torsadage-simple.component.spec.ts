import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekTorsadageSimpleComponent } from './pdek-torsadage-simple.component';

describe('PdekTorsadageSimpleComponent', () => {
  let component: PdekTorsadageSimpleComponent;
  let fixture: ComponentFixture<PdekTorsadageSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekTorsadageSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekTorsadageSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
