import {Component, OnInit} from '@angular/core';
import {VehicleUpdate} from '../../../../shared/vehicles/VehicleUpdate';
import {VehicleService} from '../../../services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  addingVehicle: boolean;
  vehicleWithoutDevice: boolean;
  vehicleWithoutClient: boolean;
  v = VehicleUpdate.empty();

  constructor(private vehicleService: VehicleService) {
    this.addingVehicle = false;
    this.vehicleWithoutDevice = true; // TODO boolean depends on the list of vehicles.
    this.vehicleWithoutClient = true; // TODO boolean depends on the list of vehicles.
  }

  ngOnInit() {
  }

  toggleAddingVehicle() {
    this.addingVehicle = !this.addingVehicle;
  }
}
