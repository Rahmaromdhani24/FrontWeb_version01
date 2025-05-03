import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreursParProcessComponent } from './erreurs-par-process.component';

describe('ErreursParProcessComponent', () => {
  let component: ErreursParProcessComponent;
  let fixture: ComponentFixture<ErreursParProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErreursParProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErreursParProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
