import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPistoletMecaniqueComponent } from './add-pistolet-mecanique.component';

describe('AddPistoletMecaniqueComponent', () => {
  let component: AddPistoletMecaniqueComponent;
  let fixture: ComponentFixture<AddPistoletMecaniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPistoletMecaniqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPistoletMecaniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
