import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOperateursComponent } from './list-operateurs.component';

describe('ListOperateursComponent', () => {
  let component: ListOperateursComponent;
  let fixture: ComponentFixture<ListOperateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOperateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOperateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
