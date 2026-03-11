import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { TaskDetail } from './features/task-detail/task-detail';
import { Purchase } from './features/purchase/purchase';
import { DeliveryList } from './features/delivery-list/delivery-list';
import { DeliveryReceipt } from './features/delivery-receipt/delivery-receipt';
import { Login } from './features/login/login';
import { authGuard } from './common/services/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'task-detail/:tripId',
        component: TaskDetail,
        canActivate: [authGuard]
    },
    {
        path: 'purchase/:tripId',
        component: Purchase,
        canActivate: [authGuard]
    },
    {
        path: 'delivery-list/:tripId',
        component: DeliveryList,
        canActivate: [authGuard]
    },
    {
        path: 'delivery-receipt/:tripId',
        component: DeliveryReceipt,
        canActivate: [authGuard]
    },
    {
        path: 'expenses/:tripId',
        loadComponent: () => import('./features/expenses/expenses').then(m => m.Expenses),
        canActivate: [authGuard]
    },
    {
        path: 'trip-summary/:tripId',
        loadComponent: () => import('./features/trip-summary/trip-summary').then(m => m.TripSummaryComponent),
        canActivate: [authGuard]
    },
    {
        path: 'purchase-receipt/:tripId',
        loadComponent: () => import('./features/purchase-receipt/purchase-receipt').then(m => m.PurchaseReceipt),
        canActivate: [authGuard]
    }
];
