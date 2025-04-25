import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePdekPistoletVertComponent } from './page-pdek-pistolet-vert.component';

describe('PdekPistoletVertComponent', () => {
  let component: PagePdekPistoletVertComponent;
  let fixture: ComponentFixture<PagePdekPistoletVertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePdekPistoletVertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePdekPistoletVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
