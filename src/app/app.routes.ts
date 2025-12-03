import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/instructions',
        pathMatch: 'full'
    },
    {
        path: 'instructions',
        loadComponent: () => import('./instructions/instructions').then(m => m.Instructions)
    },
    {
        path: 'simple-counter',
        loadComponent: () => import('./simple-counter/simple-counter').then(m => m.SimpleCounter)
    }
];
