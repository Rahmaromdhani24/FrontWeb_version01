import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsOperateurComponent } from './informations-operateur.component';

describe('InformationsOperateurComponent', () => {
  let component: InformationsOperateurComponent;
  let fixture: ComponentFixture<InformationsOperateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationsOperateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationsOperateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
