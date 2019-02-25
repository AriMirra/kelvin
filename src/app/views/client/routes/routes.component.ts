import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {RouteService} from '../../../services/route.service';
import {User} from '../../../../shared/users/User';
import {Product} from '../../../../shared/products/Product';
import {forkJoin} from 'rxjs';
import {Route} from '../../../../shared/routes/Route';
import {RouteUpdate} from '../../../../shared/routes/RouteUpdate';
import {ProductService} from '../../../services/product.service';
import {VehicleService} from '../../../services/vehicle.service';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';

@Component({
    selector: 'app-routes',
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {
    client: User;
    routes: Route[] = [];
    productIdMap: Map<string, Product> = new Map<string, Product>();
    products: Product[] = [];
    vehicleIdMap: Map<string, Vehicle> = new Map<string, Vehicle>();
    vehicles: Vehicle[] = [];

    vehiclesLoaded = false;
    productsLoaded = false;

    routeSearch = '';

    editingRoute: RouteUpdate = RouteUpdate.empty();
    editRouteId: string;
    successfulEdit: boolean;
    showEditMsg = false;

    deleteRouteId: string;
    successfulDelete: boolean;
    showDeleteMsg = false;

    fromDate: string;
    fromTime: string;

    toDate: string;
    toTime: string;

    constructor(
        private routeService: RouteService,
        private productService: ProductService,
        private vehicleService: VehicleService,
        private userService: UserService) {
        this.load();
    }

    ngOnInit() {
    }

    load() {
        const futureRoutes = this.routeService.getUserRoutes();
        const futureClient = this.userService.getLoggedUser();

        forkJoin(futureClient, futureRoutes)
            .subscribe(([client, routes]) => {
                this.client = client;
                this.routes = routes;
                this.vehicleService.getUserVehicles(this.client.id).subscribe(vehicles => {
                    this.vehicles = vehicles;
                    this.vehiclesLoaded = true;
                    vehicles.forEach(vehicle => {
                        this.vehicleIdMap.set(vehicle.id, vehicle);
                    });
                });
                this.productService.fetchClientProducts(this.client.id).subscribe(products => {
                    this.products = products;
                    this.productsLoaded = true;
                    products.forEach(product => {
                        this.productIdMap.set(product.id, product);
                    });
                });
            });
    }

    // Edit

    startRouteEdit(route: Route) {
        this.editingRoute = RouteUpdate.for(route, route.fromDate.toISOString(), route.toDate.toISOString());
        this.editingRoute.maxTemperature = this.getRouteValue(route, 'maxTemperature');
        this.editingRoute.minTemperature = this.getRouteValue(route, 'minTemperature');
        this.editingRoute.minHumidity = this.getRouteValue(route, 'minHumidity');
        this.editingRoute.maxHumidity = this.getRouteValue(route, 'maxHumidity');
        this.editingRoute.vampire = this.isRouteVampire(route);
        const fromDate = route.fromDate;
        const fromMonth = fromDate.getMonth() + 1;
        const fromDay = fromDate.getDate();
        const toDate = route.toDate;
        const toMonth = toDate.getMonth() + 1;
        const toDay = toDate.getDate();
        this.fromDate = `${fromDate.getFullYear()}-${this.normalizeNumberString(fromMonth)}-${this.normalizeNumberString(fromDay)}`;
        this.fromTime = `${this.normalizeNumberString(fromDate.getHours())}:${this.normalizeNumberString(fromDate.getMinutes())}`;
        this.toDate = `${toDate.getFullYear()}-${this.normalizeNumberString(toMonth)}-${this.normalizeNumberString(toDay)}`;
        this.toTime = `${this.normalizeNumberString(toDate.getHours())}:${this.normalizeNumberString(toDate.getMinutes())}`;
        this.editRouteId = route.id;
    }

    parseDate(date: string, time: string): string {
        const [hours, minutes] = time ? time.split(':').map(e => {
            const value = parseInt(e, 10);
            return (value === undefined || value === null) ? 0 : value;
        }) : [0, 0];
        const result = new Date(date);
        result.setDate(result.getDate() + 1);
        result.setHours(hours);
        result.setMinutes(minutes);
        return result.toISOString();
    }

    editRoute() {
        const from = this.parseDate(this.fromDate, this.fromTime);
        const to = this.parseDate(this.toDate, this.toTime);
        this.editingRoute.from = from;
        this.editingRoute.to = to;

        this.routeService
            .updateRoute(this.editRouteId, this.editingRoute)
            .subscribe(edited => {
                this.successfulEdit = edited;
                if (this.successfulEdit) {
                    this.load();
                }
                this.showEditMsg = true;
                setTimeout(() => this.showEditMsg = false, 1000);
            });
    }

    cancelEdit() {
        this.editingRoute = RouteUpdate.empty();
        this.editRouteId = undefined;
        this.fromDate = undefined;
        this.fromTime = undefined;
        this.toDate = undefined;
        this.toTime = undefined;
    }

    // Delete

    startRouteDelete(id: string) {
        this.deleteRouteId = id;
    }

    deleteRoute() {
        this.routeService
            .deleteRoute(this.deleteRouteId)
            .subscribe(deleted => {
                this.successfulDelete = deleted;
                if (this.successfulDelete) {
                    this.load();
                }
                this.showDeleteMsg = true;
                setTimeout(() => this.showDeleteMsg = false, 1000);
            });
    }

    cancelDelete() {
        this.deleteRouteId = undefined;
    }

    // Search

    filteredRoutes(): Route[] {
        if (!this.vehiclesLoaded || !this.productsLoaded) {
            return [];
        }
        if (this.routeSearch === '') {
            return this.routes;
        }
        return this.routes.filter(v => this.routeSearchFilter(v));
    }

    routeSearchFilter(route: Route): boolean {
        return !![route.name]
            .map(e => e.toLowerCase())
            .find(e => e.includes(this.routeSearch.toLowerCase()));
    }

    getProductById(productId: string): Product {
        return this.productIdMap.get(productId);
    }

    getVehicleById(vehicleId: string): Vehicle {
        return this.vehicleIdMap.get(vehicleId);
    }

    getRouteValue(route: Route, value: string): number {
        if (route[value]) {
            return route[value].toString();
        } else if (route.productId) {
            const product = this.getProductById(route.productId);
            if (product[value]) {
                return product[value].toString();
            }
        }
        return null;
    }

    getRouteValueString(route: Route, value: string): string {
        const result = this.getRouteValue(route, value);
        if (result) {
            return result.toString();
        } else {
            return 'N/A';
        }
    }

    isRouteVampire(route: Route): boolean {
        if (route.vampire === null && route.productId) {
            return this.getProductById(route.productId).vampire;
        } else {
            return route.vampire;
        }
    }

    getRouteFromDateString(route: Route): string {
        const from = route.fromDate;
        return this.dateToString(from);
    }

    getRouteToDateString(route: Route): string {
        const to = route.toDate;
        return this.dateToString(to);
    }

    private dateToString(date: Date): string {
        return date.toLocaleDateString() + ' a las ' + date.toLocaleTimeString().split(':').slice(0, 2).join(':');
    }

    private normalizeNumberString(num: number): string {
        return num < 9 ? `0${num}` : num.toString();
    }
}
