import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekSertissageNormalSimpleComponent } from './pdek-sertissage-normal-simple.component';

describe('PdekSertissageNormalSimpleComponent', () => {
  let component: PdekSertissageNormalSimpleComponent;
  let fixture: ComponentFixture<PdekSertissageNormalSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekSertissageNormalSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekSertissageNormalSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
