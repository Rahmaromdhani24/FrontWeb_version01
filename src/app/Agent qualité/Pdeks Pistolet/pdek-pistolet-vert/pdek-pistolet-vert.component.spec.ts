import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekPistoletVertComponent } from './pdek-pistolet-vert.component';

describe('PdekPistoletVertComponent', () => {
  let component: PdekPistoletVertComponent;
  let fixture: ComponentFixture<PdekPistoletVertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekPistoletVertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekPistoletVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
