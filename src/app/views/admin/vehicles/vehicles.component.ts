import {Component, OnInit} from '@angular/core';
import {VehicleUpdate} from '../../../../shared/vehicles/VehicleUpdate';
import {VehicleService} from '../../../services/vehicle.service';
import {VehicleCredentials} from '../../../../shared/vehicles/VehicleCredentials';
import {UserService} from '../../../services/user.service';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';
import {User} from '../../../../shared/users/User';
import {forkJoin} from 'rxjs';
import {DeviceService} from '../../../services/device.service';
import {Device} from '../../../../shared/devices/Device';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  addingVehicle: boolean;
  vehicleWithoutDevice: boolean;
  vehicleWithoutClient: boolean;

  clients: User[] = [];
  vehicles: Vehicle[] = [];
  devices: Device[] = [];
  clientIdMap: Map<string, User> = new Map<string, User>();
  deviceIdMap: Map<string, Device> = new Map<string, Device>();

  vehicleSearch = '';

  newVehicle = VehicleCredentials.empty();
  successfulAdd: boolean;
  showSubmitMsg = false;

  editingVehicle: VehicleUpdate = VehicleUpdate.empty();
  editVehicleId: string;
  successfulEdit: boolean;
  showEditMsg = false;

  deleteVehicleId: string;
  successfulDelete: boolean;
  showDeleteMsg = false;

  vehicleToAssign: Vehicle;
  deviceAssignId: string;
  successfulAssign: boolean;
  showAssignMsg = false;

  constructor(private vehicleService: VehicleService, private clientService: UserService, private deviceService: DeviceService) {
    const futureVehicles = this.vehicleService.fetchVehicles();
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

    });

    this.addingVehicle = false;
    this.vehicleWithoutDevice = true; // TODO boolean depends on the list of vehicles.
    this.vehicleWithoutClient = true; // TODO boolean depends on the list of vehicles.
  }

  ngOnInit() {
  }

  getVehicleOwner(vehicle: Vehicle): User {
    return this.clientIdMap.get(vehicle.id);
  }

  getVehicleOwnerName(vehicle: Vehicle): string {
    const owner = this.clientIdMap.get(vehicle.id);
    if (owner && owner.name !== null) { return owner.name; }
    return '';
  }

  getVehicleDevice(vehicle: Vehicle): Device {
    return this.deviceIdMap.get(vehicle.id);
  }

  getVehicleDeviceAlias(vehicle: Vehicle): string {
    const device = this.deviceIdMap.get(vehicle.id);
    if (device && device.alias !== null) { return device.alias; }
    return '';
  }

  // Add
  toggleAddingVehicle() {
    this.addingVehicle = !this.addingVehicle;
  }

  submitVehicle() {
    console.log(this.newVehicle);
    this.vehicleService
      .addVehicle(this.newVehicle)
      .subscribe(submitted => {
        this.successfulAdd = submitted;
        this.showSubmitMsg = true;
        setTimeout(() => this.showSubmitMsg = false, 1000);
      });
  }

  // Edit

  startVehicleEdit(vehicle: Vehicle) {
    this.editingVehicle = VehicleUpdate.for(vehicle);
    this.editVehicleId = vehicle.id;
  }

  editVehicle() {
    this.vehicleService
      .updateVehicle(this.editVehicleId, this.editingVehicle)
      .subscribe(edited => {
        this.successfulEdit = edited;
        this.showEditMsg = true;
          setTimeout(() => this.showEditMsg = false, 1000);
      });
  }

  cancelEdit() {
    this.editingVehicle = VehicleUpdate.empty();
    this.editVehicleId = undefined;
  }

  // Delete

  startVehicleDelete(id: string) {
    this.deleteVehicleId = id;
  }

  deleteVehicle() {
    this.vehicleService
      .deleteVehicle(this.deleteVehicleId)
      .subscribe(deleted => {
        this.successfulDelete = deleted;
        this.showDeleteMsg = true;
        setTimeout(() => this.showDeleteMsg = false, 1000);
      });
  }

  cancelDelete() {
    this.deleteVehicleId = undefined;
  }

  // Assign

  startDeviceAssign(vehicle: Vehicle) {
    this.vehicleToAssign = vehicle;
    this.deviceAssignId = vehicle.deviceId;
    console.log(this.deviceAssignId);
  }

  assignDevice() {
    this.vehicleService
      .addDevice(this.vehicleToAssign.id, this.deviceAssignId)
      .subscribe(assigned => {
        this.successfulAssign = assigned;
        this.showAssignMsg = true;
        setTimeout(() => this.showAssignMsg = false, 1000);
      });
  }

  cancelAssign() {
    this.vehicleToAssign = undefined;
    this.deviceAssignId = undefined;
  }

  // Search

  filteredVehicles(): Vehicle[] {
    if (this.vehicleSearch === '') {
      return this.vehicles;
    }
    return this.vehicles.filter(v => this.vehicleSearchFilter(v));
  }

  vehicleSearchFilter(vehicle: Vehicle): boolean {
    return !![vehicle.model, vehicle.brand, vehicle.domain, vehicle.ownerId]
        .map(e => e.toLowerCase())
        .find(e => e.includes(this.vehicleSearch));
  }
}
