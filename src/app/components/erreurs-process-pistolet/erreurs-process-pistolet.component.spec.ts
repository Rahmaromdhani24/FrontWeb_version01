import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreursProcessPistoletComponent } from './erreurs-process-pistolet.component';

describe('ErreursProcessPistoletComponent', () => {
  let component: ErreursProcessPistoletComponent;
  let fixture: ComponentFixture<ErreursProcessPistoletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErreursProcessPistoletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErreursProcessPistoletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
