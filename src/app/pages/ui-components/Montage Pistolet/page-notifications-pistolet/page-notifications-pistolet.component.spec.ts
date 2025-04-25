import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotificationsPistoletComponent } from './page-notifications-pistolet.component';

describe('PageNotificationsPistoletComponent', () => {
  let component: PageNotificationsPistoletComponent;
  let fixture: ComponentFixture<PageNotificationsPistoletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotificationsPistoletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNotificationsPistoletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
