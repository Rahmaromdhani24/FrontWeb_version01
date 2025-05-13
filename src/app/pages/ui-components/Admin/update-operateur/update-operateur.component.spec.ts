import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOperateurComponent } from './update-operateur.component';

describe('UpdateOperateurComponent', () => {
  let component: UpdateOperateurComponent;
  let fixture: ComponentFixture<UpdateOperateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOperateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOperateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
