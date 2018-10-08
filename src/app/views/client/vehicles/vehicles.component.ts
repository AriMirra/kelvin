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
export class ClientVehiclesComponent implements OnInit {

  client: User;
  vehicles: Vehicle[] = [];
  devices: Device[] = [];
  deviceIdMap: Map<string, Device> = new Map<string, Device>();

  vehicleSearch = '';

  constructor(private vehicleService: VehicleService, private clientService: UserService, private deviceService: DeviceService) {
    const futureClient = this.clientService.getLoggedUser();
    const futureDevices = this.deviceService.fetchDevices();

    forkJoin(futureClient, futureDevices)
      .subscribe(([client, devices]) => {
        this.client = client;
        this.devices = devices;
        this.vehicleService.getUserVehicles(client.id).subscribe(vehicles => {
            this.vehicles = vehicles;
            this.vehicles.map(v => {
                const device = this.devices.find(d => d.id === v.deviceId);
                return [v.id, this.client, device] as ([string, User, Device]);
            }).forEach(([id, c, device]) => {
                this.deviceIdMap.set(id, device);
            });
        });
    });
  }

  ngOnInit() {
  }

  getVehicleDevice(vehicle: Vehicle): Device {
    return this.deviceIdMap.get(vehicle.id);
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
