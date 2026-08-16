import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { Notifications } from './notifications';
import { NotificationService } from '../../services/notification-service';

describe('Notifications', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;

  let notifSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    notifSpy = jasmine.createSpyObj('NotificationService', [
      'getUserNotifications',
      'markUserNotificationRead',
      'deleteUserNotification',
    ]);

    /*
     * IMPORTANT:
     * ngOnInit() calls loadNotifications().
     * loadNotifications() calls getUserNotifications().subscribe().
     *
     * Therefore the spy must return an Observable
     * before fixture.detectChanges().
     */
    notifSpy.getUserNotifications.and.returnValue(
      of({
        data: [],
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [Notifications],

      providers: [
        {
          provide: NotificationService,
          useValue: notifSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Notifications);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // COMPONENT CREATION
  // ============================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
