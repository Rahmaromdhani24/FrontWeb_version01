import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTousNotificationsAllProcessComponent } from './page-tous-notifications-all-process.component';

describe('PageTousNotificationsAllProcessComponent', () => {
  let component: PageTousNotificationsAllProcessComponent;
  let fixture: ComponentFixture<PageTousNotificationsAllProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTousNotificationsAllProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageTousNotificationsAllProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
