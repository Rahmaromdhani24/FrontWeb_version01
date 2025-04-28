import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekSoudureSimpleComponent } from './pdek-soudure-simple.component';

describe('PdekSoudureSimpleComponent', () => {
  let component: PdekSoudureSimpleComponent;
  let fixture: ComponentFixture<PdekSoudureSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekSoudureSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekSoudureSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
