import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsPdekTousProcessComponent } from './lists-pdek-tous-process.component';

describe('ListsPdekTousProcessComponent', () => {
  let component: ListsPdekTousProcessComponent;
  let fixture: ComponentFixture<ListsPdekTousProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsPdekTousProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsPdekTousProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
