import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  of
} from 'rxjs';

import {
  Store
} from '@ngrx/store';

import {
  Loginpage
} from './loginpage';

import {
  FormGroup
} from '@angular/forms';


describe('Loginpage', () => {

  let component: Loginpage;

  let fixture: ComponentFixture<Loginpage>;

  let storeSpy: jasmine.SpyObj<Store>;


  // ============================================================
  // BEFORE EACH
  // ============================================================

  beforeEach(async () => {

    // ----------------------------------------------------------
    // MOCK STORE
    // ----------------------------------------------------------

    storeSpy = jasmine.createSpyObj<Store>(
      'Store',
      [
        'select',
        'dispatch'
      ]
    );


    // ----------------------------------------------------------
    // STORE SELECT MOCK
    //
    // selectAuthLoading -> false
    // selectAuthError   -> null
    // ----------------------------------------------------------

    storeSpy.select.and.callFake(
      (selector: any) => {

        // We don't need to identify the selector here.
        // Returning different values based on selector
        // can be done if needed.

        return of(false);

      }
    );


    // ----------------------------------------------------------
    // TEST BED
    // ----------------------------------------------------------

    await TestBed.configureTestingModule({

      imports: [
        Loginpage
      ],

      providers: [

        // ------------------------------------------------------
        // IMPORTANT
        // ------------------------------------------------------

        {
          provide: Store,

          useValue: storeSpy
        },


        // ------------------------------------------------------
        // Router
        // ------------------------------------------------------

        {
          provide: Router,

          useValue: jasmine.createSpyObj(
            'Router',
            [
              'navigate'
            ]
          )
        },


        // ------------------------------------------------------
        // ActivatedRoute
        //
        // Required because Loginpage uses RouterLink.
        // ------------------------------------------------------

        {
          provide: ActivatedRoute,

          useValue: {

            snapshot: {

              paramMap: {

                get: () => null

              }

            },

            paramMap: of({

              get: () => null

            })

          }

        }

      ]

    }).compileComponents();


    // ----------------------------------------------------------
    // CREATE COMPONENT
    // ----------------------------------------------------------

    fixture =
      TestBed.createComponent(
        Loginpage
      );


    component =
      fixture.componentInstance;


    fixture.detectChanges();


    await fixture.whenStable();

  });


  // ============================================================
  // CREATE COMPONENT
  // ============================================================

  it(
    'should create',
    () => {

      expect(component).toBeTruthy();

    }
  );


  // ============================================================
  // FORM INITIALIZATION
  // ============================================================

  it(
    'initializes form with Email and Password controls',
    () => {

      expect(
        component.LoginForm
      ).toBeTruthy();


      expect(
        component.LoginForm.get('Email')
      ).toBeTruthy();


      expect(
        component.LoginForm.get('Password')
      ).toBeTruthy();

    }
  );


  // ============================================================
  // FORM INITIAL VALUES
  // ============================================================

  it(
    'initializes Email and Password with empty values',
    () => {

      expect(
        component.LoginForm.get('Email')?.value
      ).toBe('');


      expect(
        component.LoginForm.get('Password')?.value
      ).toBe('');

    }
  );


  // ============================================================
  // EMAIL REQUIRED
  // ============================================================

  it(
    'email is required',
    () => {

      const email =
        component.LoginForm.get('Email');


      email?.setValue('');


      expect(
        email?.hasError('required')
      ).toBeTrue();

    }
  );


  // ============================================================
  // EMAIL VALIDATION
  // ============================================================

  it(
    'email should be valid when correct email is entered',
    () => {

      const email =
        component.LoginForm.get('Email');


      email?.setValue(
        'test@gmail.com'
      );


      expect(
        email?.valid
      ).toBeTrue();

    }
  );


  // ============================================================
  // INVALID EMAIL
  // ============================================================

  it(
    'email should be invalid when incorrect email is entered',
    () => {

      const email =
        component.LoginForm.get('Email');


      email?.setValue(
        'invalid-email'
      );


      expect(
        email?.hasError('email')
      ).toBeTrue();

    }
  );


  // ============================================================
  // PASSWORD REQUIRED
  // ============================================================

  it(
    'password is required',
    () => {

      const password =
        component.LoginForm.get('Password');


      password?.setValue('');


      expect(
        password?.hasError('required')
      ).toBeTrue();

    }
  );


  // ============================================================
  // INVALID FORM
  // ============================================================

  it(
    'marks form as touched and does not dispatch login when form is invalid',
    () => {

      spyOn(
        component.LoginForm,
        'markAllAsTouched'
      );


      component.login();


      expect(
        component.LoginForm.markAllAsTouched
      ).toHaveBeenCalled();


      expect(
        storeSpy.dispatch
      ).not.toHaveBeenCalled();

    }
  );


  // ============================================================
  // VALID FORM
  // ============================================================

  it(
    'dispatches login action when form is valid',
    () => {

      component.LoginForm.setValue({

        Email: 'user@gmail.com',

        Password: 'password123'

      });


      component.login();


      expect(
        storeSpy.dispatch
      ).toHaveBeenCalled();

    }
  );


  // ============================================================
  // DISPATCHED LOGIN ACTION
  // ============================================================

  it(
    'dispatches login action with correct credentials',
    () => {

      component.LoginForm.setValue({

        Email: 'user@gmail.com',

        Password: 'password123'

      });


      component.login();


      const dispatchedAction =
        storeSpy.dispatch.calls
          .mostRecent()
          .args[0] as any;


      expect(
        dispatchedAction.type
      ).toBe(
        '[Auth] Login'
      );


      expect(
        dispatchedAction.credentials
      ).toEqual({

        email: 'user@gmail.com',

        password: 'password123'

      });

    }
  );


  // ============================================================
  // SERVER ERROR RESET
  // ============================================================

  it(
    'clears previous server error when login starts',
    () => {

      component.serverError =
        'Previous error';


      component.LoginForm.setValue({

        Email: 'user@gmail.com',

        Password: 'password123'

      });


      component.login();


      expect(
        component.serverError
      ).toBe('');

    }
  );


  // ============================================================
  // LOADING STATE
  // ============================================================

  it(
    'initializes loading state as false',
    () => {

      expect(
        component.isLoading
      ).toBeFalse();

    }
  );


  // ============================================================
  // SERVER ERROR STATE
  // ============================================================

  it(
    'initializes server error as empty',
    () => {

      expect(
        component.serverError
      ).toBe('');

    }
  );


  // ============================================================
  // FORM INVALID - EMPTY EMAIL
  // ============================================================

  it(
    'does not dispatch when email is empty',
    () => {

      component.LoginForm.setValue({

        Email: '',

        Password: 'password123'

      });


      component.login();


      expect(
        storeSpy.dispatch
      ).not.toHaveBeenCalled();

    }
  );


  // ============================================================
  // FORM INVALID - EMPTY PASSWORD
  // ============================================================

  it(
    'does not dispatch when password is empty',
    () => {

      component.LoginForm.setValue({

        Email: 'user@gmail.com',

        Password: ''

      });


      component.login();


      expect(
        storeSpy.dispatch
      ).not.toHaveBeenCalled();

    }
  );


  // ============================================================
  // FORM INVALID - BOTH EMPTY
  // ============================================================

  it(
    'does not dispatch when both fields are empty',
    () => {

      component.LoginForm.setValue({

        Email: '',

        Password: ''

      });


      component.login();


      expect(
        storeSpy.dispatch
      ).not.toHaveBeenCalled();

    }
  );


  // ============================================================
  // DESTROY
  // ============================================================

  it(
    'should unsubscribe on destroy',
    () => {

      spyOn(
        component as any,
        'ngOnDestroy'
      ).and.callThrough();


      component.ngOnDestroy();


      expect(
        (component as any).ngOnDestroy
      ).toHaveBeenCalled();

    }
  );

});