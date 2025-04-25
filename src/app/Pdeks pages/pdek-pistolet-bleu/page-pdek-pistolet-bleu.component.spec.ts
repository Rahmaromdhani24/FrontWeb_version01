import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePdekPistoletBleuComponent } from './page-pdek-pistolet-bleu.component';

describe('PdekPistoletBleuComponent', () => {
  let component: PagePdekPistoletBleuComponent;
  let fixture: ComponentFixture<PagePdekPistoletBleuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePdekPistoletBleuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePdekPistoletBleuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
