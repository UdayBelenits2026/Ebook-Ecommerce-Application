import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { Users } from './users';
import { AdminUsersService } from '../../services/admin-users-service';

describe('Users', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;

  let svc: jasmine.SpyObj<AdminUsersService>;

  beforeEach(async () => {
    svc = jasmine.createSpyObj('AdminUsersService', ['getUsers', 'updateStatus', 'deleteUser']);

    /*
     * Default response because ngOnInit()
     * may call loadUsers().
     */
    svc.getUsers.and.returnValue(
      of({
        data: [],
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [Users],

      providers: [
        {
          provide: AdminUsersService,
          useValue: svc,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Users);

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
