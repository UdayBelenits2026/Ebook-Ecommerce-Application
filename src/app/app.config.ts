import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { booksReducer } from './store/books/books.reducers';
import { BooksEffects } from './store/books/books.effects';
import { authReducer } from './store/auth/auth.reducers';
import { AuthEffects } from './store/auth/auth.effects';
import { cartReducer } from './store/cart/cart.reducers';
import { CartEffects } from './store/cart/cart.effects';
import { wishlistReducer } from './store/wishlist/wishlist.reducers';
import { WishlistEffects } from './store/wishlist/wishlist.effects';
import { categoriesReducer } from './store/categories/categories.reducers';
import { CategoriesEffects } from './store/categories/categories.effects';
import { customerReducer } from './store/customer/customer.reducers';
import { CustomerEffects } from './store/customer/customer.effects';
import { adminReducer } from './store/admin/admin.reducers';
import { AdminEffects } from './store/admin/admin.effects';
import { routes } from './app.routes';

import { authInterceptor } from './interceptors/auth-interceptor-interceptor';

export const appConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      books: booksReducer,
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      categories: categoriesReducer,
     
      customer: customerReducer,
      admin: adminReducer,
    }),
    provideEffects(
      BooksEffects,
      AuthEffects,
      CartEffects,
      WishlistEffects,
      CategoriesEffects,
      CustomerEffects,
      AdminEffects,
    ),
  ],
};
