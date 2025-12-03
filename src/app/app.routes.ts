import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'simple-counter',
        loadComponent: () => import('./simple-counter/simple-counter').then(m => m.SimpleCounter)
    }
];
