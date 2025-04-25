import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekSoudureComponent } from './pdek-soudure.component';

describe('PdekSoudureComponent', () => {
  let component: PdekSoudureComponent;
  let fixture: ComponentFixture<PdekSoudureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekSoudureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekSoudureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
