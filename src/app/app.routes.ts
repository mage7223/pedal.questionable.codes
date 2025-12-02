import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main-menu/main-menu').then(m => m.MainMenu)
    },
    {
        path: 'simple-counter',
        loadComponent: () => import('./simple-counter/simple-counter').then(m => m.SimpleCounter)
    }
];
