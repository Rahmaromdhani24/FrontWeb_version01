import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutilContactComponent } from './add-outil-contact.component';

describe('AddOutilContactComponent', () => {
  let component: AddOutilContactComponent;
  let fixture: ComponentFixture<AddOutilContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOutilContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOutilContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
