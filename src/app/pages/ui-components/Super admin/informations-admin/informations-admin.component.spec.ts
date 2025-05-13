import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsAdminComponent } from './informations-admin.component';

describe('InformationsAdminComponent', () => {
  let component: InformationsAdminComponent;
  let fixture: ComponentFixture<InformationsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
