import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPistoletJauneComponent } from './add-pistolet-jaune.component';

describe('AddPistoletJauneComponent', () => {
  let component: AddPistoletJauneComponent;
  let fixture: ComponentFixture<AddPistoletJauneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPistoletJauneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPistoletJauneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
