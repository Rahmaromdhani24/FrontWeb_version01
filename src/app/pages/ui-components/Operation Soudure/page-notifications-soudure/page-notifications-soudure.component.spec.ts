import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotificationsSoudureComponent } from './page-notifications-soudure.component';

describe('PageNotificationsSoudureComponent', () => {
  let component: PageNotificationsSoudureComponent;
  let fixture: ComponentFixture<PageNotificationsSoudureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotificationsSoudureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNotificationsSoudureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
