import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePdekPistoletComponent } from './liste-pdek-pistolet.component';

describe('ListePdekPistoletComponent', () => {
  let component: ListePdekPistoletComponent;
  let fixture: ComponentFixture<ListePdekPistoletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePdekPistoletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListePdekPistoletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
