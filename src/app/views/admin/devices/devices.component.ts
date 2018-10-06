import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {Device} from '../../../../shared/devices/Device';
import {DeviceCredentials} from '../../../../shared/devices/DeviceCredentials';
import {DeviceUpdate} from '../../../../shared/devices/DeviceUpdate';
import {DeviceService} from '../../../services/device.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  addingDevice: boolean;

  clients = [];
  devices: Device[] = [];

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

  constructor(private deviceService: DeviceService, private clientService: UserService) {
    this.addingDevice = false;
  }

  ngOnInit() {
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
        this.showDeleteMsg = true;
        setTimeout(() => this.showDeleteMsg = false, 1000);
      });
  }

  cancelDelete() {
    this.deleteDeviceId = undefined;
  }

  // Search

  deviceSearchFilter(device: Device): boolean {
    return !![device.alias, device.mac]
      .map(e => e.toLowerCase())
      .find(e => e.includes(this.deviceSearch));
  }

}
