import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsAdminComponent } from './lists-admin.component';

describe('ListsAdminComponent', () => {
  let component: ListsAdminComponent;
  let fixture: ComponentFixture<ListsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
