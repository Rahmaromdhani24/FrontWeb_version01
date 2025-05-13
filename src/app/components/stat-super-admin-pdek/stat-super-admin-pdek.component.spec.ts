import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatSuperAdminPDEKComponent } from './stat-super-admin-pdek.component';

describe('StatSuperAdminPDEKComponent', () => {
  let component: StatSuperAdminPDEKComponent;
  let fixture: ComponentFixture<StatSuperAdminPDEKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatSuperAdminPDEKComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatSuperAdminPDEKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
