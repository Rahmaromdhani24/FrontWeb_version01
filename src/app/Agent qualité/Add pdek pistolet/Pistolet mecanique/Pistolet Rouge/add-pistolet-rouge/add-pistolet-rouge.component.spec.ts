import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPistoletRougeComponent } from './add-pistolet-rouge.component';

describe('AddPistoletRougeComponent', () => {
  let component: AddPistoletRougeComponent;
  let fixture: ComponentFixture<AddPistoletRougeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPistoletRougeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPistoletRougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
