import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekSertissageIDCComponent } from './pdek-sertissage-idc.component';

describe('PdekSertissageIDCComponent', () => {
  let component: PdekSertissageIDCComponent;
  let fixture: ComponentFixture<PdekSertissageIDCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekSertissageIDCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekSertissageIDCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
