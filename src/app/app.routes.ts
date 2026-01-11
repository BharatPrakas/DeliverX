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
        path: 'task-detail/:id',
        component: TaskDetail
    },
    {
        path: 'purchase',
        component: Purchase
    },
    {
        path: 'delivery-list',
        component: DeliveryList
    },
    {
        path: 'delivery-receipt',
        component: DeliveryReceipt
    },
    {
        path: 'expenses',
        loadComponent: () => import('./features/expenses/expenses').then(m => m.Expenses)
    },
    {
        path: 'trip-summary',
        loadComponent: () => import('./features/trip-summary/trip-summary').then(m => m.TripSummary)
    }
];
