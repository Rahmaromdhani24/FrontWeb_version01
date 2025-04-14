import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekPistoletRougeComponent } from './pdek-pistolet-rouge.component';

describe('PdekPistoletRougeComponent', () => {
  let component: PdekPistoletRougeComponent;
  let fixture: ComponentFixture<PdekPistoletRougeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekPistoletRougeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekPistoletRougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
