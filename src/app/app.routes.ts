import { Routes } from '@angular/router';
import { publicGuard } from './guards/public-guard-guard';
import { customerGuard } from './guards/customer-guard-guard';
import { adminGuard } from './guards/admin-guard-guard';
import {NotFound} from './components/pages/notfound/notfound';

export const routes: Routes = [
  // PUBLIC ROUTES
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/homepage/homepage').then((m) => m.Homepage),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/aboutuspage/aboutuspage').then((m) => m.Aboutuspage),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categoriespage/categoriespage').then((m) => m.Categoriespage),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contactpage/contactpage').then((m) => m.Contactpage),
      },
      {
        path: 'books',
        loadComponent: () => import('./features/bookspage/bookspage').then((m) => m.Bookspage),
      },
      {
        path: 'book-details/:id',
        loadComponent: () =>
          import('./features/book-details/book-details').then((m) => m.BookDetailsComponent),
      },
      {
        path: 'favourite',
        loadComponent: () =>
          import('./customer/wishlist/wishlist').then((m) => m.WishlistComponent),
      },
      {
        path: 'watchlist',
        loadComponent: () => import('./customer/cart/cart').then((m) => m.Cart),
      },
      {
            path:'privacy-policy',
            loadComponent:()=>
              import('./components/pages/privacy-policy-component/privacy-policy').then((m)=>m.PrivacyPolicy)
          },
          {
            path:'terms',
            loadComponent:()=>
              import('./components/pages/terms-component/terms-component').then((m)=>m.Terms)
          },
      {
        path: 'customer',
        canActivate: [customerGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/homepage/homepage').then((m) => m.Homepage),
          },
          {
            path: 'my-account',
            loadComponent: () =>
              import('./customer/my-account/my-account').then((m) => m.MyAccount),
          },
          {
            path: 'my-orders',
            loadComponent: () => import('./customer/my-orders/my-orders').then((m) => m.MyOrders),
          },
          {
            path: 'settings',
            loadComponent: () => import('./customer/settings/settings').then((m) => m.Settings),
          },
          {
            path: 'checkout',
            loadComponent: () => import('./customer/checkout/checkout').then((m) => m.Checkout),
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import('./customer/notifications/notifications').then((m) => m.Notifications),
          },
          {
            path: 'review',
            loadComponent: () =>
              import('./customer/reviews/reviews').then((m) => m.ReviewsComponent),
          },
          
        ],
      },
      {
        path: 'login',
        loadComponent: () => import('./auth/loginpage/loginpage').then((m) => m.Loginpage),
        canActivate: [publicGuard],
      },
      {
        path: 'signup',
        loadComponent: () => import('./auth/signuppage/signuppage').then((m) => m.Signuppage),
        canActivate: [publicGuard],
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./auth/forgotpassword/forgotpassword').then((m) => m.Forgotpassword),
        canActivate: [publicGuard],
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./auth/resetpassword/resetpassword').then((m) => m.Resetpassword),
        canActivate: [publicGuard],
      },
    ],
  },
  // ADMIN ROUTES
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'books',
        loadComponent: () => import('./admin/books/books').then((m) => m.AdminBooksComponent),
      },
      {
        path: 'categories',
        loadComponent: () => import('./admin/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'enquiry',
        loadComponent: () =>
          import('./admin/admin-contact/admin-contact').then((m) => m.AdminContact),
      },
      {
        path: 'orders',
        loadComponent: () => import('./admin/admin-orders/admin-orders').then((m) => m.AdminOrders),
      },
      {
        path: 'user',
        loadComponent: () => import('./admin/users/users').then((m) => m.Users),
      },
      {
        path: 'admin-reviews',
        loadComponent: () =>
          import('./admin/admin-reviews/admin-reviews').then((m) => m.AdminReviews),
      },
      {
        path: 'admin-settings',
        loadComponent: () =>
          import('./admin/admin-settings/admin-settings').then((m) => m.AdminSettings),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./admin/admin-notifications/admin-notifications').then(
            (m) => m.AdminNotifications,
          ),
      },
      {
        path: 'admin-profile',
        loadComponent: () =>
          import('./admin/admin-profile/admin-profile').then((m) => m.AdminProfileComponent),
      },
    ],
  },
  // WILDCARD
  
  {
    path: '**',
    // redirectTo: '',
    component:NotFound,
  },
];
