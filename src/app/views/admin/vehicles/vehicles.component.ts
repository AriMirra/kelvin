import {Component, OnInit} from '@angular/core';
import {VehicleUpdate} from '../../../../shared/vehicles/VehicleUpdate';
import {VehicleService} from '../../../services/vehicle.service';
import {VehicleCredentials} from '../../../../shared/vehicles/VehicleCredentials';
import {UserService} from '../../../services/user.service';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  addingVehicle: boolean;
  vehicleWithoutDevice: boolean;
  vehicleWithoutClient: boolean;

  clients = [];
  vehicles: Vehicle[] = [];

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

  constructor(private vehicleService: VehicleService, private clientService: UserService) {
    this.addingVehicle = false;
    this.vehicleWithoutDevice = true; // TODO boolean depends on the list of vehicles.
    this.vehicleWithoutClient = true; // TODO boolean depends on the list of vehicles.
  }

  ngOnInit() {
  }

  // Add

  toggleAddingVehicle() {
    this.addingVehicle = !this.addingVehicle;
  }

  submitVehicle() {
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

  // Search
  vehicleSearchFilter(vehicle: Vehicle): boolean {
    return !![vehicle.model, vehicle.brand, vehicle.domain, vehicle.ownerId]
        .map(e => e.toLowerCase())
        .find(e => e.includes(this.vehicleSearch));
  }
}
