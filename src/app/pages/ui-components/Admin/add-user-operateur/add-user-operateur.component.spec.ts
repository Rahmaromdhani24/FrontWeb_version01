import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserOperateurComponent } from './add-user-operateur.component';

describe('AddUserOperateurComponent', () => {
  let component: AddUserOperateurComponent;
  let fixture: ComponentFixture<AddUserOperateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserOperateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserOperateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
