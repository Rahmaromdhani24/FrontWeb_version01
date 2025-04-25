import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagePdekPistoletJauneComponent } from './page-pdek-pistolet-jaune.component';



describe('PagePdekPistoletJauneComponent', () => {
  let component: PagePdekPistoletJauneComponent;
  let fixture: ComponentFixture<PagePdekPistoletJauneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePdekPistoletJauneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePdekPistoletJauneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
