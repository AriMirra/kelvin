import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {Device} from '../../../../shared/devices/Device';
import {DeviceCredentials} from '../../../../shared/devices/DeviceCredentials';
import {DeviceUpdate} from '../../../../shared/devices/DeviceUpdate';
import {DeviceService} from '../../../services/device.service';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';
import {VehicleService} from '../../../services/vehicle.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  addingDevice: boolean;

  devices: Device[] = [];
  vehicleIdMap: Map<string, Vehicle> = new Map<string, Vehicle>();

  deviceSearch = '';

  newDevice: DeviceCredentials = DeviceCredentials.empty();
  successfulAdd: boolean;
  showSubmitMsg = false;

  editingDevice: DeviceUpdate = DeviceUpdate.empty();
  editDeviceId: string;
  successfulEdit: boolean;
  showEditMsg = false;

  deleteDeviceId: string;
  successfulDelete: boolean;
  showDeleteMsg = false;

  constructor(private deviceService: DeviceService, private vehicleService: VehicleService) {
    this.load();

    this.addingDevice = false;
  }

  load() {
      const futureDevices = this.deviceService.fetchDevices();
      const futureVehicles = this.vehicleService.fetchVehicles();

      forkJoin(futureDevices, futureVehicles)
          .subscribe(([devices, vehicles]) => {
              this.devices = devices;

              this.devices.filter(d => d.assigned).map(d => {
                  const id = d.id;
                  const vehicle = vehicles.find(v => v.deviceId === id);
                  return [id, vehicle] as ([string, Vehicle]);
              }).forEach(([id, vehicle]) => {
                  this.vehicleIdMap.set(id, vehicle);
              });

          });
  }

  ngOnInit() {
  }

  getDeviceVehicle(device: Device): Vehicle {
    return this.vehicleIdMap.get(device.id);
  }

  // Add

  toggleAddingDevice() {
    this.addingDevice = !this.addingDevice;
  }

  submitDevice() {
    this.deviceService
      .addDevice(this.newDevice)
      .subscribe(submitted => {
        this.successfulAdd = submitted;
        if  (this.successfulAdd) {
          this.load();
        }
        this.showSubmitMsg = true;
        setTimeout(() => this.showSubmitMsg = false, 1000);
      });
  }

  // Edit

  startDeviceEdit(device: Device) {
    this.editingDevice = DeviceUpdate.for(device);
    this.editDeviceId = device.id;
  }

  editDevice() {
    this.deviceService
      .updateDevice(this.editDeviceId, this.editingDevice)
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
    this.editingDevice = DeviceUpdate.empty();
    this.editDeviceId = undefined;
  }

  // Delete

  startDeviceDelete(id: string) {
    this.deleteDeviceId = id;
  }

  deleteDevice() {
    this.deviceService
      .deleteDevice(this.deleteDeviceId)
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
    this.deleteDeviceId = undefined;
  }

  // Search

  filteredDevices(): Device[] {
    return this.devices.filter(d => this.deviceSearchFilter(d));
  }

  deviceSearchFilter(device: Device): boolean {
    return !![device.alias, device.mac]
        .map(e => e.toLowerCase())
        .find(e => e.includes(this.deviceSearch));
  }

}
