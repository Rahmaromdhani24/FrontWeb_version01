import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateursPdekSouduresComponent } from './operateurs-pdek-soudures.component';

describe('OperateursPdekSouduresComponent', () => {
  let component: OperateursPdekSouduresComponent;
  let fixture: ComponentFixture<OperateursPdekSouduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperateursPdekSouduresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperateursPdekSouduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
