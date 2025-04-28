import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekSertissageNormalComponent } from './pdek-sertissage-normal.component';

describe('PdekSertissageNormalComponent', () => {
  let component: PdekSertissageNormalComponent;
  let fixture: ComponentFixture<PdekSertissageNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekSertissageNormalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekSertissageNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
