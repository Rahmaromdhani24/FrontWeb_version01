import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekTorsadageComponent } from './pdek-torsadage.component';

describe('PdekTorsadageComponent', () => {
  let component: PdekTorsadageComponent;
  let fixture: ComponentFixture<PdekTorsadageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekTorsadageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekTorsadageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
