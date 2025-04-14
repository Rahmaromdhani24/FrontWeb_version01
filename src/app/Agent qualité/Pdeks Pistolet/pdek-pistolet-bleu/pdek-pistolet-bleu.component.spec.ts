import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekPistoletBleuComponent } from './pdek-pistolet-bleu.component';

describe('PdekPistoletBleuComponent', () => {
  let component: PdekPistoletBleuComponent;
  let fixture: ComponentFixture<PdekPistoletBleuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekPistoletBleuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekPistoletBleuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
