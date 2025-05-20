import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdekProcessPistoletComponent } from './pdek-process-pistolet.component';

describe('PdekProcessPistoletComponent', () => {
  let component: PdekProcessPistoletComponent;
  let fixture: ComponentFixture<PdekProcessPistoletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdekProcessPistoletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdekProcessPistoletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
