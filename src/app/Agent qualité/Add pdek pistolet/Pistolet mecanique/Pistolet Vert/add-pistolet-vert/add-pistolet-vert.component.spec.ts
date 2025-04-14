import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPistoletVertComponent } from './add-pistolet-vert.component';

describe('AddPistoletVertComponent', () => {
  let component: AddPistoletVertComponent;
  let fixture: ComponentFixture<AddPistoletVertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPistoletVertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPistoletVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
