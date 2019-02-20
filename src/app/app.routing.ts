import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Import Containers
import {DefaultLayoutComponent} from './containers';
import {P404Component} from './views/error/404.component';
import {P500Component} from './views/error/500.component';
import {LoginComponent} from './views/login/login.component';
import {AdminMapComponent} from './views/admin/map/map.component';
import {ClientMapComponent} from './views/client/map/map.component';
import {RoutesComponent} from './views/admin/routes/routes.component';
import {AdminVehiclesComponent} from './views/admin/vehicles/vehicles.component';
import {ClientVehiclesComponent} from './views/client/vehicles/vehicles.component';
import {DevicesComponent} from './views/admin/devices/devices.component';
import {UsersComponent} from './views/admin/users/users.component';
import {ProductsComponent} from './views/client/products/products.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: DefaultLayoutComponent,
        data: {
            title: 'Home'
        },
        children: [
            {
                path: '',
                component: AdminMapComponent
            },
            {
                path: 'routes',
                component: RoutesComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'vehicles',
                component: AdminVehiclesComponent
            },
            {
                path: 'devices',
                component: DevicesComponent
            }
        ]
    },
    {
        path: 'client',
        component: DefaultLayoutComponent,
        data: {
            title: 'Home'
        },
        children: [
            {
                path: '',
                component: ClientMapComponent
            },
            {
                path: 'vehicles',
                component: ClientVehiclesComponent
            },
            {
                path: 'products',
                component: ProductsComponent
            }
        ]
    },
    {
        path: '500',
        component: P500Component,
        data: {
            title: 'Page 500'
        }
    },
    {
        path: '**',
        component: P404Component,
        data: {
            title: 'Page 404'
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
