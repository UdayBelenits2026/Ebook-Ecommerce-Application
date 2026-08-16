import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { MyAccount } from './my-account';
import { MyaccountService } from '../../services/myaccount-service';
import { ChangeDetectorRef } from '@angular/core';

describe('MyAccount', () => {
  let component: MyAccount;
  let fixture: ComponentFixture<MyAccount>;

  let serviceSpy: jasmine.SpyObj<MyaccountService>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('MyaccountService', [
      'getProfile',
      'updateProfile',
      'uploadAvatar',
    ]);

    serviceSpy.getProfile.and.returnValue(
      of({
        data: null,
      } as any),
    );

    serviceSpy.updateProfile.and.returnValue(
      of({
        message: 'Updated',
      } as any),
    );

    serviceSpy.uploadAvatar.and.returnValue(
      of({
        message: 'Uploaded',
      } as any),
    );

    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [MyAccount],

      providers: [
        {
          provide: MyaccountService,
          useValue: serviceSpy,
        },

        {
          provide: ChangeDetectorRef,
          useValue: cdrSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAccount);

    component = fixture.componentInstance;
  });

  // ============================================================
  // COMPONENT CREATION
  // ============================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // DEFAULT VALUES
  // ============================================================

  it('should initialize with default values', () => {
    expect(component.profile).toBeNull();

    expect(component.profileImageUrl).toBe('assets/images/user.png');

    expect(component.loading).toBeFalse();

    expect(component.saving).toBeFalse();

    expect(component.uploading).toBeFalse();
  });

  // ============================================================
  // NG ON INIT
  // ============================================================

  it('ngOnInit should call loadProfile', () => {
    spyOn(component, 'loadProfile');

    component.ngOnInit();

    expect(component.loadProfile).toHaveBeenCalled();
  });

  // ============================================================
  // LOAD PROFILE - SUCCESS
  // ============================================================

  it('loadProfile should load profile data successfully', () => {
    const profile = {
      full_name: 'John',

      phone: '9999999999',

      profile_image: '/media/profile.png',
    } as any;

    serviceSpy.getProfile.and.returnValue(
      of({
        data: profile,
      } as any),
    );

    component.loadProfile();

    expect(component.profile).toEqual(profile);

    expect(component.profileData.full_name).toBe('John');

    expect(component.profileData.phone).toBe('9999999999');

    expect(component.profileImageUrl).toContain('/media/profile.png');

    expect(component.loading).toBeFalse();
  });

  // ============================================================
  // LOAD PROFILE - ERROR
  // ============================================================

  it('loadProfile should handle error', () => {
    serviceSpy.getProfile.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Profile error',
        },
      })),
    );

    component.loadProfile();

    expect(component.loading).toBeFalse();

    expect(component.errorMessage).toBe('Profile error');
  });

  // ============================================================
  // SAVE PROFILE - SUCCESS
  // ============================================================

  it('saveProfile should update profile successfully', () => {
    spyOn(component, 'loadProfile');

    component.profileData = {
      full_name: 'New Name',

      phone: '12345',
    };

    component.saveProfile();

    expect(serviceSpy.updateProfile).toHaveBeenCalled();

    expect(component.successMessage).toBe('Updated');

    expect(component.saving).toBeFalse();

    expect(component.loadProfile).toHaveBeenCalled();
  });

  // ============================================================
  // SAVE PROFILE - ERROR
  // ============================================================

  it('saveProfile should handle error', () => {
    serviceSpy.updateProfile.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Update failed',
        },
      })),
    );

    component.saveProfile();

    expect(component.saving).toBeFalse();

    expect(component.errorMessage).toBe('Update failed');
  });

  // ============================================================
  // FILE SELECTED
  // ============================================================

  it('onFileSelected should set selected file', () => {
    const file = new File(
      ['test'],

      'profile.png',

      {
        type: 'image/png',
      },
    );

    const event = {
      target: {
        files: [file],
      },
    } as any;

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
  });

  // ============================================================
  // NO FILE SELECTED
  // ============================================================

  it('onFileSelected should return when no file is selected', () => {
    component.selectedFile = null;

    component.onFileSelected({
      target: {
        files: [],
      },
    } as any);

    expect(component.selectedFile).toBeNull();
  });

  // ============================================================
  // UPLOAD - NO FILE
  // ============================================================

  it('uploadAvatar should return when no file exists', () => {
    component.selectedFile = null;

    component.uploadAvatar();

    expect(serviceSpy.uploadAvatar).not.toHaveBeenCalled();
  });

  // ============================================================
  // UPLOAD - SUCCESS
  // ============================================================

  it('uploadAvatar should upload image successfully', () => {
    const file = new File(
      ['image'],

      'profile.png',

      {
        type: 'image/png',
      },
    );

    component.selectedFile = file;

    spyOn(component, 'loadProfile');

    component.uploadAvatar();

    expect(serviceSpy.uploadAvatar).toHaveBeenCalledWith(file);

    expect(component.uploading).toBeFalse();

    expect(component.selectedFile).toBeNull();

    expect(component.successMessage).toBe('Uploaded');

    expect(component.loadProfile).toHaveBeenCalled();
  });

  // ============================================================
  // UPLOAD - ERROR
  // ============================================================

  it('uploadAvatar should handle upload error', () => {
    component.selectedFile = new File(
      ['image'],

      'profile.png',

      {
        type: 'image/png',
      },
    );

    serviceSpy.uploadAvatar.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Upload failed',
        },
      })),
    );

    component.uploadAvatar();

    expect(component.uploading).toBeFalse();

    expect(component.errorMessage).toBe('Upload failed');
  });
});
