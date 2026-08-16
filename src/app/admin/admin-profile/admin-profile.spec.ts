import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { AdminSettings } from '../admin-settings/admin-settings';
import { AdminProfileService } from '../../services/adminprofile-service';

describe('AdminSettings', () => {

  let component: AdminSettings;
  let fixture: ComponentFixture<AdminSettings>;

  let serviceSpy: jasmine.SpyObj<AdminProfileService>;


  beforeEach(async () => {

    serviceSpy = jasmine.createSpyObj(
      'AdminProfileService',
      [
        'changePassword'
      ]
    );


    await TestBed.configureTestingModule({

      imports: [
        AdminSettings
      ],

      providers: [
        {
          provide: AdminProfileService,
          useValue: serviceSpy
        }
      ]

    }).compileComponents();


    fixture = TestBed.createComponent(AdminSettings);

    component = fixture.componentInstance;

    fixture.detectChanges();

  });


  // ============================================================
  // DEFAULT VALUES
  // ============================================================

  it('should initialize signals with default values', () => {

    expect(component.oldPassword())
      .toBe('');

    expect(component.newPassword())
      .toBe('');

    expect(component.confirmPassword())
      .toBe('');

    expect(component.isLoading())
      .toBeFalse();

    expect(component.successMessage())
      .toBe('');

    expect(component.errorMessage())
      .toBe('');

  });


  // ============================================================
  // EMPTY FIELDS
  // ============================================================

  it('should validate empty fields', () => {

    component.oldPassword.set('');

    component.newPassword.set('');

    component.confirmPassword.set('');


    component.changePassword();


    expect(component.errorMessage())
      .toBe('All fields are required');


    expect(serviceSpy.changePassword)
      .not.toHaveBeenCalled();

  });


  // ============================================================
  // PASSWORD MISMATCH
  // ============================================================

  it('should validate password mismatch', () => {

    component.oldPassword.set('old123');

    component.newPassword.set('new123');

    component.confirmPassword.set('wrong123');


    component.changePassword();


    expect(component.errorMessage())
      .toBe('Passwords do not match');


    expect(serviceSpy.changePassword)
      .not.toHaveBeenCalled();

  });


  // ============================================================
  // SUCCESS
  // ============================================================

  it('should change password successfully', () => {

    serviceSpy.changePassword.and.returnValue(

      of({
        success: true,
        message: 'Password updated successfully',
        data: null
      } as any)

    );


    component.oldPassword.set('old123');

    component.newPassword.set('new123');

    component.confirmPassword.set('new123');


    component.changePassword();


    expect(serviceSpy.changePassword)
      .toHaveBeenCalledWith({
        old_password: 'old123',
        new_password: 'new123'
      });


    expect(component.successMessage())
      .toBe('Password updated successfully');


    expect(component.oldPassword())
      .toBe('');

    expect(component.newPassword())
      .toBe('');

    expect(component.confirmPassword())
      .toBe('');


    expect(component.isLoading())
      .toBeFalse();

  });


  // ============================================================
  // API ERROR
  // ============================================================

  it('should handle API error message', () => {

    serviceSpy.changePassword.and.returnValue(

      throwError(() => ({
        error: {
          message: 'Invalid old password'
        }
      }))

    );


    component.oldPassword.set('wrong');

    component.newPassword.set('new123');

    component.confirmPassword.set('new123');


    component.changePassword();


    expect(component.errorMessage())
      .toBe('Invalid old password');


    expect(component.isLoading())
      .toBeFalse();

  });


  // ============================================================
  // API ERROR - DEFAULT MESSAGE
  // ============================================================

  it('should handle API error without message', () => {

    serviceSpy.changePassword.and.returnValue(

      throwError(() => ({}))

    );


    component.oldPassword.set('old');

    component.newPassword.set('new');

    component.confirmPassword.set('new');


    component.changePassword();


    expect(component.errorMessage())
      .toBe('Unable to change password');


    expect(component.isLoading())
      .toBeFalse();

  });


  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  it('should toggle password visibility', () => {

    expect(component.showOldPassword())
      .toBeFalse();

    expect(component.showNewPassword())
      .toBeFalse();

    expect(component.showConfirmPassword())
      .toBeFalse();


    component.showOldPassword.set(true);

    component.showNewPassword.set(true);

    component.showConfirmPassword.set(true);


    expect(component.showOldPassword())
      .toBeTrue();

    expect(component.showNewPassword())
      .toBeTrue();

    expect(component.showConfirmPassword())
      .toBeTrue();

  });

});