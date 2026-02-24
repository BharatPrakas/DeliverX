import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { TaskDetail } from './features/task-detail/task-detail';
import { Purchase } from './features/purchase/purchase';
import { DeliveryList } from './features/delivery-list/delivery-list';
import { DeliveryReceipt } from './features/delivery-receipt/delivery-receipt';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'task-detail/:tripId',
        component: TaskDetail
    },
    {
        path: 'purchase/:tripId',
        component: Purchase
    },
    {
        path: 'delivery-list/:tripId',
        component: DeliveryList
    },
    {
        path: 'delivery-receipt/:tripId',
        component: DeliveryReceipt
    },
    {
        path: 'expenses/:tripId',
        loadComponent: () => import('./features/expenses/expenses').then(m => m.Expenses)
    },
    {
        path: 'trip-summary/:tripId',
        loadComponent: () => import('./features/trip-summary/trip-summary').then(m => m.TripSummaryComponent)
    },
    {
        path: 'purchase-receipt/:tripId',
        loadComponent: () => import('./features/purchase-receipt/purchase-receipt').then(m => m.PurchaseReceipt)
    }
];
