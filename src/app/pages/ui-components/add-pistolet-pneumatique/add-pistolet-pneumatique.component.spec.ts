import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPistoletPneumatiqueComponent } from './add-pistolet-pneumatique.component';

describe('AddPistoletPneumatiqueComponent', () => {
  let component: AddPistoletPneumatiqueComponent;
  let fixture: ComponentFixture<AddPistoletPneumatiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPistoletPneumatiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPistoletPneumatiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
