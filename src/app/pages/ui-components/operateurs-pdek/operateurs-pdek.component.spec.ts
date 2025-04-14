import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateursPdekComponent } from './operateurs-pdek.component';

describe('OperateursPdekComponent', () => {
  let component: OperateursPdekComponent;
  let fixture: ComponentFixture<OperateursPdekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperateursPdekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperateursPdekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
