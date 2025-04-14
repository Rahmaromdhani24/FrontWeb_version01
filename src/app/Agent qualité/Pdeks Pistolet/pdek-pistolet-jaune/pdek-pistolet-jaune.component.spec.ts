import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekPistoletJauneComponent } from './pdek-pistolet-jaune.component';

describe('PdekPistoletJauneComponent', () => {
  let component: PdekPistoletJauneComponent;
  let fixture: ComponentFixture<PdekPistoletJauneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekPistoletJauneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekPistoletJauneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
