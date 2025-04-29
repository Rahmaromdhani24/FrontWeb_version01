import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekSertissageIDCSimpleComponent } from './pdek-sertissage-idcsimple.component';

describe('PdekSertissageIDCSimpleComponent', () => {
  let component: PdekSertissageIDCSimpleComponent;
  let fixture: ComponentFixture<PdekSertissageIDCSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekSertissageIDCSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekSertissageIDCSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
