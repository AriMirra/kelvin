import { Component, OnInit } from '@angular/core';
import {User} from '../../../../shared/users/User';
import {Device} from '../../../../shared/devices/Device';
import {UserService} from '../../../services/user.service';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';
import {VehicleUpdate} from '../../../../shared/vehicles/VehicleUpdate';
import {DeviceService} from '../../../services/device.service';
import {ProductCredentials} from '../../../../shared/products/ProductCredentials';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../../shared/products/Product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent  implements OnInit {

    addingProduct: boolean;

    // clients: User[] = [];
    // vehicles: Vehicle[] = [];
    // devices: Device[] = [];
    // clientIdMap: Map<string, User> = new Map<string, User>();
    // deviceIdMap: Map<string, Device> = new Map<string, Device>();

    productSearch = '';

    newProduct = ProductCredentials.empty();
    successfulAdd: boolean;
    showSubmitMsg = false;

    // editingProduct: ProductUpdate = ProductUpdate.empty();
    // editProductId: string;
    successfulEdit: boolean;
    showEditMsg = false;

    deleteProductId: string;
    successfulDelete: boolean;
    showDeleteMsg = false;

    constructor(private productService: ProductService) {
        /*const futureVehicles = this.vehicleService.fetchVehicles();
        const futureClients = this.clientService.fetchUsers();
        const futureDevices = this.deviceService.fetchDevices();

        forkJoin(futureClients, futureVehicles, futureDevices)
            .subscribe(([clients, vehicles, devices]) => {
                this.clients = clients;
                this.vehicles = vehicles;
                this.devices = devices;

                this.vehicles.map(v => {
                    const client = this.clients.find(c => c.id === v.ownerId);
                    const device = this.devices.find(d => d.id === v.deviceId);
                    return [v.id, client, device] as ([string, User, Device]);
                }).forEach(([id, client, device]) => {
                    this.clientIdMap.set(id, client);
                    this.deviceIdMap.set(id, device);
                });

            });*/

        this.addingProduct = false;
    }

    ngOnInit() {
    }

    // Add
    toggleAddingProduct() {
        this.addingProduct = !this.addingProduct;
    }

    submitProduct() {
        console.log(this.newProduct);
        this.productService
            .addProduct(this.newProduct)
            .subscribe(submitted => {
                this.successfulAdd = submitted;
                this.showSubmitMsg = true;
                setTimeout(() => this.showSubmitMsg = false, 1000);
            });
    }

    // Edit

    // startProductEdit(product: Product) {
    //     this.editingProduct = ProductUpdate.for(product);
    //     this.editProductId = product.id;
    // }

    // editProduct() {
    //     this.productService
    //         .updateProduct(this.editProductId, this.editingProduct)
    //         .subscribe(edited => {
    //             this.successfulEdit = edited;
    //             this.showEditMsg = true;
    //             setTimeout(() => this.showEditMsg = false, 1000);
    //         });
    // }

    // cancelEdit() {
    //     this.editingProduct = ProductUpdate.empty();
    //     this.editProductId = undefined;
    // }

    // Delete

    startProductDelete(id: string) {
        this.deleteProductId = id;
    }

    // deleteProduct() {
    //     this.productService
    //         .deleteProduct(this.deleteProductId)
    //         .subscribe(deleted => {
    //             this.successfulDelete = deleted;
    //             this.showDeleteMsg = true;
    //             setTimeout(() => this.showDeleteMsg = false, 1000);
    //         });
    // }

    cancelDelete() {
        this.deleteProductId = undefined;
    }

    // Search

    // filteredProducts(): Product[] {
    //     if (this.productSearch === '') {
    //         return this.product;
    //     }
    //     return this.product.filter(v => this.productSearchFilter(v));
    // }
    //
    // productSearchFilter(product: Product): boolean {
    //     return !![product.name]
    //         .map(e => e.toLowerCase())
    //         .find(e => e.includes(this.productSearch));
    // }
}
