import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePDEKComponent } from './liste-pdek.component';

describe('ListePDEKComponent', () => {
  let component: ListePDEKComponent;
  let fixture: ComponentFixture<ListePDEKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePDEKComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListePDEKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
