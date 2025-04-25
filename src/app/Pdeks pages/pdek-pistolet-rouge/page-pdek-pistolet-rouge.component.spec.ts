import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePdekPistoletRougeComponent } from './page-pdek-pistolet-rouge.component';

describe('PagePdekPistoletRougeComponent', () => {
  let component: PagePdekPistoletRougeComponent;
  let fixture: ComponentFixture<PagePdekPistoletRougeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePdekPistoletRougeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePdekPistoletRougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
