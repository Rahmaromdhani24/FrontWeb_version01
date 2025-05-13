import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatSuperAdminComponent } from './stat-super-admin.component';

describe('StatSuperAdminComponent', () => {
  let component: StatSuperAdminComponent;
  let fixture: ComponentFixture<StatSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatSuperAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
